/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function AddStockForm({
  openAdd,
  stockItems,
  setOpenAdd,
  fetchData,
}) {
  const [selectedItemId, setSelectedItemId] = React.useState(null);
  const [itemList, setItemList] = React.useState([]);
  const [quantityInput, setQuantityInput] = React.useState({});

  const handleChecked = (id) => {
    setSelectedItemId(id === selectedItemId ? null : id);
  };

  const handleRemove = (index) => {
    const updatedItemList = [...itemList];
    updatedItemList.splice(index, 1);
    setItemList(updatedItemList);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/stock", {
        itemList,
      });
      res.data && alert("Items Adicionados ao Estoque com Sucesso!");
      setOpenAdd(!openAdd);
      fetchData();
    } catch (err) {
      alert("Vish, deu não...");
      console.log(err);
    }
  };

  const handleIncrement = () => {
    if (selectedItemId !== null) {
      const selectedItemData = stockItems.find(
        (item) => item._id === selectedItemId
      );
      if (selectedItemData) {
        const newItem = {
          _id: selectedItemData._id,
          name: selectedItemData.name,
          selectedQuantity: parseInt(quantityInput[selectedItemId] || 1, 10), // Valor do TextField
        };

        // Crie uma cópia da lista existente e adicione o novo item
        const updatedItemList = [...itemList];
        updatedItemList.push(newItem);

        // Atualize o estado com a nova lista
        setItemList(updatedItemList);

        // Deselecionar o item
        setSelectedItemId(null);
      }
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
                <TableCell>
                  <Typography sx={{ fontSize: 14 }}></Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: 14 }}>Item</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography sx={{ fontSize: 14 }}>Em Estoque</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography sx={{ fontSize: 14 }}>
                    Adicionar ao Estoque
                  </Typography>
                </TableCell>
              </TableRow>
              {stockItems.map((item) => (
                <>
                  <TableRow
                    key={item._id}
                    cursor="pointer"
                    sx={{
                      backgroundColor: item._id === selectedItemId && "#eee",
                      "&:hover": {
                        backgroundColor: "#eee",
                      },
                    }}
                  >
                    <TableCell>
                      <Checkbox
                        size="small"
                        sx={{ mb: 0.5, mr: -4 }}
                        checked={item._id === selectedItemId}
                        onChange={() => handleChecked(item._id)}
                      />
                    </TableCell>
                    <TableCell cursor="pointer">
                      <Typography sx={{ fontSize: 14 }}>{item.name}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontSize: 14 }}>
                        {item.quantity}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Grid item>
                        <Grid
                          container
                          direction="row"
                          alignItems="center"
                          justifyContent="flex-end"
                        >
                          <Grid item>
                            <TextField
                              disabled={
                                item._id !== selectedItemId ||
                                itemList.some(
                                  (item) => item._id === selectedItemId
                                )
                              }
                              type="number"
                              size="small"
                              sx={{ width: 80 }}
                              value={quantityInput[item._id] || ""}
                              onChange={(e) => {
                                const newValue = Math.max(0, e.target.value);
                                setQuantityInput({
                                  ...quantityInput,
                                  [item._id]: newValue,
                                });
                              }}
                              inputProps={{
                                min: 0,
                              }}
                            />
                          </Grid>
                          <Grid item>
                            <Button
                              disabled={
                                item._id !== selectedItemId ||
                                itemList.some(
                                  (item) => item._id === selectedItemId
                                )
                              }
                              size="small"
                              sx={{ ml: 1 }}
                              variant="contained"
                              onClick={handleIncrement}
                            >
                              <Typography sx={{ fontSize: 10 }}>
                                Adicionar
                              </Typography>
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid>
          {itemList.length > 0 && (
            <Typography sx={{ mt: 2 }}>Lista de Itens:</Typography>
          )}
          <Typography>
            <ul style={{ width: "100%" }}>
              {itemList.map((item, index) => (
                <li key={item._id}>
                  <Grid container direction="row">
                    <Grid item>
                      <Typography sx={{ color: "#777" }}>Item:</Typography>
                    </Grid>
                    <Grid item sx={{ ml: 1 }}>
                      <Typography>{item.name}</Typography>
                    </Grid>
                    <Grid item sx={{ ml: 2 }}>
                      <Typography sx={{ color: "#777" }}>
                        Quantidade:
                      </Typography>
                    </Grid>
                    <Grid item sx={{ ml: 1 }}>
                      <Typography>+{item.selectedQuantity}</Typography>
                    </Grid>
                    <Grid item sx={{ ml: 2 }}>
                      <DeleteIcon
                        onClick={() => handleRemove(index)}
                        size="small"
                        variant="contained"
                        color="error"
                        cursor="pointer"
                      />
                    </Grid>
                  </Grid>
                </li>
              ))}
            </ul>
          </Typography>
        </Grid>
      </DialogContent>
      <DialogActions>
        {itemList.length > 0 && (
          <Button type="submit" variant="contained" color="success">
            OK
          </Button>
        )}
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
