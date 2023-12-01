/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import {
  Avatar,
  Box,
  Collapse,
  Dialog,
  DialogContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";

import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";

import EditStockItemForm from "../forms/edit/EditStockItemForm";
import GenericDeleteForm from "../forms/delete/GenericDeleteForm";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function StockTable({
  searchValue,
  searchOption,
  refreshData,
  setRefreshData,
}) {
  const [selectedStockItem, setSelectedStockItem] = React.useState("");
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleConfirmDelete = (position) => {
    setSelectedItem(position);
    setOpenDialog(true);
  };

  const [stockItems, setStockItems] = React.useState([]);

  const [openImage, setOpenImage] = React.useState(false);

  const handleOpenImage = () => {
    setOpenImage(true);
  };

  const handleCloseImage = () => {
    setOpenImage(false);
  };

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
  }, []);

  const handleOpenDetail = (stockItem) => {
    setOpenDetail(!openDetail);
    setSelectedStockItem(stockItem);
  };

  const handleOpenEdit = (stockItem) => {
    setOpenEdit(!openEdit);
    setSelectedStockItem(stockItem);
  };

  const tableHeaderRow = [
    {
      id: "name",
      label: "Nome",
    },
    {
      id: "buyValue",
      label: "Valor de Compra",
    },
    {
      id: "sellValue",
      label: "Valor de Venda",
    },
    {
      id: "quantity",
      label: "Quantidade",
    },
  ];

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedRows = React.useMemo(() => {
    return [...stockItems].sort((a, b) => {
      const isAsc = order === "asc";
      if (isAsc) {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    });
  }, [stockItems, order, orderBy]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  return (
    <>
      <Box sx={{ minWidth: "1050px" }}>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow sx={{ backgroundColor: "#ccc" }}>
                <TableCell padding="checkbox"></TableCell>
                {tableHeaderRow.map((headCell) => (
                  <TableCell
                    align={headCell.label === "Nome" ? "" : "center"}
                    sx={{
                      fontSize: 13,
                      fontWeight: "bold",
                      pl: headCell.label === "Nome" ? "" : 5,
                    }}
                    key={headCell.id}
                    sortDirection={orderBy === headCell.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={() => handleRequestSort(headCell.id)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
              {sortedRows
                .slice(startIndex, endIndex)
                .filter((user) => {
                  const userProperty = searchOption
                    .split(".")
                    .reduce((obj, key) => obj[key], user);
                  return (
                    userProperty &&
                    userProperty
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                  );
                })
                .map((stockItem) => (
                  <>
                    <TableRow
                      key={stockItem._id}
                      sx={{
                        cursor: "pointer",
                        backgroundColor:
                          selectedStockItem.name === stockItem.name &&
                          openDetail
                            ? "#eee"
                            : "none",
                        "&:hover": { backgroundColor: "#eee " },
                      }}
                    >
                      <TableCell
                        onClick={() => handleOpenDetail(stockItem)}
                        cursor="pointer"
                        sx={{ py: 0 }}
                      >
                        <Avatar
                          src={`http://localhost:3000/static/${selectedStockItem.image}`}
                          alt={stockItem.name[0]}
                          cursor="pointer"
                          style={{
                            marginLeft: 10,
                            width: 42,
                            height: 42,
                            opacity:
                              openDetail &&
                              selectedStockItem.name === stockItem.name
                                ? 0
                                : 100,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        onClick={() => handleOpenDetail(stockItem)}
                        cursor="pointer"
                        align="left"
                      >
                        <Typography sx={{ fontSize: 13 }}>
                          {stockItem.name}
                        </Typography>
                      </TableCell>
                      <TableCell
                        onClick={() => handleOpenDetail(stockItem)}
                        cursor="pointer"
                        align="center"
                      >
                        <Typography sx={{ fontSize: 13 }}>
                          R${stockItem.buyValue}
                        </Typography>
                      </TableCell>
                      <TableCell
                        onClick={() => handleOpenDetail(stockItem)}
                        cursor="pointer"
                        align="center"
                      >
                        <Typography sx={{ fontSize: 13 }}>
                          R${stockItem.sellValue}
                        </Typography>
                      </TableCell>
                      <TableCell
                        onClick={() => handleOpenDetail(stockItem)}
                        cursor="pointer"
                        align="center"
                      >
                        <Typography sx={{ fontSize: 13 }}>
                          {stockItem.quantity}
                        </Typography>
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
                          <Box sx={{ my: 4, px: 2 }}>
                            <Typography
                              variant="h6"
                              sx={{ fontSize: 18, fontWeight: "bold", my: 2 }}
                            >
                              Detalhes do Item
                            </Typography>
                            <Grid
                              container
                              direction="row"
                              justifyContent="space-evenly"
                            >
                              <Grid item>
                                <Grid
                                  container
                                  direction="column"
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <Avatar
                                    alt="Imagem do Produto"
                                    cursor="pointer"
                                    src={`http://localhost:3000/static/${stockItem.image}`}
                                    sx={{ width: 200, height: 200, mr: 4 }}
                                    onDoubleClick={handleOpenImage}
                                  />
                                  <Dialog
                                    open={openImage}
                                    onClose={handleCloseImage}
                                  >
                                    <DialogContent>
                                      <img
                                        cursor="pointer"
                                        src={`http://localhost:3000/static/${stockItem.image}`}
                                        alt="Imagem do Usuário"
                                        style={{ maxWidth: "100%" }}
                                      />
                                    </DialogContent>
                                  </Dialog>
                                </Grid>
                              </Grid>
                              <Grid item>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell align="center">
                                        <Typography
                                          sx={{
                                            fontSize: "14px",
                                            color: "#777",
                                          }}
                                        >
                                          Nome
                                        </Typography>
                                      </TableCell>
                                      <TableCell align="center">
                                        <Typography
                                          sx={{
                                            fontSize: "14px",
                                            color: "#777",
                                          }}
                                        >
                                          Quantidade
                                        </Typography>
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell align="center">
                                        <Typography>
                                          {stockItem.name}
                                        </Typography>
                                      </TableCell>
                                      <TableCell align="center">
                                        <Typography>
                                          {stockItem.quantity}
                                        </Typography>
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                                <Table size="small" sx={{ mt: 4 }}>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell align="center">
                                        <Typography
                                          sx={{
                                            fontSize: "14px",
                                            color: "#777",
                                          }}
                                        >
                                          Valor de Compra
                                        </Typography>
                                      </TableCell>
                                      <TableCell align="center">
                                        <Typography
                                          sx={{
                                            fontSize: "14px",
                                            color: "#777",
                                          }}
                                        >
                                          Valor de Venda
                                        </Typography>
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell align="center">
                                        <Typography>
                                          R${stockItem.buyValue}
                                        </Typography>
                                      </TableCell>
                                      <TableCell align="center">
                                        <Typography>
                                          R${stockItem.sellValue}
                                        </Typography>
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </Grid>
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
                            </Grid>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={sortedRows.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={"por Página"}
            labelDisplayedRows={({ from, to, count }) => {
              return " " + from + " à " + to + " total " + count;
            }}
          />
        </TableContainer>

        {openEdit && (
          <Dialog
            fullWidth
            maxWidth="sm"
            open={openEdit}
            onClose={() => setOpenEdit(!openEdit)}
          >
            <EditStockItemForm
              openEdit={openEdit}
              selectedStockItem={selectedStockItem}
              setOpenEdit={setOpenEdit}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              toast={toast}
            />
          </Dialog>
        )}
        {openDialog && (
          <Dialog open={openDialog} onClose={() => setOpenDialog(!openDialog)}>
            <GenericDeleteForm
              selectedItem={selectedItem}
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
              toast={toast}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              endpoint="stockItems"
              successMessage={`${
                selectedItem.name && selectedItem.name
              } Deletado com Sucesso`}
            />
          </Dialog>
        )}
      </Box>
    </>
  );
}
