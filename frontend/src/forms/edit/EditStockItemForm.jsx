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
  toast,
}) {
  const [name, setName] = React.useState(selectedStockItem.name);
  const [buyValue, setBuyValue] = React.useState(selectedStockItem.buyValue);
  const [sellValue, setSellValue] = React.useState(selectedStockItem.sellValue);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/stockItems", {
        stockItemId: selectedStockItem._id,
        name,
        buyValue,
        sellValue,
      });
      if (res.data) {
        toast.success("Item Editado com Sucesso!", {
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
            <Typography>Valor de Compra</Typography>
            <TextField
              type="number"
              size="small"
              value={buyValue}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 0 }}>
                    R$
                  </InputAdornment>
                ),
              }}
              onChange={(e) => setBuyValue(e.target.value)}
              required
              variant="outlined"
              sx={{ width: 150 }}
            />
          </Grid>
          <Grid item sx={{ mx: 2 }}>
            <Typography>Valor de Venda</Typography>
            <TextField
              type="number"
              size="small"
              value={sellValue}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 0 }}>
                    R$
                  </InputAdornment>
                ),
              }}
              onChange={(e) => setSellValue(e.target.value)}
              required
              variant="outlined"
              sx={{ width: 150 }}
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
