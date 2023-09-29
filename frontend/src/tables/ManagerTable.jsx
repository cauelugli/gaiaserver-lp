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

import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

import EditManagerForm from "../forms/edit/EditManagerForm";
import DeleteManagerForm from "../forms/delete/DeleteManagerForm";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function ManagerTable() {
  const [selectedManager, setSelectedManager] = React.useState("");
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);

  const [managers, setManagers] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const managers = await api.get("/managers");
        const departments = await api.get("/departments");
        setManagers(managers.data);
        setDepartments(departments.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [managers]);

  const fetchData = async () => {
    try {
      const managers = await api.get("/managers");
      const departments = await api.get("/departments");
      setManagers(managers.data);
      setDepartments(departments.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOpenDetail = (user) => {
    setOpenDetail(!openDetail);
    setSelectedManager(user);
  };

  const handleOpenEdit = (user) => {
    setOpenEdit(!openEdit);
    setSelectedManager(user);
  };

  const handleConfirmDelete = (user) => {
    setOpenDelete(!openDelete);
    setSelectedManager(user);
  };

  return (
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
                <Typography sx={{ fontSize: 16, fontWeight:"bold" }}>Nome do Gerente</Typography>
              </TableCell>
              <TableCell align="left">
                <Typography sx={{ fontSize: 16, fontWeight:"bold" }}>E-mail</Typography>
              </TableCell>
              <TableCell align="left">
                <Typography sx={{ fontSize: 16, fontWeight:"bold" }}>Departamento</Typography>
              </TableCell>
            </TableRow>
            {managers.map((manager) => (
              <>
                <TableRow
                  key={manager._id}
                  sx={{
                    cursor: "pointer",
                    backgroundColor:
                      selectedManager.name === manager.name && openDetail
                        ? "#eee"
                        : "none",
                    "&:hover": { backgroundColor: "#eee " },
                  }}
                >
                  <TableCell
                    onClick={() => handleOpenDetail(manager)}
                    cursor="pointer"
                    align="left"
                  >
                    <Typography sx={{ fontSize: 14 }}>
                      {manager.name}
                    </Typography>
                  </TableCell>
                  <TableCell
                    onClick={() => handleOpenDetail(manager)}
                    cursor="pointer"
                    align="left"
                  >
                    <Typography sx={{ fontSize: 14 }}>
                      {manager.email}
                    </Typography>
                  </TableCell>
                  <TableCell
                    onClick={() => handleOpenDetail(manager)}
                    cursor="pointer"
                    align="left"
                  >
                    <Typography sx={{ fontSize: 14 }}>
                      {manager.department ? manager.department.name : "-"}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                  >
                    <Collapse
                      in={openDetail && selectedManager.name === manager.name}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box sx={{ m: 1, p: 4 }}>
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
                                  Telefone
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
                                  Departamento
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell component="th" scope="row">
                                <Typography>{manager.name}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>{manager.phone}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>{manager.email}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {manager.department ? (
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
                                            manager.department.color,
                                        }}
                                      >
                                        {" "}
                                      </Paper>
                                      <Typography>
                                        {manager.department.name}
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
                            onClick={() => handleOpenEdit(manager)}
                            sx={{ color: "grey", mr: 2 }}
                          />
                          <DeleteIcon
                            cursor="pointer"
                            onClick={() => handleConfirmDelete(manager)}
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
          <EditManagerForm
            openEdit={openEdit}
            selectedManager={selectedManager}
            managers={managers}
            departments={departments}
            setOpenEdit={setOpenEdit}
            fetchData={fetchData}
            toast={toast}

          />
        </Dialog>
      )}
      {openDelete && (
        <Dialog open={openDelete} onClose={() => setOpenDelete(!openDelete)}>
          <DeleteManagerForm
            selectedManager={selectedManager}
            openDelete={openDelete}
            setOpenDelete={setOpenDelete}
            fetchData={fetchData}
            toast={toast}

          />
        </Dialog>
      )}
    </Box>
  );
}
