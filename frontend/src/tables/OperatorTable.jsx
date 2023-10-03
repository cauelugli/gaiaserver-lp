/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import {
  Box,
  Collapse,
  Dialog,
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

export default function OperatorTable() {
  const [selectedOperator, setSelectedOperator] = React.useState("");
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);

  const [operators, setOperators] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await api.get("/users");
        const managersResponse = await api.get("/managers");
        const usersData = usersResponse.data;
        const managersData = managersResponse.data;
        const combinedData = [...usersData, ...managersData];
        setOperators(combinedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const usersResponse = await api.get("/users");
      const managersResponse = await api.get("/managers");
      const usersData = usersResponse.data;
      const managersData = managersResponse.data;
      const combinedData = [...usersData, ...managersData];
      setOperators(combinedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOpenDetail = (user) => {
    setOpenDetail(!openDetail);
    setSelectedOperator(user);
  };

  const handleOpenEdit = (user) => {
    setOpenEdit(!openEdit);
    setSelectedOperator(user);
  };

  const handleConfirmDelete = (user) => {
    setOpenDelete(!openDelete);
    setSelectedOperator(user);
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
                <TableCell align="left">
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    Nome do Colaborador
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    Posição
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    Nome de Operador
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    E-mail
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    Departamento
                  </Typography>
                </TableCell>
              </TableRow>
              {operators.map((user) => (
                <>
                  <TableRow
                    key={user._id}
                    sx={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedOperator.name === user.name && openDetail
                          ? "#eee"
                          : "none",
                      "&:hover": { backgroundColor: "#eee " },
                    }}
                  >
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
                      align="left"
                    >
                      <Typography sx={{ fontSize: 14 }}>{user.position ? "Colaborador" : "Gerente"}</Typography>
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenDetail(user)}
                      cursor="pointer"
                      align="center"
                    >
                      <Typography sx={{ fontSize: 14 }}>
                        {user.position ? user.position : "-"}
                      </Typography>
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
                        in={openDetail && selectedOperator.name === user.name}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ my: 4, px: 6 }}>
                          <Typography
                            variant="h6"
                            sx={{ fontSize: 18, fontWeight: "bold" }}
                          >
                            Informações
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
                                    Telefone
                                  </Typography>
                                </TableCell>
                                <TableCell>
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
                                <TableCell>
                                  <Typography>{user.email}</Typography>
                                </TableCell>
                                <TableCell>
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

        {openEdit && (
          <Dialog
            fullWidth
            maxWidth="md"
            open={openEdit}
            onClose={() => setOpenEdit(!openEdit)}
          >
            <EditUserForm
              openEdit={openEdit}
              selectedOperator={selectedOperator}
              setOpenEdit={setOpenEdit}
              fetchData={fetchData}
              toast={toast}
            />
          </Dialog>
        )}
        {openDelete && (
          <Dialog open={openDelete} onClose={() => setOpenDelete(!openDelete)}>
            <DeleteUserForm
              selectedOperator={selectedOperator}
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
