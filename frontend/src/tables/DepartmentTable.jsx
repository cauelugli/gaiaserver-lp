/* eslint-disable react/prop-types */
import * as React from "react";
import axios from "axios";

import {
  Button,
  Dialog,
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
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import AddDepartmentForm from "../forms/AddDepartmentForm";
import EditDepartmentForm from "../forms/EditDepartmentForm";
import DeleteDepartmentForm from "../forms/DeleteDepartmentForm";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function DepartmentTable({ selectedCustomer }) {
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [selectedDepartment, setSelectedDepartment] = React.useState([]);

  const [departments, setDepartments] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/departments");
        const filteredDepartments = response.data.filter(
          (department) => department.customerId === selectedCustomer._id
        );
        setDepartments(filteredDepartments);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [selectedCustomer._id]);

  const fetchData = async () => {
    try {
      const response = await api.get("/departments");
      const filteredDepartments = response.data.filter(
        (department) => department.customerId === selectedCustomer._id
      );
      setDepartments(filteredDepartments);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOpenDetail = (customer) => {
    setOpenDetail(!openDetail);
    setSelectedDepartment(customer.name);
  };

  const handleOpenEdit = (customer) => {
    setOpenEdit(!openEdit);
    setSelectedDepartment(customer);
  };

  const handleConfirmDelete = (customer) => {
    setSelectedDepartment(customer);
    setOpenDelete(!openDelete);
  };

  return (
    <Box>
      <Button onClick={() => setOpenAdd(true)}>
        <Typography variant="h6" color="#eee">
          + Novo
        </Typography>
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: "100%" }}>
          <TableBody>
            {departments.map((department) => (
              <>
                <TableRow
                  key={department._id}
                  sx={{
                    height: "4vw",
                    cursor: "pointer",
                    backgroundColor:
                    selectedDepartment === department.name && openDetail
                        ? "#95dd95"
                        : "none",
                    "&:hover": { backgroundColor: "#ccc " },
                  }}
                >
                  <TableCell sx={{ width: "5%" }} cursor="pointer" align="left">
                    <IconButton disabled size="small">
                      {openDetail && selectedDepartment === department.name ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell
                    onClick={() => handleOpenDetail(department)}
                    cursor="pointer"
                    align="left"
                  >
                    {department.name}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                  >
                    <Collapse
                      in={openDetail && selectedDepartment === department.name}
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
                              <TableCell>Nome do Departamento</TableCell>
                              <TableCell>Telefone</TableCell>
                              <TableCell>Gerente</TableCell>
                              <TableCell>Membros</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell component="th" scope="row">
                                {department.name}
                              </TableCell>
                              <TableCell>{department.phone}</TableCell>
                              <TableCell>{department.manager}</TableCell>
                              <TableCell>{department.members}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        <Box sx={{ mt: 3, ml: "95%" }}>
                          <ModeEditIcon
                            cursor="pointer"
                            option="delete"
                            onClick={() => handleOpenEdit(department)}
                            sx={{ color: "grey", mr: 2 }}
                          />
                          <DeleteIcon
                            cursor="pointer"
                            option="delete"
                            onClick={() => handleConfirmDelete(department)}
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
          <AddDepartmentForm
            openAdd={openAdd}
            selectedCustomer={selectedCustomer}
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
          <EditDepartmentForm
            openEdit={openEdit}
            selectedCustomer={selectedCustomer}
            selectedDepartment={selectedDepartment}
            setOpenEdit={setOpenEdit}
            fetchData={fetchData}
          />
        </Dialog>
      )}
      {openDelete && (
        <Dialog open={openDelete} onClose={() => setOpenDelete(!openDelete)}>
          <DeleteDepartmentForm
            selectedCustomer={selectedCustomer}
            selectedDepartment={selectedDepartment}
            openDelete={openDelete}
            setOpenDelete={setOpenDelete}
            fetchData={fetchData}
          />
        </Dialog>
      )}
    </Box>
  );
}
