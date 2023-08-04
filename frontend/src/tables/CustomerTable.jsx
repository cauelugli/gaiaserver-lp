import * as React from "react";
import axios from "axios";

import {
  Button,
  Dialog,
  DialogTitle,
  Box,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteCustomerForm from "../forms/DeleteCustomerForm";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AddCustomerForm from "../forms/AddCustomerForm";
import EditCustomerForm from "../forms/EditCustomerForm";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function CustomerTable() {
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
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
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get("/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOpenDetail = (customer) => {
    setOpenDetail(!openDetail);
    setSelectedCustomer(customer.name);
  };

  const handleOpenEdit = (customer) => {
    setOpenEdit(!openEdit);
    setSelectedCustomer(customer);
  };

  const handleConfirmDelete = (customer) => {
    setSelectedCustomer(customer);
    setOpenDelete(!openDelete);
  };

  return (
    <>
      <Button onClick={() => setOpenAdd(true)}>
        <Typography variant="h6" color="#eee">
          + Novo
        </Typography>
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: "100%" }}>
          <TableBody>
            {customers.map((customer) => (
              <>
                <TableRow
                  key={customer._id}
                  sx={{
                    height: "5vw",
                    "&:hover": { backgroundColor: "#ccc " },
                  }}
                >
                  <TableCell sx={{ width: "5%" }} cursor="pointer" align="left">
                    <IconButton size="small">
                      {openDetail && selectedCustomer === customer.name ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell
                    onClick={() => handleOpenDetail(customer)}
                    cursor="pointer"
                    align="left"
                  >
                    {customer.name}
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
                      <Box sx={{ m: 1, p:4 }}>
                        <Typography variant="h6" gutterBottom component="div">
                          Detalhes
                        </Typography>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Nome do Cliente</TableCell>
                              <TableCell>Endereço</TableCell>
                              <TableCell>Telefone</TableCell>
                              <TableCell>Contato Principal</TableCell>
                              <TableCell>Website</TableCell>
                              <TableCell>Domínio</TableCell>
                              <TableCell>Segmento</TableCell>
                              <TableCell>Colaboradores</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell component="th" scope="row">
                                {customer.name}
                              </TableCell>
                              <TableCell>{customer.address}</TableCell>
                              <TableCell>{customer.phone}</TableCell>
                              <TableCell>
                                {customer.mainContactName} -{" "}
                                {customer.mainContactEmail}
                              </TableCell>
                              <TableCell>{customer.website}</TableCell>
                              <TableCell>{customer.domain}</TableCell>
                              <TableCell>{customer.segment}</TableCell>
                              <TableCell>{customer.employees}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        <Box sx={{ mt: 3, ml: "95%" }}>
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
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {openAdd && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openAdd}
          onClose={() => setOpenAdd(!openAdd)}
        >
          <AddCustomerForm
            openAdd={openAdd}
            setOpenAdd={setOpenAdd}
            fetchData={fetchData}
          />
        </Dialog>
      )}
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
            fetchData={fetchData}
          />
        </Dialog>
      )}
      {openDelete && (
        <Dialog open={openDelete} onClose={() => setOpenDelete(!openDelete)}>
          <DeleteCustomerForm
            selectedCustomer={selectedCustomer}
            setOpenDelete={setOpenDelete}
            fetchData={fetchData}
          />
        </Dialog>
      )}
    </>
  );
}
