/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
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
  Avatar,
  TablePagination,
  FormHelperText,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Checkbox,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import EditCustomerForm from "../forms/edit/EditCustomerForm";
import CustomerTableActions from "../components/small/buttons/tableActionButtons/CustomerTableActions";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function CustomerTable({
  user,
  configData,
  configAgenda,
  configCustomization,
  searchDepartment,
  refreshData,
  setRefreshData,
  searchValue,
  searchOption,
}) {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [openDetailGeral, setOpenDetailGeral] = React.useState(true);
  const [openDetailContato, setOpenDetailContato] = React.useState(false);
  // const [openDetailDominio, setOpenDetailDominio] = React.useState(false);
  const [openDetailRequests, setOpenDetailRequests] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState([]);

  const [customers, setCustomers] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/customers");
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refreshData]);

  const handleOpenDetail = (customer) => {
    setOpenDetail(!openDetail);
    setSelectedCustomer(customer.name);
  };

  const tableHeaderRow = [
    {
      id: "logo",
      label: "",
    },
    {
      id: "name",
      label: "Nome",
    },
    {
      id: "phone",
      label: "Telefone",
    },
    {
      id: "mainContactName",
      label: "Contato Principal",
    },
    {
      id: "isActive",
      label: "Ativo",
    },
    {
      id: "actions",
      label: "Ações",
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
      return [...customers].sort(compare);
    }

    return [...customers].sort((a, b) => {
      const isAsc = order === "asc";
      if (isAsc) {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    });
  }, [customers, order, orderBy]);

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

  const eventStyleGetter = () => {
    const hexToRGB = (hex) => {
      let r, g, b;
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
      return [r, g, b];
    };

    const [r, g, b] = hexToRGB(configCustomization.mainColor);

    let style = {
      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.55)`,
    };

    return {
      style: style,
    };
  };

  const eventStyle = eventStyleGetter().style;

  const [showArchivedCustomers, setShowArchivedCustomers] =
    React.useState(false);

  const filteredValidCount = sortedRows.filter((row) => row.isActive).length;
  const filteredArchivedCount = sortedRows.filter(
    (row) => !row.isActive
  ).length;

  return (
    <Box sx={{ minWidth: "1250px" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: -5.5 }}>
        <Checkbox
          checked={showArchivedCustomers}
          onChange={() => setShowArchivedCustomers(!showArchivedCustomers)}
        />
        <Typography sx={{ fontSize: 13, mt: 1.5, ml: -1 }}>
          Mostrar Arquivados
        </Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow
              sx={{
                backgroundColor: "#eee",
              }}
            >
              {tableHeaderRow.map((headCell) => (
                <TableCell
                  align={headCell.label === "" ? "" : "left"}
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
              .filter((user) => {
                const searchOptionValue =
                  searchOption === "department.name"
                    ? user.department?.name
                    : user[searchOption];

                const departmentFilter =
                  !searchDepartment ||
                  user.department?.name === searchDepartment;

                const shouldApplyDepartmentFilter =
                  departmentFilter || searchDepartment === "&nbsp;";

                const shouldShowUser = showArchivedCustomers || user.isActive;

                return (
                  searchOptionValue &&
                  searchOptionValue
                    .toLowerCase()
                    .includes(searchValue.toLowerCase()) &&
                  shouldApplyDepartmentFilter &&
                  shouldShowUser
                );
              })
              .map((customer) => (
                <>
                  <TableRow
                    key={customer._id}
                    sx={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedCustomer === customer.name && openDetail
                          ? "#eee"
                          : "none",
                      "&:hover": { backgroundColor: "#eee " },
                    }}
                  >
                    <TableCell
                      onClick={() => handleOpenDetail(customer)}
                      cursor="pointer"
                      sx={{ p: 1, width: 160, height: 40 }}
                    >
                      <Avatar
                        src={`http://localhost:3000/static/${customer.image}`}
                        alt={
                          <Typography sx={{ fontSize: 12, my: "auto" }}>
                            Logotipo da Empresa
                          </Typography>
                        }
                        cursor="pointer"
                        style={{
                          borderRadius: 1,
                          width: "auto",
                          margin: "auto",
                          opacity:
                            openDetail &&
                            selectedCustomer.name === customer.name
                              ? 0
                              : 100,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(customer)}
                      cursor="pointer"
                      align="left"
                    >
                      <Typography sx={{ fontSize: 13 }}>
                        {customer.name}
                      </Typography>
                    </TableCell>

                    <TableCell
                      onClick={() => handleOpenDetail(customer)}
                      cursor="pointer"
                      align="left"
                    >
                      <Typography sx={{ fontSize: 13 }}>
                        {customer.phone}
                      </Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(customer)}
                      cursor="pointer"
                      align="left"
                    >
                      <Typography sx={{ fontSize: 13, mt: 0.5 }}>
                        {customer.mainContactName}
                      </Typography>
                      <FormHelperText sx={{ mt: -0.5 }}>
                        ({customer.mainContactEmail})
                      </FormHelperText>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(customer)}
                      cursor="pointer"
                      align="left"
                    >
                      <Typography sx={{ fontSize: 13 }}>
                        {customer.isActive ? "Sim" : "Não"}
                      </Typography>
                    </TableCell>
                    <TableCell
                      cursor="pointer"
                      // align="left"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <CustomerTableActions
                        user={user}
                        customer={customer}
                        configAgenda={configAgenda}
                        setOpenEdit={setOpenEdit}
                        selectedItem={selectedCustomer}
                        refreshData={refreshData}
                        setRefreshData={setRefreshData}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={6}
                    >
                      <Collapse
                        in={openDetail && selectedCustomer === customer.name}
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
                                      Endereço
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
                                      CNPJ
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Segmento
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      # de Colaboradores
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell component="th" scope="row">
                                    <Typography sx={{ fontSize: 13 }}>
                                      {customer.address}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography sx={{ fontSize: 13 }}>
                                      {customer.phone}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography sx={{ fontSize: 13 }}>
                                      {customer.cnpj}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography sx={{ fontSize: 13 }}>
                                      {customer.segment}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography sx={{ fontSize: 13 }}>
                                      {customer.employees}
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
                              Contato Principal
                            </Typography>
                            <IconButton
                              onClick={() =>
                                setOpenDetailContato(!openDetailContato)
                              }
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </Grid>
                          <Collapse
                            in={openDetailContato}
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
                                      Nome
                                    </Typography>
                                  </TableCell>
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
                                      Posição
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell>
                                    <Typography sx={{ fontSize: 13 }}>
                                      {customer.mainContactName}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography sx={{ fontSize: 13 }}>
                                      {customer.mainContactEmail}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography sx={{ fontSize: 13 }}>
                                      {customer.mainContactPosition}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Collapse>
                        </Box>

                        {/* DOMAIN BOX, DOESNT MAKE SO MUCH SENSE RIGHT NOW... */}
                        {/* <Box sx={{ my: 4, px: 6 }}>
                          <Grid container direction="row">
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: 18,
                                fontWeight: "bold",
                                my: "auto",
                              }}
                            >
                              Domínio
                            </Typography>
                            <IconButton
                              onClick={() =>
                                setOpenDetailDominio(!openDetailDominio)
                              }
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </Grid>
                          <Collapse
                            in={openDetailDominio}
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
                                      Website
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      sx={{ fontSize: 13, color: "#777" }}
                                    >
                                      Domínio
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell>
                                    <Typography sx={{ fontSize: 13 }}>
                                      {customer.website}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography sx={{ fontSize: 13 }}>
                                      {customer.domain}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Collapse>
                        </Box> */}

                        <Box sx={{ my: 4, px: 6 }}>
                          <Grid container direction="row">
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: "bold",
                                fontSize: 18,
                                my: "auto",
                              }}
                            >
                              Solicitações
                            </Typography>
                            <IconButton
                              onClick={() =>
                                setOpenDetailRequests(!openDetailRequests)
                              }
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </Grid>
                          <Collapse
                            in={openDetailRequests}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Grid
                              container
                              direction="row"
                              justifyContent="space-around"
                              sx={{
                                py: 1,
                                mt: 1,
                                mb: 2,
                                borderRadius: 1,
                                ...eventStyle,
                              }}
                            >
                              <Grid item>
                                <Typography
                                  sx={{
                                    fontFamily: "Roboto, sans-serif",
                                    fontWeight: "bold",
                                    color: "white",
                                  }}
                                >
                                  Jobs:
                                  {
                                    customer.recentRequests.filter(
                                      (request) => request.type === "job"
                                    ).length
                                  }
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Typography
                                  sx={{
                                    fontFamily: "Roboto, sans-serif",
                                    fontWeight: "bold",
                                    color: "white",
                                  }}
                                >
                                  Vendas:
                                  {
                                    customer.recentRequests.filter(
                                      (request) => request.type === "sale"
                                    ).length
                                  }
                                </Typography>
                              </Grid>
                            </Grid>

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
                                      Tipo de Solicitação
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
                                {customer.recentRequests
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
                                          {item.type === "job"
                                            ? "Job"
                                            : item.type === "sale"
                                            ? "Venda"
                                            : ""}
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
          count={
            filteredValidCount +
            (showArchivedCustomers && filteredArchivedCount)
          }
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
          maxWidth="md"
          open={openEdit}
          onClose={() => setOpenEdit(!openEdit)}
        >
          <EditCustomerForm
            openEdit={openEdit}
            config={configData}
            selectedCustomer={selectedCustomer}
            setOpenEdit={setOpenEdit}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
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
