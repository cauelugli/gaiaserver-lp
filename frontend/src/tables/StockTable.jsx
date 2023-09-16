/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import {
  Box,
  Collapse,
  Dialog,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";

import EditStockItemForm from "../forms/edit/EditStockItemForm";
import DeleteStockItemForm from "../forms/delete/DeleteStockItemForm";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function StockTable() {
  const [selectedStockItem, setSelectedStockItem] = React.useState("");
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);

  const [stockItems, setStockItems] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const stockItems = await api.get("/stockItems");
        setStockItems(stockItems.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [stockItems]);

  const fetchData = async () => {
    try {
      const stockItems = await api.get("/stockItems");
      setStockItems(stockItems.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOpenDetail = (stockItem) => {
    setOpenDetail(!openDetail);
    setSelectedStockItem(stockItem);
  };

  const handleOpenEdit = (stockItem) => {
    setOpenEdit(!openEdit);
    setSelectedStockItem(stockItem);
  };

  const handleConfirmDelete = (stockItem) => {
    setOpenDelete(!openDelete);
    setSelectedStockItem(stockItem);
  };

  return (
    <>
      <Box sx={{ minWidth: "1050px" }}>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow sx={{backgroundColor:"#ccc"}}>
                <TableCell align="left">
                  <Typography sx={{ fontSize: 14 }}>Nome do Item</Typography>
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
              {stockItems.map((stockItem) => (
                <>
                  <TableRow
                    key={stockItem._id}
                    sx={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedStockItem.name === stockItem.name && openDetail
                          ? "#eee"
                          : "none",
                      "&:hover": { backgroundColor: "#eee " },
                    }}
                  >
                    <TableCell
                      onClick={() => handleOpenDetail(stockItem)}
                      cursor="pointer"
                      align="left"
                    >
                      <Typography sx={{ fontSize: 14 }}>{stockItem.name}</Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(stockItem)}
                      cursor="pointer"
                      align="left"
                    >
                      <Typography sx={{ fontSize: 14 }}>R${stockItem.buyValue}</Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(stockItem)}
                      cursor="pointer"
                      align="left"
                    >
                      <Typography sx={{ fontSize: 14 }}>R${stockItem.sellValue}</Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(stockItem)}
                      cursor="pointer"
                      align="left"
                    >
                      <Typography sx={{ fontSize: 14 }}>{stockItem.quantity}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={6}
                    >
                      <Collapse
                        in={
                          openDetail &&
                          selectedStockItem.name === stockItem.name
                        }
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ my: 4, px: 6 }}>
                          <Typography variant="h6" sx={{fontSize:18, fontWeight:"bold"}}>
                            Detalhes do Item
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Nome
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Valor de Compra
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Valor de Venda
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Lucro por Item
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Quantidade
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>
                                  <Typography>{stockItem.name}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>
                                    R${stockItem.buyValue}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>
                                    R${stockItem.sellValue}
                                  </Typography>
                                </TableCell>
                                <TableCell
                                  align="left"
                                >
                                  <Typography sx={{color:"#32CD32"}}>
                                    {(
                                      ((stockItem.sellValue -
                                        stockItem.buyValue) /
                                        stockItem.buyValue) *
                                      100
                                    ).toFixed(2)}
                                    %
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>{stockItem.quantity}</Typography>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                          <Box sx={{ mt: 3, ml: "90%" }}>
                            <ModeEditIcon
                              cursor="pointer"
                              onClick={() => handleOpenEdit(stockItem)}
                              sx={{ color: "grey", mr: 2 }}
                            />
                            <DeleteIcon
                              cursor="pointer"
                              onClick={() => handleConfirmDelete(stockItem)}
                              sx={{ color: "#ff4444" }}
                            />
                          </Box>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {openEdit && (
          <Dialog
            fullWidth
            maxWidth="md"
            open={openEdit}
            onClose={() => setOpenEdit(!openEdit)}
          >
            <EditStockItemForm
              openEdit={openEdit}
              selectedStockItem={selectedStockItem}
              setOpenEdit={setOpenEdit}
              fetchData={fetchData}
              toast={toast}
            />
          </Dialog>
        )}
        {openDelete && (
          <Dialog open={openDelete} onClose={() => setOpenDelete(!openDelete)}>
            <DeleteStockItemForm
              selectedStockItem={selectedStockItem}
              openDelete={openDelete}
              setOpenDelete={setOpenDelete}
              fetchData={fetchData}
              toast={toast}

            />
          </Dialog>
        )}
      </Box>
    </>
  );
}
