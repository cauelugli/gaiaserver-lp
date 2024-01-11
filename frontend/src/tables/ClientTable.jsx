/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import axios from "axios";

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
  TableSortLabel,
  TablePagination,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import EditClientForm from "../forms/edit/EditClientForm";
import GenericDeleteForm from "../forms/delete/GenericDeleteForm";

import CustomerTableActionsButton from "../components/small/buttons/CustomerTableActionsButton";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function ClientTable({
  configData,
  refreshData,
  setRefreshData,
  searchOption,
  searchValue,
}) {
  const [selectedClient, setSelectedClient] = React.useState([]);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [openDetailGeral, setOpenDetailGeral] = React.useState(true);
  const [openDetailEndereço, setOpenDetailEndereço] = React.useState(false);
  const [openDetailPedidos, setOpenDetailPedidos] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleConfirmDelete = (position) => {
    setSelectedItem(position);
    setOpenDialog(true);
  };

  const [clients, setClients] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/clients");
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refreshData]);

  const handleOpenDetail = (client) => {
    setOpenDetail(!openDetail);
    setSelectedClient(client.name);
  };

  const handleOpenEdit = (client) => {
    setOpenEdit(!openEdit);
    setSelectedClient(client);
  };

  const tableHeaderRow = [
    {
      id: "name",
      label: "Nome",
    },
    {
      id: "email",
      label: "E-mail",
    },
    {
      id: "phone",
      label: "Telefone",
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
    const compare = (a, b) => {
      const departmentA = a.department ? a.department.name : "";
      const departmentB = b.department ? b.department.name : "";

      if (order === "asc") {
        return departmentA.localeCompare(departmentB);
      } else {
        return departmentB.localeCompare(departmentA);
      }
    };

    if (orderBy === "department.name") {
      return [...clients].sort(compare);
    }

    return [...clients].sort((a, b) => {
      const isAsc = order === "asc";
      if (isAsc) {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    });
  }, [clients, order, orderBy]);

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

  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [pdfUrl, setPdfUrl] = React.useState("");

  const openViewDialog = (file) => {
    setPdfUrl(
      `http://localhost:3000/static/docs/orcamento-${file.type[0]}-${file.number}.pdf`
    );
    setViewDialogOpen(true);
  };

  const closeViewDialog = () => {
    setViewDialogOpen(false);
  };

  return (
    <Box sx={{ minWidth: "1250px" }}>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow
              sx={{
                backgroundColor: "#ccc",
              }}
            >
              {tableHeaderRow.map((headCell) => (
                <TableCell
                  align={headCell.label === "Nome" ? "" : "left"}
                  sx={{
                    fontSize: 13,
                    fontWeight: "bold",
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
              .filter((user) =>
                user[searchOption]
                  .toLowerCase()
                  .includes(searchValue.toLowerCase())
              )
              .map((client) => (
                <>
                  <TableRow
                    key={client._id}
                    sx={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedClient === client.name && openDetail
                          ? "#eee"
                          : "none",
                      "&:hover": { backgroundColor: "#eee " },
                    }}
                  >
                    <TableCell
                      onClick={() => handleOpenDetail(client)}
                      cursor="pointer"
                      align="left"
                    >
                      <Typography sx={{ fontSize: 13 }}>
                        {client.name}
                      </Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(client)}
                      cursor="pointer"
                    >
                      <Typography sx={{ fontSize: 13 }}>
                        {client.email}
                      </Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(client)}
                      cursor="pointer"
                    >
                      <Typography sx={{ fontSize: 13 }}>
                        {client.phone}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={6}
                    >
                      <Collapse
                        in={openDetail && selectedClient === client.name}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ my: 4, px: 6 }}>
                          <Grid container direction="row">
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: 18,
                                fontWeight: "bold",
                                my: "auto",
                              }}
                            >
                              Informações Gerais
                            </Typography>
                            <IconButton
                              onClick={() =>
                                setOpenDetailGeral(!openDetailGeral)
                              }
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </Grid>

                          <Collapse
                            in={openDetailGeral}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      E-mail
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Telefone
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      CPF
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell component="th" scope="row">
                                    <Typography sx={{ fontSize: 13 }}>
                                      {client.email}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography sx={{ fontSize: 13 }}>
                                      {client.phone}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography sx={{ fontSize: 13 }}>
                                      {client.cpf}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Collapse>
                        </Box>
                        <Box sx={{ my: 4, px: 6 }}>
                          <Grid container direction="row">
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: 18,
                                fontWeight: "bold",
                                my: "auto",
                              }}
                            >
                              Endereços{" "}
                            </Typography>
                            <IconButton
                              onClick={() =>
                                setOpenDetailEndereço(!openDetailEndereço)
                              }
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </Grid>
                          <Collapse
                            in={openDetailEndereço}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Residencial
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Entrega
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Cobrança
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell component="th" scope="row">
                                    <Typography sx={{ fontSize: 13 }}>
                                      {client.addressHome}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography sx={{ fontSize: 13 }}>
                                      {client.addressDelivery}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography sx={{ fontSize: 13 }}>
                                      {client.addressBill}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Collapse>
                        </Box>
                        <Box sx={{ my: 4, px: 6 }}>
                          <Grid container direction="row">
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: 18,
                                fontWeight: "bold",
                                my: "auto",
                              }}
                            >
                              Pedidos
                            </Typography>
                            <IconButton
                              onClick={() =>
                                setOpenDetailPedidos(!openDetailPedidos)
                              }
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </Grid>{" "}
                          <Collapse
                            in={openDetailPedidos}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Orçamento
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="left">
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Título
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Tipo de Pedido
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Solicitado em
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Solicitado por
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {client.recentRequests
                                  .slice(0, 5)
                                  .map((item, index) => (
                                    <TableRow
                                      key={index}
                                      sx={{
                                        backgroundColor:
                                          index % 2 === 0 ? "#eee" : "white",
                                      }}
                                    >
                                      <TableCell>
                                        <Button
                                          sx={{ color: "black" }}
                                          onClick={() => openViewDialog(item)}
                                        >
                                          <Typography sx={{ fontSize: 13 }}>
                                            {item.number}
                                          </Typography>
                                        </Button>
                                      </TableCell>
                                      <TableCell align="left">
                                        <Typography sx={{ fontSize: 13 }}>
                                          {item.title || "Venda"}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <Typography sx={{ fontSize: 13 }}>
                                          {item.type.charAt(0).toUpperCase() +
                                            item.type.slice(1)}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <Typography sx={{ fontSize: 13 }}>
                                          {new Date(
                                            item.date
                                          ).toLocaleDateString("pt-BR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                          })}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <Typography sx={{ fontSize: 13 }}>
                                          {item.requester}
                                        </Typography>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </Collapse>
                        </Box>

                        <Box sx={{ my: 4, ml: "70%" }}>
                          <CustomerTableActionsButton
                            configData={configData}
                            openEdit={openEdit}
                            handleOpenEdit={handleOpenEdit}
                            customer={client}
                            tableType="Client"
                            handleConfirmDelete={handleConfirmDelete}
                            onClick={() => handleConfirmDelete(client)}
                            openDialog={openDialog}
                          />
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              ))
              .slice(startIndex, endIndex)}
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
          maxWidth="xs"
          open={openEdit}
          onClose={() => setOpenEdit(!openEdit)}
        >
          <EditClientForm
            openEdit={openEdit}
            selectedClient={selectedClient}
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
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
            endpoint="clients"
            successMessage={`${
              selectedItem.name && selectedItem.name
            } Deletado com Sucesso`}
          />
        </Dialog>
      )}
      <Dialog
        open={viewDialogOpen}
        onClose={closeViewDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Visualização do Orçamento</DialogTitle>
        <DialogContent>
          <Box style={{ height: "600px" }}>
            <Worker
              workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
            >
              <Viewer fileUrl={pdfUrl} />
            </Worker>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeViewDialog} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
