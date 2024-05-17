/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import { io } from "socket.io-client";

const socket = io("http://localhost:5002");

import {
  Avatar,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
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

import DeleteIcon from "@mui/icons-material/Delete";
import DialogHeader from "../../components/small/DialogHeader";
import FormEndLineTenant from "../../components/small/FormEndLineTenant";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function AddStockForm({
  userName,
  stockItems,
  onClose,
  refreshData,
  setRefreshData,
  configData,
  configCustomization,
  toast,
  userId
}) {
  const [selectedItemId, setSelectedItemId] = React.useState(null);
  const [itemList, setItemList] = React.useState([]);
  const [quantityInput, setQuantityInput] = React.useState({});
  const [buyValueInput, setBuyValueInput] = React.useState({});

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
        createdBy: userName,
        type: "Estoque",
        status: configData.stockEntriesNeedApproval ? "Aberto" : "Aprovado",
      });
      if (res.data) {
        toast.success("Entrada de Mercadorias Adicionada!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        socket.emit("newDataRefreshButton", {
          page: "stock",
          userId: userId,
        });
      }
      onClose();
      setRefreshData(!refreshData);
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

  const handleIncrement = () => {
    if (selectedItemId !== null) {
      const selectedItemData = stockItems.find(
        (item) => item._id === selectedItemId
      );
      if (selectedItemData) {
        const newItem = {
          _id: selectedItemData._id,
          name: selectedItemData.name,
          selectedQuantity: parseInt(quantityInput[selectedItemId] || 1, 10),
          buyValue: parseFloat(
            buyValueInput[selectedItemId] || selectedItemData.buyValue,
            10
          ),
        };

        const updatedItemList = [...itemList];
        updatedItemList.push(newItem);
        setItemList(updatedItemList);
        setSelectedItemId(null);
      }
    }
  };

  return (
    <form onSubmit={handleAdd}>
      <DialogHeader special specialTitle="Adicionar Produtos ao Estoque" />
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography sx={{ fontSize: 13 }}></Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: 13 }}>Item</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography sx={{ fontSize: 13 }}>Em Estoque</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography sx={{ fontSize: 13 }}>Valor de Compra</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography sx={{ fontSize: 13 }}>
                    Adicionar ao Estoque
                  </Typography>
                </TableCell>
              </TableRow>
              {stockItems.map((item) => (
                <>
                  <TableRow key={item._id} cursor="pointer">
                    <TableCell>
                      <Checkbox
                        size="small"
                        sx={{ mb: 0.5, mr: -4 }}
                        checked={item._id === selectedItemId}
                        onChange={() => handleChecked(item._id)}
                      />
                    </TableCell>
                    <TableCell cursor="pointer">
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                      >
                        <Typography sx={{ fontSize: 13 }}>
                          {item.name}
                        </Typography>
                        <Avatar
                          alt="Imagem do Produto"
                          src={`http://localhost:3000/static/${item.image}`}
                          sx={{ width: 32, height: 32, ml: 1 }}
                        />
                      </Grid>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontSize: 13 }}>
                        {item.quantity}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <TextField
                        disabled={
                          item._id !== selectedItemId ||
                          itemList.some((item) => item._id === selectedItemId)
                        }
                        size="small"
                        sx={{ width: 120 }}
                        value={buyValueInput[item._id] || item.buyValue}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          // Use uma expressão regular para validar o formato do número
                          if (/^\d+(\.\d{0,2})?$/.test(newValue)) {
                            setBuyValueInput({
                              ...buyValueInput,
                              [item._id]: newValue,
                            });
                          }
                        }}
                        inputProps={{
                          min: 0,
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ mr: 0 }}>
                              R$
                            </InputAdornment>
                          ),
                        }}
                      />
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
                      <Typography>Item:</Typography>
                    </Grid>
                    <Grid item sx={{ ml: 1 }}>
                      <Typography>{item.name}</Typography>
                    </Grid>
                    <Grid item sx={{ ml: 2 }}>
                      <Typography>
                        Quantidade:
                      </Typography>
                    </Grid>
                    <Grid item sx={{ ml: 1 }}>
                      <Typography>+{item.selectedQuantity}</Typography>
                    </Grid>
                    <Grid item sx={{ ml: 2 }}>
                      <Typography>
                        Valor por Unidade:
                      </Typography>
                    </Grid>
                    <Grid item sx={{ ml: 1 }}>
                      <Typography>R$ {item.buyValue}</Typography>
                    </Grid>
                    <Grid item sx={{ ml: 2 }}>
                      <Typography >
                        Valor Total:
                      </Typography>
                    </Grid>
                    <Grid item sx={{ ml: 1 }}>
                      <Typography>
                        R$ {(item.buyValue * item.selectedQuantity).toFixed(2)}
                      </Typography>
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
              <Typography sx={{ mt: 2 }}>
                Total da Lista: R${" "}
                {itemList
                  .reduce(
                    (total, item) =>
                      total + item.buyValue * item.selectedQuantity,
                    0
                  )
                  .toFixed(2)}
              </Typography>
            </ul>
          </Typography>
        </Grid>
      </DialogContent>
      <FormEndLineTenant configCustomization={configCustomization} />
      <DialogActions>
        {itemList.length > 0 && (
          <Button type="submit" variant="contained" color="success">
            OK
          </Button>
        )}
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
