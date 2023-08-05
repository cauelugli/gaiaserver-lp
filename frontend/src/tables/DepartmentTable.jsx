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
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

import EditCustomerForm from "../forms/EditCustomerForm";
import AddDepartmentForm from "../forms/AddDepartmentForm";
import DeleteCustomerForm from "../forms/DeleteCustomerForm";

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
  const [filteredDepartments, setFilteredDepartments] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/departments");
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    setFilteredDepartments(
      departments.filter(
        (department) => department.customerId === selectedCustomer._id
      )
    );
  }, [departments, selectedCustomer._id]);

  const fetchData = async () => {
    try {
      const response = await api.get("/departments");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOpenDetail = (department) => {
    setOpenDetail(!openDetail);
    setSelectedDepartment(department.name);
  };

  const handleOpenEdit = (department) => {
    setOpenEdit(!openEdit);
    setSelectedDepartment(department);
  };

  const handleConfirmDelete = (department) => {
    setSelectedDepartment(department);
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
            {filteredDepartments.map((department) => (
              <>
                <TableRow
                  key={department._id}
                  sx={{
                    height: "4vw",
                    "&:hover": { backgroundColor: "#ccc " },
                  }}
                >
                  <TableCell sx={{ width: "5%" }} cursor="pointer" align="left">
                    <IconButton size="small">
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
                              <TableCell>E-mail</TableCell>
                              <TableCell>Gerente</TableCell>
                              <TableCell>Colaboradores</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell component="th" scope="row">
                                {department.name}
                              </TableCell>
                              <TableCell>{department.phone}</TableCell>
                              <TableCell>{department.email}</TableCell>
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
            selectedCustomer={selectedCustomer}
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
            selectedDepartment={selectedDepartment}
            setOpenEdit={setOpenEdit}
            fetchData={fetchData}
          />
        </Dialog>
      )}
      {openDelete && (
        <Dialog open={openDelete} onClose={() => setOpenDelete(!openDelete)}>
          <DeleteCustomerForm
            selectedDepartment={selectedDepartment}
            setOpenDelete={setOpenDelete}
            fetchData={fetchData}
          />
        </Dialog>
      )}
    </>
  );
}
