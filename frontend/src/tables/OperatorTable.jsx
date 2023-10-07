/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import {
  Avatar,
  Box,
  Dialog,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
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

  const [operators, setOperators] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await api.get("/users");
        const managersResponse = await api.get("/managers");
        const usersData = usersResponse.data;
        const managersData = managersResponse.data;
        const combinedData = [...usersData, ...managersData];
        setOperators(combinedData.filter((user) => user.username));
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
      setOperators(combinedData.filter((user) => user.username));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
                <TableCell padding="checkbox"></TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    Nome do Colaborador
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    Nome de Operador
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    Nível de Acesso
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    Ações
                  </Typography>
                </TableCell>
              </TableRow>
              {operators.map((user) => (
                <>
                  <TableRow
                    key={user._id}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "#eee " },
                    }}
                  >
                    <TableCell sx={{ py: 0 }}>
                      <Avatar
                        src={`http://localhost:3000/static/${user.image}`}
                        alt={user.name[0]}
                        cursor="pointer"
                        style={{
                          marginLeft: 10,
                          width: 42,
                          height: 42,
                          border: "2px solid #32aacd",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 14 }}>{user.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 14 }}>
                        {user.username ? user.username : "-"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: 14 }}>
                        {user.role ? user.role : "-"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box>
                        <IconButton size="small">
                          <ModeEditIcon
                            fontSize="inherit"
                            cursor="pointer"
                            onClick={() => handleOpenEdit(user)}
                            sx={{ color: "grey", mr: 1 }}
                          />
                        </IconButton>
                        <IconButton size="small">
                          <DeleteIcon
                            fontSize="inherit"
                            cursor="pointer"
                            onClick={() => handleConfirmDelete(user)}
                            sx={{ color: "#ff4444" }}
                          />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow></TableRow>
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
