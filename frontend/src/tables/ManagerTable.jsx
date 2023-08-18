/* eslint-disable react/prop-types */
import * as React from "react";
import axios from "axios";

import {
  Box,
  Collapse,
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

import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

import AddUserForm from "../forms/AddUserForm";
import DeleteUserForm from "../forms/DeleteUserForm";
import EditUserForm from "../forms/EditUserForm";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function ManagerTable({ selectedCustomer }) {
  const [selectedUser, setSelectedUser] = React.useState("");
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
        const filteredDepartments = responseDepartments.data
          .filter(
            (department) => department.customerId === selectedCustomer._id
          )
          .map((department) => ({
            id: department._id,
            name: department.name,
            color: department.color,
          }));
        setUsers(filteredManagers);
        setManagers(filteredManagers);
        setDepartments(filteredDepartments);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [selectedCustomer._id, users]);

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
      const filteredDepartments = responseDepartments.data
        .filter((department) => department.customerId === selectedCustomer._id)
        .map((department) => ({
          id: department._id,
          name: department.name,
          color: department.color,
        }));
      setUsers(filteredManagers);
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
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: "100%" }}>
          <TableBody>
            {users.map((user) => (
              <>
                <TableRow
                  key={user._id}
                  sx={{
                    cursor: "pointer",
                    backgroundColor:
                      selectedUser.name === user.name && openDetail
                        ? "#95dd95"
                        : "none",
                    "&:hover": { backgroundColor: "#ccc " },
                  }}
                >
                  <TableCell
                    onClick={() => handleOpenDetail(user)}
                    cursor="pointer"
                    align="left"
                  >
                    <Typography>{user.name}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                  >
                    <Collapse
                      in={openDetail && selectedUser.name === user.name}
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
                              <TableCell>
                                <Typography sx={{ fontSize: "14px", color: "#777" }}>Nome</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography sx={{ fontSize: "14px", color: "#777" }}>Telefone</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography sx={{ fontSize: "14px", color: "#777" }}>Departamento</Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell component="th" scope="row">
                                <Typography>{user.name}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>{user.phone}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {user.department ? user.department.name : "-"}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        <Box sx={{ mt: 3, ml: "90%" }}>
                          <ModeEditIcon
                            cursor="pointer"
                            onClick={() => handleOpenEdit(user)}
                            sx={{ color: "grey", mr: 2 }}
                          />
                          <DeleteIcon
                            cursor="pointer"
                            onClick={() => handleConfirmDelete(user)}
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
          <AddUserForm
            openAdd={openAdd}
            selectedCustomer={selectedCustomer}
            users={users}
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
            managers={managers}
            departments={departments}
            setOpenEdit={setOpenEdit}
            fetchData={fetchData}
          />
        </Dialog>
      )}
      {openDelete && (
        <Dialog open={openDelete} onClose={() => setOpenDelete(!openDelete)}>
          <DeleteUserForm
            selectedCustomer={selectedCustomer}
            selectedUser={selectedUser}
            openDelete={openDelete}
            setOpenDelete={setOpenDelete}
            fetchData={fetchData}
          />
        </Dialog>
      )}
    </Box>
  );
}
