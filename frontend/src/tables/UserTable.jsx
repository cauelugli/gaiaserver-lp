/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import {
  Avatar,
  Box,
  Collapse,
  Dialog,
  DialogContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";

import EditUserForm from "../forms/edit/EditUserForm";
import DeleteUserForm from "../forms/delete/DeleteUserForm";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function UserTable() {
  const [selectedUser, setSelectedUser] = React.useState("");
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);

  const [users, setUsers] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);

  const [openImage, setOpenImage] = React.useState(false);

  const handleOpenImage = () => {
    setOpenImage(true);
  };

  const handleCloseImage = () => {
    setOpenImage(false);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await api.get("/users");
        const departments = await api.get("/departments");
        setUsers(users.data);
        setDepartments(departments.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [users]);

  const fetchData = async () => {
    try {
      const users = await api.get("/users");
      const departments = await api.get("/departments");
      setUsers(users.data);
      setDepartments(departments.data);
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
      <Box sx={{ minWidth: "1050px" }}>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow
                sx={{
                  backgroundColor: "#ccc",
                }}
              >
                <TableCell padding="checkbox"></TableCell>
                <TableCell align="left">
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    Nome do Colaborador
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    E-mail
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    Telefone
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    Departamento
                  </Typography>
                </TableCell>
              </TableRow>
              {users.map((user) => (
                <>
                  <TableRow
                    key={user._id}
                    sx={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedUser.name === user.name && openDetail
                          ? "#eee"
                          : "none",
                      "&:hover": { backgroundColor: "#eee " },
                    }}
                  >
                    <TableCell
                      onClick={() => handleOpenDetail(user)}
                      cursor="pointer"
                      align="right"
                      sx={{ py: 0 }}
                    >
                      <Avatar
                        src={`http://localhost:3000/static/${user.image}`}
                        alt={user.name[0]}
                        cursor="pointer"
                        style={{
                          marginLeft: 10,
                          width: 42,
                          height: 42,
                          border: "2px solid #32aacd",
                          opacity:
                            openDetail && selectedUser.name === user.name
                              ? 0
                              : 100,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(user)}
                      cursor="pointer"
                      align="left"
                    >
                      <Typography sx={{ fontSize: 14 }}>{user.name}</Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(user)}
                      cursor="pointer"
                      align="center"
                    >
                      <Typography sx={{ fontSize: 14 }}>
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(user)}
                      cursor="pointer"
                      align="center"
                    >
                      <Typography sx={{ fontSize: 14 }}>
                        {user.phone}
                      </Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(user)}
                      cursor="pointer"
                      align="center"
                    >
                      <Typography sx={{ fontSize: 14 }}>
                        {user.department ? user.department.name : "-"}
                      </Typography>
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
                        <Box sx={{ my: 4, px: 2 }}>
                          <Typography
                            variant="h6"
                            sx={{ fontSize: 18, fontWeight: "bold", my: 2 }}
                          >
                            Informações
                          </Typography>
                          <Grid
                            container
                            direction="row"
                            justifyContent="space-around"
                          >
                            <Grid item>
                              <Grid
                                container
                                direction="column"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <Avatar
                                  alt="Imagem do Produto"
                                  cursor="pointer"
                                  src={`http://localhost:3000/static/${user.image}`}
                                  sx={{ width: 200, height: 200, mr: 4 }}
                                  onDoubleClick={handleOpenImage}
                                />
                                <Dialog
                                  open={openImage}
                                  onClose={handleCloseImage}
                                >
                                  <DialogContent>
                                    <img
                                      cursor="pointer"
                                      src={`http://localhost:3000/static/${user.image}`}
                                      alt="Imagem do Usuário"
                                      style={{ maxWidth: "100%" }}
                                    />
                                  </DialogContent>
                                </Dialog>
                              </Grid>
                            </Grid>
                            <Grid item>
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
                                    <TableCell align="center">
                                      <Typography
                                        sx={{ fontSize: "14px", color: "#777" }}
                                      >
                                        E-mail
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Typography
                                        sx={{ fontSize: "14px", color: "#777" }}
                                      >
                                        Telefone
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Typography
                                        sx={{ fontSize: "14px", color: "#777" }}
                                      >
                                        Departamento
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  <TableRow>
                                    <TableCell>
                                      <Typography>{user.name}</Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Typography>{user.email}</Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Typography>{user.phone}</Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography>
                                        {user.department ? (
                                          <Grid container direction="row">
                                            <Paper
                                              elevation={0}
                                              sx={{
                                                mr: 1,
                                                mt: 0.5,
                                                width: 15,
                                                height: 15,
                                                borderRadius: 50,
                                                backgroundColor:
                                                  user.department.color,
                                              }}
                                            >
                                              {" "}
                                            </Paper>
                                            <Typography>
                                              {user.department.name}
                                            </Typography>
                                          </Grid>
                                        ) : (
                                          "-"
                                        )}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                              <Table size="small" sx={{ mt: 4 }}>
                                <TableHead>
                                  <TableRow>
                                    <TableCell align="center">
                                      <Typography
                                        sx={{ fontSize: "14px", color: "#777" }}
                                      >
                                        Ocupação
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Typography
                                        sx={{ fontSize: "14px", color: "#777" }}
                                      >
                                        Nome de Operador
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Typography
                                        sx={{ fontSize: "14px", color: "#777" }}
                                      >
                                        Nível de Acesso
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  <TableRow>
                                    <TableCell align="center">
                                      <Typography>
                                        {user.position ? user.position : "-"}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Typography>
                                        {user.username ? user.username : "-"}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Typography>
                                        {user.role ? user.role : "-"}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </Grid>
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
                          </Grid>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

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
              departments={departments}
              setOpenEdit={setOpenEdit}
              fetchData={fetchData}
              toast={toast}
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
              toast={toast}
            />
          </Dialog>
        )}
      </Box>
    </>
  );
}
