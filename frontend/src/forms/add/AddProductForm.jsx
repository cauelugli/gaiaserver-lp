/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function AddProductForm({
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
    const imageBase64 = await convertImageToBase64(image)
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
            onChange={(e) => {
              const selectedImage = e.target.files[0];
              setImage(selectedImage);
            }}
            required
          />
        </Grid>
        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="Prévia da Imagem"
            style={{ marginTop:20, maxWidth: "200px", maxHeight: "200px" }}
          />
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
