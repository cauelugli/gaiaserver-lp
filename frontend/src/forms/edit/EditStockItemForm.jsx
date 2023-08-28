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

export default function EditStockItemForm({
  selectedStockItem,
  openEdit,
  setOpenEdit,
  fetchData,
}) {
  const [name, setName] = React.useState(selectedStockItem.name);
  const [value, setValue] = React.useState(selectedStockItem.value);
  const [quantity, setQuantity] = React.useState(selectedStockItem.quantity);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/stockItems", {
        stockItemId: selectedStockItem._id,
        name,
        value,
        quantity,
      });
      res.data && alert("Item editado com Sucesso!");
      setOpenEdit(!openEdit);
      fetchData();
    } catch (err) {
      alert("Vish, deu não...");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleEdit}>
      <DialogTitle>Editando Item - {selectedStockItem.name}</DialogTitle>
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
              sx={{ width: 300 }}
            />
          </Grid>
          <Grid item sx={{ mx: 2 }}>
            <Typography>Valor</Typography>
            <TextField
              type="number"
              size="small"
              value={value}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
              }}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue >= 0) {
                  setValue(inputValue);
                }
              }}
              required
              variant="outlined"
              sx={{ width: 130 }}
            />
          </Grid>
          <Grid item sx={{ mx: 2 }}>
            <Typography>Quantidade</Typography>
            <TextField
              type="number"
              size="small"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              variant="outlined"
              sx={{ width: 130 }}
            />
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
