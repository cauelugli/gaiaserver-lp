/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

import EditCustomerForm from "../forms/edit/EditCustomerForm";
import GenericDeleteForm from "../forms/delete/GenericDeleteForm";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function CustomerTable({
  refreshData,
  setRefreshData,
  searchValue,
  searchOption,
}) {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState([]);
  const [selectedItem, setSelectedItem] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleConfirmDelete = (position) => {
    setSelectedItem(position);
    setOpenDialog(true);
  };

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

  const handleOpenEdit = (customer) => {
    setOpenEdit(!openEdit);
    setSelectedCustomer(customer);
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

  return (
    <Box>
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
              .slice(startIndex, endIndex)
              .filter((user) =>
                user[searchOption]
                  .toLowerCase()
                  .includes(searchValue.toLowerCase())
              )
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
                        alt="L"
                        cursor="pointer"
                        style={{
                          borderRadius: 1,
                          width: "auto",
                          height: "auto",
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
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Geral
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Endereço
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Telefone
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    CNPJ
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Segmento
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    # de Colaboradores
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell component="th" scope="row">
                                  <Typography>{customer.address}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>{customer.phone}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>{customer.cnpj}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>{customer.segment}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>{customer.employees}</Typography>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>

                        <Box sx={{ my: 4, px: 6 }}>
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Contato Principal
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
                                    E-mail
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Posição
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>
                                  <Typography>
                                    {customer.mainContactName}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>
                                    {customer.mainContactEmail}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>
                                    {customer.mainContactPosition}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>

                        <Box sx={{ my: 4, px: 6 }}>
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Domínio
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Website
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Domínio
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>
                                  <Typography>{customer.website}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>{customer.domain}</Typography>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>

                        <Box sx={{ my: 4, px: 6 }}>
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Pedidos Recentes
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Orçamento
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Tipo de Pedido
                                  </Typography>
                                </TableCell>

                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Solicitado em
                                  </Typography>
                                </TableCell>

                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Solicitado por
                                  </Typography>
                                </TableCell>

                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Concluido em
                                  </Typography>
                                </TableCell>

                                <TableCell>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#777" }}
                                  >
                                    Concluido por
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                              {/* <TableRow
                                key
                                sx={{
                                  backgroundColor:
                                    interaction.number % 2 === 0 ? "#eee" : "white",
                                }}
                              > */}
                                <TableCell>
                                  <Typography>1234</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>Job ou Venda</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>10/04/1991</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>Maximiliano Guimarães</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>10/04/1991</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>Maximiliano Guimarães</Typography>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>

                        <Box sx={{ my: 4, ml: "90%" }}>
                          <ModeEditIcon
                            cursor="pointer"
                            option="delete"
                            onClick={() => handleOpenEdit(customer)}
                            sx={{ color: "grey", mr: 2 }}
                          />
                          <DeleteIcon
                            cursor="pointer"
                            option="delete"
                            onClick={() => handleConfirmDelete(customer)}
                            sx={{ color: "#ff4444" }}
                          />
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
          maxWidth="md"
          open={openEdit}
          onClose={() => setOpenEdit(!openEdit)}
        >
          <EditCustomerForm
            openEdit={openEdit}
            selectedCustomer={selectedCustomer}
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
            endpoint="customers"
            successMessage={`${
              selectedItem.name && selectedItem.name
            } Deletado com Sucesso`}
          />
        </Dialog>
      )}
    </Box>
  );
}
