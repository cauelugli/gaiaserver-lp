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

export default function AddMultipleProductForm({
  openAdd,
  setOpenAdd,
  fetchData,
  toast,
}) {
  const [name, setName] = React.useState("");
  const [image, setImage] = React.useState("");
  const [type, setType] = React.useState("");
  const [model, setModel] = React.useState("");
  const [size, setSize] = React.useState("");
  const [groupingType, setGroupingType] = React.useState("Unidade");
  const [buyValue, setBuyValue] = React.useState(0);
  const [sellValue, setSellValue] = React.useState(0);

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

  const handleAdd = async (e) => {
    e.preventDefault();
    const imageBase64 = await convertImageToBase64(image);
    try {
      const res = await api.post("/products", {
        name,
        image: imageBase64,
        type,
        model,
        size,
        groupingType,
        buyValue,
        sellValue,
      });
      if (res.data) {
        toast.success("Produto Adicionado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenAdd(!openAdd);
      fetchData();
    } catch (err) {
      alert("Vish, deu não...");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleAdd}>
      <DialogTitle>Novos Produtos</DialogTitle>
      <DialogContent>
        <Grid
          container
          sx={{ mt: 2 }}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item>
            <Typography sx={{ fontSize: 14 }}>Nome</Typography>
            <TextField
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ width: 200 }}
            />
          </Grid>

          <Grid item sx={{ ml: 1 }}>
            <Typography sx={{ fontSize: 14 }}>Tipo</Typography>
            <TextField
              size="small"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              variant="outlined"
              sx={{ width: 100 }}
            />
          </Grid>

          <Grid item sx={{ ml: 1 }}>
            <Typography sx={{ fontSize: 14 }}>Tamanho</Typography>
            <TextField
              size="small"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              required
              variant="outlined"
              sx={{ width: 100 }}
            />
          </Grid>

          <Grid item sx={{ ml: 1 }}>
            <Typography sx={{ fontSize: 14 }}>Cor</Typography>
            <TextField
              size="small"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              required
              variant="outlined"
              sx={{ width: 100 }}
            />
          </Grid>

          <Grid item sx={{ mx: 1 }}>
            <Typography sx={{ fontSize: 14 }}>Modelo</Typography>
            <TextField
              size="small"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
              variant="outlined"
              sx={{ width: 100 }}
            />
          </Grid>

          <Grid item>
            <Typography sx={{ fontSize: 14 }}>Agrupamento</Typography>
            <Select
              size="small"
              value={groupingType}
              onChange={(e) => setGroupingType(e.target.value)}
              required
              sx={{ width: 110 }}
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
          <Grid item sx={{ ml: 1 }}>
            <Typography sx={{ fontSize: 14 }}>Valor de Compra</Typography>
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
              sx={{ width: 120 }}
            />
          </Grid>

          <Grid item sx={{ ml: 1 }}>
            <Typography sx={{ fontSize: 14 }}>Valor de Venda</Typography>
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
              sx={{ width: 120 }}
            />
          </Grid>
          <Grid item sx={{ ml: 0.5, mt: 2.5 }}>
            {sellValue > 0 && buyValue > 0 && (
              <Typography sx={{ fontSize: 12, color: "green" }}>
                +{(((sellValue - buyValue) / buyValue) * 100).toFixed(2)}% por {groupingType}
              </Typography>
            )}
          </Grid>
        </Grid>

        <Grid sx={{ mt: 2 }}>
          <Typography>Imagem</Typography>
          <div>
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              style={{ display: "none" }}
              onChange={(e) => {
                const selectedImage = e.target.files[0];
                setImage(selectedImage);
              }}
              required
            />
            {!image && (
              <label htmlFor="fileInput">
                <Button
                  variant="outlined"
                  color="primary"
                  component="span"
                  size="small"
                  startIcon={<FileUploadIcon />}
                >
                  Carregar Imagem
                </Button>
              </label>
            )}
          </div>
        </Grid>

        {image && (
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item>
              <img
                src={URL.createObjectURL(image)}
                alt="Prévia da Imagem"
                style={{
                  marginTop: 20,
                  maxWidth: "200px",
                  maxHeight: "200px",
                }}
              />
            </Grid>
            <Grid item>
              <FormHelperText>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={() => setImage("")}
                >
                  Remover
                </Button>
              </FormHelperText>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpenAdd(!openAdd)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
}
