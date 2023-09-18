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

export default function EditProductForm({
  selectedProduct,
  openEdit,
  setOpenEdit,
  fetchData,
  toast,
}) {
  const [name, setName] = React.useState(selectedProduct.name);
  const [type, setType] = React.useState(selectedProduct.type);
  const [model, setModel] = React.useState(selectedProduct.model);
  const [size, setSize] = React.useState(selectedProduct.size);
  const [groupingType, setGroupingType] = React.useState(selectedProduct.groupingType);
  const [buyValue, setBuyValue] = React.useState(selectedProduct.buyValue);
  const [sellValue, setSellValue] = React.useState(selectedProduct.sellValue);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/products", {
        productId: selectedProduct._id,
        name,
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
