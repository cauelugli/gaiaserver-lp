/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";

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
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

import EditRequestForm from "../forms/edit/EditRequestForm";
import dayjs from "dayjs";
// import DeleteRequestForm from "../forms/delete/DeleteRequestForm";

export default function SaleTable({ sales, fetchData }) {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [selectedSale, setSelectedSale] = React.useState([]);

  const handleOpenDetail = (sale) => {
    setOpenDetail(!openDetail);
    setSelectedSale(sale);
  };

  const handleOpenEdit = (sale) => {
    setOpenEdit(!openEdit);
    setSelectedSale(sale);
  };

  const handleConfirmDelete = (sale) => {
    setSelectedSale(sale);
    setOpenDelete(!openDelete);
  };

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
              <TableCell align="left">
                <Typography sx={{ fontSize: 16, fontWeight:"bold" }}>Nome do Comprador</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography sx={{ fontSize: 16, fontWeight:"bold" }}>Itens</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography sx={{ fontSize: 16, fontWeight:"bold" }}>Vendedor</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography sx={{ fontSize: 16, fontWeight:"bold" }}>Entrega em</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography sx={{ fontSize: 16, fontWeight:"bold" }}>Status</Typography>
              </TableCell>
            </TableRow>
            {sales.map((sale) => (
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
                    {sale.items.slice(0, 2).map((item) => (
                      <Grid
                        container
                        direction="row"
                        key={item.id}
                        alignItems="center"
                        sx={{ mt: 1 }}
                      >
                        <Avatar
                          alt="Imagem do Produto"
                          src={`http://localhost:3000/static/${item.image}`}
                          sx={{ width: 32, height: 32, mr: 1 }}
                        />
                        <Typography sx={{ fontSize: 12, mr: 0.5 }}>
                          x{item.quantity}
                        </Typography>
                        <Typography
                          sx={{ fontSize: 12, color: "#777", mr: 0.5 }}
                        >
                          {item.name}
                        </Typography>
                        <Typography
                          sx={{ fontSize: 12, color: "#777", mr: 0.5 }}
                        >
                          {item.brand}
                        </Typography>
                        <Typography
                          sx={{ fontSize: 12, color: "#777", mr: 0.5 }}
                        >
                          {item.type}
                        </Typography>
                        <Typography
                          sx={{ fontSize: 12, color: "#777", mr: 0.5 }}
                        >
                          {item.model}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: "#777" }}>
                          {item.size}
                        </Typography>
                      </Grid>
                    ))}
                    {sale.items.length > 2 && (
                      <Typography sx={{ ml:5, fontSize: 18 }}>+{sale.items.length - 2} itens</Typography>
                    )}
                  </TableCell>
                  <TableCell
                    onClick={() => handleOpenDetail(sale)}
                    cursor="pointer"
                    align="center"
                  >
                    {sale.seller.name}
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
                      <Box sx={{ m: 1, p: 4 }}>
                        <Typography variant="h6" gutterBottom component="div">
                          Detalhes
                        </Typography>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Titulo</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell component="th" scope="row">
                                {sale.title}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        <Box sx={{ mt: 3, ml: "90%" }}>
                          <ModeEditIcon
                            cursor="pointer"
                            option="delete"
                            onClick={() => handleOpenEdit(sale)}
                            sx={{ color: "grey", mr: 2 }}
                          />
                          <DeleteIcon
                            cursor="pointer"
                            option="delete"
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
      {/* {openDelete && (
        <Dialog open={openDelete} onClose={() => setOpenDelete(!openDelete)}>
          <DeleteRequestForm
            selectedRequest={selectedRequest}
            openDelete={openDelete}
            setOpenDelete={setOpenDelete}
            fetchData={fetchData}
          />
        </Dialog>
      )} */}
    </Box>
  );
}
