/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import DeleteIcon from "@mui/icons-material/Delete";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function EditProductForm({
  selectedProduct,
  openEdit,
  setOpenEdit,
  fetchData,
  toast,
}) {
  const [name, setName] = React.useState(selectedProduct.name);
  const [image, setImage] = React.useState(selectedProduct.image);
  const [newImage, setNewImage] = React.useState("");
  const [type, setType] = React.useState(selectedProduct.type);
  const [model, setModel] = React.useState(selectedProduct.model);
  const [size, setSize] = React.useState(selectedProduct.size);
  const [groupingType, setGroupingType] = React.useState(
    selectedProduct.groupingType
  );
  const [buyValue, setBuyValue] = React.useState(selectedProduct.buyValue);
  const [sellValue, setSellValue] = React.useState(selectedProduct.sellValue);

  const convertImageToBase64 = (imageFile) => {
    return new Promise((resolve, reject) => {
      if (!imageFile) {
        reject("Nenhuma imagem selecionada.");
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        resolve(event.target.result);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(imageFile);
    });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    let imageBase64;
    if (newImage) {
      imageBase64 = await convertImageToBase64(newImage);
    }
    try {
      const res = await api.put("/products", {
        productId: selectedProduct._id,
        name,
        image: newImage ? imageBase64 : selectedProduct.image,
        type,
        model,
        size,
        groupingType,
        buyValue,
        sellValue,
      });
      if (res.data) {
        toast.success("Produto Editado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenEdit(!openEdit);
      fetchData();
    } catch (err) {
      alert("Vish, deu não...");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleEdit}>
      <DialogTitle>Novo Produto</DialogTitle>
      <DialogContent>
        <Grid
          container
          sx={{ pr: "4%", mt: 2 }}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item>
            <Typography>Nome</Typography>
            <TextField
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ width: 220 }}
            />
          </Grid>

          <Grid item sx={{ ml: 2 }}>
            <Typography>Tipo</Typography>
            <TextField
              size="small"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              variant="outlined"
              sx={{ width: 140 }}
            />
          </Grid>

          <Grid item sx={{ ml: 2 }}>
            <Typography>Tamanho</Typography>
            <TextField
              size="small"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              required
              variant="outlined"
              sx={{ width: 120 }}
            />
          </Grid>

          <Grid item sx={{ mx: 2 }}>
            <Typography>Modelo</Typography>
            <TextField
              size="small"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
              variant="outlined"
              sx={{ width: 140 }}
            />
          </Grid>

          <Grid item>
            <Typography>Agrupamento</Typography>
            <Select
              size="small"
              value={groupingType}
              onChange={(e) => setGroupingType(e.target.value)}
              required
              sx={{ width: 120 }}
            >
              <MenuItem value="Unidade">
                <Typography>Unidade</Typography>
              </MenuItem>
              <MenuItem value="Caixa">
                <Typography>Caixa</Typography>
              </MenuItem>
              <MenuItem value="Kit">
                <Typography>Kit</Typography>
              </MenuItem>
            </Select>
          </Grid>
        </Grid>

        <Grid
          container
          sx={{ pr: "4%", mt: 2 }}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item sx={{ mt: 2 }}>
            <Typography>Valor de Compra</Typography>
            <TextField
              type="number"
              size="small"
              value={buyValue}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
              }}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue >= 0) {
                  setBuyValue(inputValue);
                }
              }}
              required
              variant="outlined"
              sx={{ width: 130 }}
            />
          </Grid>

          <Grid item sx={{ ml: 2, mt: 2 }}>
            <Typography>Valor de Venda</Typography>
            <TextField
              type="number"
              size="small"
              value={sellValue}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
              }}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue >= 0) {
                  setSellValue(inputValue);
                }
              }}
              required
              variant="outlined"
              sx={{ width: 130 }}
            />
          </Grid>
          {sellValue > 0 && buyValue > 0 && (
            <Grid item sx={{ ml: 2, mt: 4.5 }}>
              <Typography>
                Lucro de{" "}
                <span style={{ color: "green" }}>
                  {(((sellValue - buyValue) / buyValue) * 100).toFixed(2)}%
                </span>{" "}
                por {groupingType.toLowerCase()}
              </Typography>
            </Grid>
          )}
        </Grid>
        <Grid sx={{ mt: 2 }}>
          <Typography>Imagem</Typography>
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            style={{ display: "none" }}
            onChange={(e) => {
              const selectedImage = e.target.files[0];
              setNewImage(selectedImage);
            }}
          />
          {!newImage && (
            <label htmlFor="fileInput">
              <Button
                variant="outlined"
                color="primary"
                component="span"
                size="small"
                startIcon={<FileUploadIcon />}
              >
                Alterar Imagem
              </Button>
            </label>
          )}
        </Grid>
        <Grid
          container
          sx={{ pr: "4%", mt: 2 }}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item sx={{ mb: newImage ? 5 : 0 }}>
            {selectedProduct.image && (
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
              >
                <img
                  src={selectedProduct.image}
                  alt="Prévia da Imagem"
                  style={{
                    marginTop: 20,
                    width: "200px",
                    height: "200px",
                    opacity: newImage ? "0.5" : "1",
                  }}
                />
                {newImage && <Typography>Imagem Anterior</Typography>}
              </Grid>
            )}
          </Grid>
          <Grid item sx={{ ml: 5 }}>
            {newImage && (
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item>
                  <img
                    src={URL.createObjectURL(newImage)}
                    alt="Prévia da Imagem"
                    style={{
                      marginTop: 20,
                      width: "200px",
                      height: "200px",
                    }}
                  />
                </Grid>
                <Grid item>
                  <Typography>Nova Imagem</Typography>
                </Grid>
                <Grid item>
                  <FormHelperText>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => setNewImage("")}
                    >
                      Remover
                    </Button>
                  </FormHelperText>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpenEdit(!openEdit)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
}
