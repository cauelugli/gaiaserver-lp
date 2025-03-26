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
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  FormHelperText,
  Grid2,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { icons } from "../../icons";

import { handleCurrencyValueChange } from "../../../../controllers/handlers/handlers";
import { loadPage } from "../../../../controllers/functions/overallFunctions";

import DialogHeader from "../../components/small/DialogHeader";
import CurrencyTableProductsCell from "../../components/tableCells/CurrencyTableProductsCell";

export default function AddProductForm({
  refreshData,
  setRefreshData,
  onClose,
  userId,
  baseProduct,
  mainColor,
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
        fields,
        images: imagePaths,
      });

      if (productResponse.data) {
        toast.success(`Produto Adicionado!`, {
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
      onClose();
      setRefreshData(!refreshData);
      api.post("/log", {
        source: userId,
        target: productResponse.data,
        label: "Produto",
        type: "add",
      });
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

  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    loadPage().then(() => {
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress sx={{ color: mainColor }} />
      </Box>
    );
  }

  return (
    <>
      <DialogHeader
        special
        specialTitle={`Novo Produto`}
        femaleGender={false}
        extraSmall
      />
      <form onSubmit={handleAddProduct}>
        <DialogContent>
          <Typography sx={{ fontSize: 16, fontWeight: "bold", mb: 1 }}>
            Campos do Produto
          </Typography>
          <Grid2
            id="fieldsRow"
            container
            spacing={1.5}
            wrap="wrap"
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Grid2 item>
              <Typography sx={{ fontSize: 13 }}>Tipo</Typography>
              <TextField
                size="small"
                value={baseProduct.type}
                readOnly
                variant="outlined"
                sx={{ width: 200 }}
              />
            </Grid2>

            <Grid2 item>
              <Typography sx={{ fontSize: 13 }}>Nome</Typography>
              <TextField
                size="small"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                sx={{ width: 200 }}
              />
            </Grid2>

            <Grid2 item>
              <Typography sx={{ fontSize: 13 }}>Valor de Compra</Typography>
              <TextField
                value={buyValue}
                onChange={(e) => handleCurrencyValueChange(e, setBuyValue)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">R$</InputAdornment>
                  ),
                }}
                size="small"
                sx={{ width: 200 }}
              />
            </Grid2>
            <>
              <Grid2 item>
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
                  sx={{ width: 200 }}
                />
              </Grid2>

              <Grid2 item>
                <Typography sx={{ fontSize: 13 }}>
                  Lucro por Item Vendido
                </Typography>
                <TextField
                  size="small"
                  value={
                    buyValue > 0
                      ? (((sellValue - buyValue) / buyValue) * 100).toFixed(2) +
                        "%"
                      : "N/A"
                  }
                  readOnly
                  sx={{ width: 200 }}
                />
              </Grid2>
            </>

            {baseProduct.fields.map((field, index) => (
              <Grid2 item key={index}>
                <Typography sx={{ fontSize: 13 }}>{field.name}</Typography>
                {field.type === "string" && (
                  <TextField
                    size="small"
                    value={field.value}
                    onChange={(e) => handleFieldChange(index, e.target.value)}
                    sx={{ width: 200 }}
                  />
                )}
                {field.type === "number" &&
                  (field.numberType === "integer" ? (
                    <TextField
                      size="small"
                      value={field.value}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        handleFieldChange(index, value);
                      }}
                      onKeyPress={(e) => {
                        if (/\D/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      sx={{ width: 200 }}
                      type="text"
                    />
                  ) : (
                    <CurrencyTableProductsCell
                      field={field}
                      value={fields[index]?.value || ""}
                      onChange={(newValue) => {
                        setFields((prevFields) => {
                          const updatedFields = [...prevFields];
                          updatedFields[index] = {
                            ...updatedFields[index],
                            value: newValue,
                          };
                          return updatedFields;
                        });
                      }}
                      modalOptions={{ maxWidth: "md" }}
                      hideAdornment
                    />
                  ))}
                {field.type === "options" &&
                  (field.allowMultiple ? (
                    <>
                      <Select
                        sx={{ width: 200 }}
                        size="small"
                        value={fields[index].value || []}
                        onChange={(e) =>
                          handleFieldChange(
                            index,
                            e.target.value,
                            true,
                            field.allowMultiple
                          )
                        }
                        multiple={true}
                      >
                        {field.options.map((option, index) => (
                          <MenuItem key={index} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </>
                  ) : (
                    <>
                      <Select
                        sx={{ width: 200 }}
                        size="small"
                        value={fields[index].value || ""}
                        onChange={(e) =>
                          handleFieldChange(index, e.target.value)
                        }
                        multiple={false}
                      >
                        {field.options.map((option, index) => (
                          <MenuItem key={index} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </>
                  ))}
                {field.type === "currency" && (
                  <CurrencyTableProductsCell
                    field={field}
                    value={fields[index]?.value || ""}
                    onChange={(newValue) => {
                      setFields((prevFields) => {
                        const updatedFields = [...prevFields];
                        updatedFields[index] = {
                          ...updatedFields[index],
                          value: newValue,
                        };
                        return updatedFields;
                      });
                    }}
                    modalOptions={{ maxWidth: "md" }}
                  />
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
                        sx={{ width: 200 }}
                      />
                    )}
                  </InputMask>
                )}
              </Grid2>
            ))}
          </Grid2>

          <Typography sx={{ fontSize: 16, fontWeight: "bold", mt: 4 }}>
            Imagens do Produto
          </Typography>

          <Grid2
            id="imagesRow"
            container
            spacing={1.5}
            wrap="wrap"
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            {images.map((img, index) => (
              <Grid2 item key={index} sx={{ mt: index === 0 && 2.5 }}>
                <Grid2 container direction="column" alignItems="center">
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
                      startIcon={<icons.DeleteIcon />}
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
                </Grid2>
              </Grid2>
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
              <Grid2 container direction="column" alignItems="center">
                <icons.PhotoCameraIcon />
                <Typography sx={{ fontSize: 11 }}>Adicionar Imagem</Typography>
              </Grid2>
            </Button>
            <input
              id="image-upload-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAddImage}
            />
          </Grid2>
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
    </>
  );
}
