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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function AddStockForm({
  openAdd,
  stockItems,
  setOpenAdd,
  fetchData,
}) {
  const [name, setName] = React.useState("");
  const [buyValue, setBuyValue] = React.useState(0);
  const [sellValue, setSellValue] = React.useState(0);
  const [quantity, setQuantity] = React.useState(0);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/stockItems", {
        name,
        buyValue,
        sellValue,
        quantity,
      });
      res.data && alert("Itens adicionado ao Estoque!");
      setOpenAdd(!openAdd);
      fetchData();
    } catch (err) {
      alert("Vish, deu não...");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleAdd}>
      <DialogTitle>Adicionar Itens ao Estoque</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow
                sx={{
                  backgroundColor: "#ccc",
                }}
              >
                <TableCell align="left">
                  <Typography sx={{ fontSize: 14 }}>Item</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography sx={{ fontSize: 14 }}>Valor de Compra</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography sx={{ fontSize: 14 }}>Valor de Venda</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography sx={{ fontSize: 14 }}>Em Estoque</Typography>
                </TableCell>
              </TableRow>
              {stockItems.map((item) => (
                <>
                  <TableRow key={item._id}>
                    <TableCell align="left">
                      <Typography sx={{ fontSize: 14 }}>{item.name}</Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography sx={{ fontSize: 14 }}>
                        R${item.buyValue}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography sx={{ fontSize: 14 }}>
                       R${item.sellValue}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography sx={{ fontSize: 14 }}>
                        {item.quantity}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
