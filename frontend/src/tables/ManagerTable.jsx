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

import EditManagerForm from "../forms/EditManagerForm";
import DeleteManagerForm from "../forms/DeleteManagerForm";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function ManagerTable({ selectedCustomer }) {
  const [selectedManager, setSelectedManager] = React.useState("");
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);

  const [managers, setManagers] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/managers");
        const responseDepartments = await api.get("/departments");
        const filteredManagers = response.data.filter(
          (manager) => manager.customerId === selectedCustomer._id
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
        setManagers(filteredManagers);
        setDepartments(filteredDepartments);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [selectedCustomer._id, managers]);

  const fetchData = async () => {
    try {
      const response = await api.get("/managers");
      const responseDepartments = await api.get("/departments");
      const filteredManagers = response.data.filter(
        (user) => user.customerId === selectedCustomer._id
      );
      const filteredDepartments = responseDepartments.data
        .filter((department) => department.customerId === selectedCustomer._id)
        .map((department) => ({
          id: department._id,
          name: department.name,
          color: department.color,
        }));
      setManagers(filteredManagers);
      setDepartments(filteredDepartments);
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
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: "100%" }}>
          <TableBody>
            {managers.map((manager) => (
              <>
                <TableRow
                  key={manager._id}
                  sx={{
                    cursor: "pointer",
                    backgroundColor:
                      selectedManager.name === manager.name && openDetail
                        ? "#95dd95"
                        : "none",
                    "&:hover": { backgroundColor: "#ccc " },
                  }}
                >
                  <TableCell
                    onClick={() => handleOpenDetail(manager)}
                    cursor="pointer"
                    align="left"
                  >
                    <Typography>{manager.name}</Typography>
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
                                <Typography>{manager.name}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>{manager.phone}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {manager.department ? manager.department.name : "-"}
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
          />
        </Dialog>
      )}
      {openDelete && (
        <Dialog open={openDelete} onClose={() => setOpenDelete(!openDelete)}>
          <DeleteManagerForm
            selectedCustomer={selectedCustomer}
            selectedManager={selectedManager}
            openDelete={openDelete}
            setOpenDelete={setOpenDelete}
            fetchData={fetchData}
          />
        </Dialog>
      )}
    </Box>
  );
}
