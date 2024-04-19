/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Avatar,
  Button,
  Checkbox,
  Dialog,
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

import DeleteIcon from "@mui/icons-material/Delete";
import DialogHeader from "../../components/small/DialogHeader";
import FormEndLineTenant from "../../components/small/FormEndLineTenant";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function AddStockProductForm({
  userName,
  userDepartment,
  products,
  onClose,
  refreshData,
  setRefreshData,
  configData,
  configCustomization,
  toast,
}) {
  const [selectedItemId, setSelectedItemId] = React.useState(null);
  const [itemList, setItemList] = React.useState([]);
  const [quantityInput, setQuantityInput] = React.useState({});
  const [buyValueInput, setBuyValueInput] = React.useState({});
  const [openImage, setOpenImage] = React.useState(false);

  const handleOpenImage = () => {
    setOpenImage(true);
  };

  const handleCloseImage = () => {
    setOpenImage(false);
  };

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
        userDepartment,
        userName,
        type: "Produto",
        status: configData.stockEntriesNeedApproval ? "Aberto" : "Aprovado",
      });
      if (res.data) {
        toast.success("Entrada de Produtos Adicionada!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
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
      const selectedItemData = products.find(
        (item) => item._id === selectedItemId
      );
      if (selectedItemData) {
        const newItem = {
          _id: selectedItemData._id,
          name: selectedItemData.name,
          type: selectedItemData.type,
          brand: selectedItemData.brand,
          model: selectedItemData.model,
          size: selectedItemData.size,
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
                  <Typography sx={{ fontSize: 12 }}></Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: 12 }}>Item</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: 12 }}>Marca</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: 12 }}>Tipo</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: 12 }}>Modelo</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: 12 }}>Tamanho</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: 12 }}>Em Estoque</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography sx={{ fontSize: 12 }}>Valor de Compra</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography sx={{ fontSize: 12 }}>
                    Adicionar ao Estoque
                  </Typography>
                </TableCell>
              </TableRow>
              {products.map((item) => (
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
                    <TableCell>
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                      >
                        <Typography sx={{ fontSize: 12 }}>
                          {item.name}
                        </Typography>
                        <Avatar
                          alt="Imagem do Produto"
                          src={`http://localhost:3000/static/${item.image}`}
                          sx={{ width: 32, height: 32, ml: 1 }}
                          onDoubleClick={handleOpenImage}
                        />
                        <Dialog open={openImage} onClose={handleCloseImage}>
                          <DialogContent>
                            <img
                              src={`http://localhost:3000/static/${item.image}`}
                              alt="Imagem do Produto"
                              style={{ maxWidth: "100%" }}
                            />
                          </DialogContent>
                        </Dialog>
                      </Grid>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: 12 }}>
                        {item.brand}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: 12 }}>{item.type}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: 12 }}>
                        {item.model}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: 12 }}>{item.size}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: 12 }}>
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
                      <Typography sx={{ color: "#777", fontSize: 13 }}>
                        Item:
                      </Typography>
                    </Grid>
                    <Grid item sx={{ ml: 1 }}>
                      <Typography sx={{ fontSize: 13 }}>
                        {item.name} | {item.brand} | {item.type} | {item.model}{" "}
                        | {item.size}
                      </Typography>
                    </Grid>
                    <Grid item sx={{ ml: 2 }}>
                      <Typography sx={{ color: "#777", fontSize: 13 }}>
                        Quantidade:
                      </Typography>
                    </Grid>
                    <Grid item sx={{ ml: 1 }}>
                      <Typography sx={{ fontSize: 13 }}>
                        +{item.selectedQuantity}
                      </Typography>
                    </Grid>
                    <Grid item sx={{ ml: 2 }}>
                      <Typography sx={{ color: "#777", fontSize: 13 }}>
                        Valor por Unidade:
                      </Typography>
                    </Grid>
                    <Grid item sx={{ ml: 1 }}>
                      <Typography sx={{ fontSize: 13 }}>
                        R$ {item.buyValue}
                      </Typography>
                    </Grid>
                    <Grid item sx={{ ml: 2 }}>
                      <Typography sx={{ color: "#777", fontSize: 13 }}>
                        Valor Total:
                      </Typography>
                    </Grid>
                    <Grid item sx={{ ml: 1 }}>
                      <Typography sx={{ fontSize: 13 }}>
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
