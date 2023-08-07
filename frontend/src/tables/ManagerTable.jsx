/* eslint-disable react/prop-types */
import * as React from "react";
import axios from "axios";

import {
  Button,
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

import AddUserForm from "../forms/AddUserForm";
import DeleteUserForm from "../forms/DeleteUserForm";
import EditUserForm from "../forms/DeleteUserForm";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function ManagerTable({ selectedCustomer }) {
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);

  const [users, setUsers] = React.useState([]);
  const [managers, setManagers] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/users");
        const responseDepartments = await api.get("/departments");
        const filteredUsers = response.data.filter(
          (user) => user.customerId === selectedCustomer._id
        );
        const filteredManagers = filteredUsers.filter(
          (user) => user.position === "Gerente"
        );
        const filteredDepartments = responseDepartments.data.filter(
          (department) => department.customerId === selectedCustomer._id
        );
        setUsers(filteredUsers);
        setManagers(filteredManagers);
        setDepartments(filteredDepartments);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [selectedCustomer._id]);

  const fetchData = async () => {
    try {
      const response = await api.get("/users");
      const responseDepartments = await api.get("/departments");
      const filteredUsers = response.data.filter(
        (user) => user.customerId === selectedCustomer._id
      );
      const filteredManagers = filteredUsers.filter(
        (user) => user.position === "Gerente"
      );
      const filteredDepartments = responseDepartments.filter(
        (department) => department.customerId === selectedCustomer._id
      );
      setUsers(filteredUsers);
      setManagers(filteredManagers);
      setDepartments(filteredDepartments);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOpenDetail = (user) => {
    setOpenDetail(!openDetail);
    setSelectedUser(user);
  };

  const handleOpenEdit = (user) => {
    setOpenEdit(!openEdit);
    setSelectedUser(user);
  };

  const handleConfirmDelete = (user) => {
    setOpenDelete(!openDelete);
    setSelectedUser(user);
  };

  return (
    <>
      <Button onClick={() => setOpenAdd(true)}>
        <Typography variant="h6" color="#eee">
          + Novo {selectedCustomer.name}
        </Typography>
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell align="right">E-mail</TableCell>
              <TableCell align="right">Telefone</TableCell>
              <TableCell align="right">Departamento</TableCell>
              <TableCell align="right">Posição</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {managers &&
              managers.map((user) => (
                <TableRow
                  key={user._id}
                  sx={{ "&:hover": { backgroundColor: "#ccc " } }}
                >
                  <TableCell cursor="pointer" align="left">
                    {user.name}
                  </TableCell>
                  <TableCell cursor="pointer" align="right">
                    {user.email}
                  </TableCell>
                  <TableCell cursor="pointer" align="right">
                    {user.phone}
                  </TableCell>
                  <TableCell cursor="pointer" align="right">
                    {user.department.name}
                  </TableCell>
                  <TableCell cursor="pointer" align="right">
                    {user.position}
                  </TableCell>
                </TableRow>
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
          <AddUserForm
            openAdd={openAdd}
            selectedCustomer={selectedCustomer}
            managers={managers}
            departments={departments}
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
          <EditUserForm
            openEdit={openEdit}
            selectedUser={selectedUser}
            setOpenEdit={setOpenEdit}
            fetchData={fetchData}
          />
        </Dialog>
      )}
      {openDelete && (
        <Dialog open={openDelete} onClose={() => setOpenDelete(!openDelete)}>
          <DeleteUserForm
            selectedUser={selectedUser}
            openDelete={openDelete}
            setOpenDelete={setOpenDelete}
            fetchData={fetchData}
          />
        </Dialog>
      )}
    </>
  );
}
