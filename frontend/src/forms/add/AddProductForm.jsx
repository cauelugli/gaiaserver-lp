/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import InputMask from "react-input-mask";

const socket = io("http://localhost:5002");

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  Button,
  DialogActions,
  //   DialogActions,
  DialogContent,
  FormHelperText,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

export default function AddProductForm({
  userName,
  onClose,
  refreshData,
  setRefreshData,
  userId,
  baseProduct,
}) {
  const [name, setName] = React.useState("");
  const [buyValue, setBuyValue] = React.useState("");
  const [sellValue, setSellValue] = React.useState("");
  const [fields, setFields] = React.useState(
    baseProduct.fields.map((field) => ({ ...field, value: "" }))
  );
  const [images, setImages] = React.useState([]);

  const handleFieldChange = (index, value) => {
    const updatedFields = [...fields];
    updatedFields[index].value = value;
    setFields(updatedFields);
  };

  const handleAddImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImages((prevImages) => [...prevImages, file]);
    }
  };

  const handleCurrencyValueChange = (e, setValue) => {
    let inputValue = e.target.value.replace(/\D/g, ""); // Remove tudo que não é dígito
    inputValue = inputValue.replace(/^0+/, ""); // Remove zeros à esquerda
    if (inputValue.length < 3) {
      inputValue = inputValue.padStart(3, "0"); // Adiciona zeros à esquerda se necessário
    }
    const formattedValue = `${inputValue.slice(0, -2)}.${inputValue.slice(-2)}`; // Insere o ponto decimal
    setValue(formattedValue);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const uploadResponse = await api.post("/uploads/multipleFiles", formData);
      const imagePaths = uploadResponse.data.imagePaths;
      const productResponse = await api.post("/products", {
        type: baseProduct.type,
        name,
        buyValue,
        sellValue,
        fields: fields.map((field) => ({
          name: field.name,
          value: field.value,
        })),
        images: imagePaths,
        createdBy: "userName",
        // createdBy: userName,
      });

      if (productResponse.data) {
        toast.success("Produto Adicionado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        socket.emit("newDataRefreshButton", {
          page: "products",
          userId: userId,
        });
      }
      //   onClose();
      //   setRefreshData(!refreshData);
    } catch (err) {
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleAddProduct}>
      <DialogContent>
        <Typography sx={{ fontSize: 16, fontWeight: "bold", mb: 1 }}>
          Campos do Produto
        </Typography>
        <Grid
          id="fieldsRow"
          container
          spacing={1.5}
          wrap="wrap"
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item>
            <Typography sx={{ fontSize: 13 }}>Tipo</Typography>
            <TextField
              size="small"
              value={baseProduct.type}
              readOnly
              variant="outlined"
              sx={{ width: 150 }}
            />
          </Grid>

          <Grid item>
            <Typography sx={{ fontSize: 13 }}>Nome</Typography>
            <TextField
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ width: 150 }}
            />
          </Grid>

          <Grid item>
            <Typography sx={{ fontSize: 13 }}>Valor de Compra/Produção</Typography>
            <TextField
              value={buyValue}
              onChange={(e) => handleCurrencyValueChange(e, setBuyValue)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
              }}
              size="small"
              sx={{ width: 150 }}
            />
          </Grid>
          <Grid item>
            <Typography sx={{ fontSize: 13 }}>Valor de Venda</Typography>
            <TextField
              value={sellValue}
              onChange={(e) => handleCurrencyValueChange(e, setSellValue)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
              }}
              size="small"
              sx={{ width: 150 }}
            />
          </Grid>
          <Grid item>
            <Typography sx={{ fontSize: 13 }}>
              Lucro por Item Vendido
            </Typography>
            <TextField
              size="small"
              value={
                buyValue > 0
                  ? (((sellValue - buyValue) / buyValue) * 100).toFixed(2) + "%"
                  : "N/A"
              }
              readOnly
              sx={{ width: 150 }}
            />
          </Grid>

          {baseProduct.fields.map((field, index) => (
            <Grid item key={index}>
              <Typography sx={{ fontSize: 13 }}>{field.name}</Typography>
              {field.type === "string" && (
                <TextField
                  size="small"
                  value={field.value}
                  onChange={(e) => handleFieldChange(index, e.target.value)}
                  sx={{ width: 150 }}
                />
              )}
              {field.type === "number" && (
                <InputMask
                  mask="9999999999999999999999"
                  maskChar=""
                  value={field.value}
                  onChange={(e) => handleFieldChange(index, e.target.value)}
                >
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      size="small"
                      sx={{ width: 150 }}
                    />
                  )}
                </InputMask>
              )}
              {field.type === "options" && (
                <Select
                  sx={{ width: 150 }}
                  size="small"
                  value={field.value}
                  onChange={(e) => handleFieldChange(index, e.target.value)}
                >
                  {field.options.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              )}
              {field.type === "currency" && (
                <InputMask
                  mask="999999.99"
                  maskChar=""
                  value={field.value}
                  onChange={(e) => handleFieldChange(index, e.target.value)}
                >
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">R$</InputAdornment>
                        ),
                      }}
                      size="small"
                      sx={{ width: 150 }}
                    />
                  )}
                </InputMask>
              )}
              {field.type === "date" && (
                <InputMask
                  mask="99/99/9999"
                  value={field.value}
                  onChange={(e) => handleFieldChange(index, e.target.value)}
                >
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      size="small"
                      sx={{ width: 150 }}
                    />
                  )}
                </InputMask>
              )}
            </Grid>
          ))}
        </Grid>

        <Typography sx={{ fontSize: 16, fontWeight: "bold", mt: 4 }}>
          Imagens do Produto
        </Typography>

        <Grid
          id="imagesRow"
          container
          spacing={1.5}
          wrap="wrap"
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          {images.map((img, index) => (
            <Grid item key={index} sx={{ mt: index === 0 && 2.5 }}>
              <Grid container direction="column" alignItems="center">
                <img
                  src={URL.createObjectURL(img)}
                  alt="Prévia da Imagem"
                  style={{
                    marginTop: 10,
                    width: "80px",
                    height: "80px",
                  }}
                />
                <FormHelperText>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() =>
                      setImages((prevImages) =>
                        prevImages.filter((_, i) => i !== index)
                      )
                    }
                  >
                    Remover
                  </Button>
                </FormHelperText>
                {index === 0 && (
                  <FormHelperText sx={{ fontSize: 10 }}>
                    Imagem Principal
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          ))}
          <Button
            variant="contained"
            color="inherit"
            size="small"
            disabled={images.length === 10}
            onClick={() =>
              document.getElementById("image-upload-input").click()
            }
            sx={{ width: 80, height: 100, mt: 2, ml: 1 }}
          >
            <Grid container direction="column" alignItems="center">
              <PhotoCameraIcon />
              <Typography sx={{ fontSize: 11 }}>Adicionar Imagem</Typography>
            </Grid>
          </Button>
          <input
            id="image-upload-input"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAddImage}
          />
        </Grid>
      </DialogContent>
      <DialogActions sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            onClose();
          }}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
}
