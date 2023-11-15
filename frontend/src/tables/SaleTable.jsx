/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";

import {
  Dialog,
  Box,
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Grid,
  Avatar,
  TableSortLabel,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

// import EditRequestForm from "../forms/edit/EditRequestForm";
import GenericDeleteForm from "../forms/delete/GenericDeleteForm";


export default function SaleTable({
  searchValue,
  searchOption,
  sales,
  fetchData,
  managers,
}) {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [selectedSale, setSelectedSale] = React.useState([]);
  const [selectedItem, setSelectedItem] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleConfirmDelete = (position) => {
    setSelectedItem(position);
    setOpenDialog(true);
  };

  const handleOpenDetail = (sale) => {
    setOpenDetail(!openDetail);
    setSelectedSale(sale);
  };

  const handleOpenEdit = (sale) => {
    setOpenEdit(!openEdit);
    setSelectedSale(sale);
  };

  const tableHeaderRow = [
    {
      id: "requester",
      label: "Comprador",
    },
    {
      id: "items",
      label: "Itens",
    },
    {
      id: "seller.name",
      label: "Vendedor",
    },
    {
      id: "createdBy",
      label: "Criado por",
    },
    {
      id: "scheduledTo",
      label: "Agendado para",
    },
    {
      id: "status",
      label: "Status",
    },
  ];

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("scheduledTo");

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedRows = React.useMemo(() => {
    const compare = (a, b) => {
      const sellerA = a.seller ? a.seller.name : "";
      const sellerB = b.seller ? b.seller.name : "";

      if (order === "asc") {
        return sellerA.localeCompare(sellerB);
      } else {
        return sellerB.localeCompare(sellerA);
      }
    };

    if (orderBy === "seller.name") {
      return [...sales].sort(compare);
    }

    return [...sales].sort((a, b) => {
      const isAsc = order === "asc";
      if (isAsc) {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    });
  }, [sales, order, orderBy]);

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: "100%" }}>
          <TableBody>
            <TableRow
              sx={{
                backgroundColor: "#ccc",
              }}
            >
              {tableHeaderRow.map((headCell) => (
                <TableCell
                  align={headCell.label === "Comprador" ? "" : "center"}
                  sx={{
                    fontSize: 16,
                    fontWeight: "bold",
                    pl: headCell.label === "Comprador" ? "" : 5,
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
              .filter((user) => {
                const userProperty = searchOption
                  .split(".")
                  .reduce((obj, key) => obj[key], user);
                return (
                  userProperty &&
                  userProperty.toLowerCase().includes(searchValue.toLowerCase())
                );
              })
              .map((sale) => (
                <>
                  <TableRow
                    key={sale._id}
                    sx={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedSale._id === sale._id && openDetail
                          ? "#eee"
                          : "none",
                      "&:hover": { backgroundColor: "#ccc " },
                    }}
                  >
                    <TableCell
                      onClick={() => handleOpenDetail(sale)}
                      cursor="pointer"
                      align="left"
                    >
                      {sale.requester}
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(sale)}
                      cursor="pointer"
                      align="center"
                    >
                      <Grid container direction="row" justifyContent="center">
                        {sale.items.slice(0, 3).map((item) => (
                          <Grid
                            direction="column"
                            key={item.id}
                            alignItems="center"
                            sx={{ mr: 1 }}
                          >
                            <Grid item>
                              <Avatar
                                alt="Imagem do Produto"
                                src={`http://localhost:3000/static/${item.image}`}
                                sx={{ width: 32, height: 32, mx: "auto" }}
                              />
                            </Grid>
                            <Grid item>
                              <Typography sx={{ fontSize: 12 }}>
                                x{item.quantity}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography sx={{ fontSize: 12, color: "#777" }}>
                                {item.name}
                              </Typography>
                            </Grid>
                          </Grid>
                        ))}
                        {sale.items.length > 3 && (
                          <Typography
                            sx={{
                              marginY: "auto",
                              fontSize: 24,
                              color: "#444",
                            }}
                          >
                            +{sale.items.length - 3}
                          </Typography>
                        )}
                      </Grid>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(sale)}
                      cursor="pointer"
                    >
                      <Grid container direction="row" justifyContent="center">
                        <Grid item>
                          <Avatar
                            alt="Imagem do Colaborador"
                            src={`http://localhost:3000/static/${sale.seller.image}`}
                            sx={{ width: 32, height: 32, mr: 1.5 }}
                          />
                        </Grid>
                        <Grid item>
                          <Typography sx={{ mt: 1, fontSize: 14 }}>
                            {sale.seller.name}
                          </Typography>
                        </Grid>
                      </Grid>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(sale)}
                      cursor="pointer"
                      align="center"
                    >
                      {sale.createdBy}
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(sale)}
                      cursor="pointer"
                      align="center"
                    >
                      {dayjs(sale.deliveryScheduledTo).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(sale)}
                      cursor="pointer"
                      align="center"
                    >
                      {sale.status}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={6}
                    >
                      <Collapse
                        in={openDetail && selectedSale._id === sale._id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ my: 4, px: 6 }}>
                          <Typography
                            variant="h6"
                            sx={{ fontSize: 18, fontWeight: "bold" }}
                          >
                            Departamento
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell align="left">
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Nome do Departamento
                                  </Typography>
                                </TableCell>
                                <TableCell align="left">
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Vendedor
                                  </Typography>
                                </TableCell>
                                <TableCell align="left">
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Feita em
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell align="left">
                                  <Typography>
                                    {sale.department.name}
                                  </Typography>
                                </TableCell>
                                <TableCell align="left">
                                  <Grid container direction="row">
                                    <Grid item>
                                      <Avatar
                                        alt="Imagem do Colaborador"
                                        src={`http://localhost:3000/static/${sale.seller.image}`}
                                        sx={{ width: 32, height: 32, mr: 1 }}
                                      />
                                    </Grid>
                                    <Grid item>
                                      <Typography
                                        sx={{ mt: 0.75, fontSize: 14 }}
                                      >
                                        {sale.seller.name}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </TableCell>
                                <TableCell align="left">
                                  <Typography>
                                    {dayjs(sale.createdAt).format("DD/MM/YYYY")}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>
                        <Box sx={{ my: 4, px: 6 }}>
                          <Typography
                            variant="h6"
                            sx={{ fontSize: 18, fontWeight: "bold" }}
                          >
                            Orçamento
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Nº do Orçamento
                                  </Typography>
                                </TableCell>
                                <TableCell align="left">
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Produtos
                                  </Typography>
                                </TableCell>
                                <TableCell align="left">
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Valor Total (serviço + materiais)
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell component="th" scope="row">
                                  <Typography>{sale.quoteNumber}</Typography>
                                </TableCell>
                                <TableCell align="left">
                                  <Typography>
                                    {sale.items.length > 0
                                      ? sale.items.map((item) => (
                                          <Grid
                                            key={item.id}
                                            container
                                            direction="row"
                                            justifyContent="flex-start"
                                            alignItems="flex-start"
                                            sx={{ mt: 0.5 }}
                                          >
                                            <Typography
                                              sx={{
                                                fontSize: 12,
                                                color: "#777",
                                                my: "auto",
                                              }}
                                            >
                                              x{item.quantity} {item.name}
                                            </Typography>
                                            <Avatar
                                              alt="Imagem do Produto"
                                              src={`http://localhost:3000/static/${item.image}`}
                                              sx={{
                                                width: 26,
                                                height: 26,
                                                ml: 1,
                                              }}
                                            />
                                          </Grid>
                                        ))
                                      : "Não há uso de Materiais"}
                                  </Typography>
                                </TableCell>
                                <TableCell align="left">
                                  <Typography>R${sale.price}</Typography>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>
                        <Box sx={{ my: 4, px: 6 }}>
                          <Typography
                            variant="h6"
                            sx={{ fontSize: 18, fontWeight: "bold" }}
                          >
                            Comprador
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell align="left">
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Nome do Comprador
                                  </Typography>
                                </TableCell>
                                <TableCell align="left">
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Contato de Entrega
                                  </Typography>
                                </TableCell>
                                <TableCell align="left">
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Endereço de Entrega
                                  </Typography>
                                </TableCell>
                                <TableCell align="left">
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Data da Entrega
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell align="left">
                                  <Typography>{sale.requester}</Typography>
                                </TableCell>
                                <TableCell align="left">
                                  <Typography sx={{ mt: 0.75 }}>
                                    {sale.deliveryReceiverPhone}
                                  </Typography>
                                </TableCell>
                                <TableCell align="left">
                                  <Typography sx={{ mt: 0.75 }}>
                                    {sale.deliveryAddress}
                                  </Typography>
                                </TableCell>
                                <TableCell align="left">
                                  <Typography>
                                    {dayjs(sale.deliveryScheduledTo).format(
                                      "DD/MM/YYYY"
                                    )}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                          <Box sx={{ mt: 3, ml: "90%" }}>
                            <ModeEditIcon
                              cursor="pointer"
                              onClick={() => handleOpenEdit(sale)}
                              sx={{ color: "grey", mr: 2 }}
                            />
                            <DeleteIcon
                              cursor="pointer"
                              onClick={() => handleConfirmDelete(sale)}
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
      {/* {openEdit && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openEdit}
          onClose={() => setOpenEdit(!openEdit)}
        >
          <EditRequestForm
            openEdit={openEdit}
            selectedSale={selectedSale}
            setOpenEdit={setOpenEdit}
            fetchData={fetchData}
          />
        </Dialog>
      )} */}
      {openDialog && (
        <Dialog open={openDialog} onClose={() => setOpenDialog(!openDialog)}>
          <GenericDeleteForm
            selectedItem={selectedItem}
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            toast={toast}
            endpoint="sales"
            successMessage={`Venda #${
              selectedItem.quoteNumber && selectedItem.quoteNumber
            } Deletado com Sucesso`}
          />
        </Dialog>
      )}
    </Box>
  );
}
