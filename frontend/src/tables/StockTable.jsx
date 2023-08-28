/* eslint-disable react/prop-types */
import * as React from "react";
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
      <Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: "100%" }}>
            <TableBody>
              {stockItems.map((stockItem) => (
                <>
                  <TableRow
                    key={stockItem._id}
                    sx={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedStockItem.name === stockItem.name && openDetail
                          ? "#95dd95"
                          : "none",
                      "&:hover": { backgroundColor: "#ccc " },
                    }}
                  >
                    <TableCell
                      onClick={() => handleOpenDetail(stockItem)}
                      cursor="pointer"
                      align="left"
                    >
                      <Typography>{stockItem.name}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={6}
                    >
                      <Collapse
                        in={openDetail && selectedStockItem.name === stockItem.name}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ my: 4, px: 6 }}>
                          <Typography variant="h6" component="div">
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
                                    Valor
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
                                <TableCell component="th" scope="row">
                                  <Typography>{stockItem.name}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>R${stockItem.value}</Typography>
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
            />
          </Dialog>
        )}
      </Box>
    </>
  );
}
