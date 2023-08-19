import * as React from "react";
import axios from "axios";

import {
  Button,
  Dialog,
  Box,
  Collapse,
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

import AddRequestForm from "../forms/add/AddRequestForm";
import EditRequestForm from "../forms/edit/EditRequestForm";
import DeleteRequestForm from "../forms/delete/DeleteRequestForm";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function RequestTable() {
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [selectedRequest, setSelectedRequest] = React.useState([]);

  const [requests, setRequests] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/requests");
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get("/requests");
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOpenDetail = (request) => {
    setOpenDetail(!openDetail);
    setSelectedRequest(request.name);
  };

  const handleOpenEdit = (request) => {
    setOpenEdit(!openEdit);
    setSelectedRequest(request);
  };

  const handleConfirmDelete = (request) => {
    setSelectedRequest(request);
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
            {requests.map((request) => (
              <>
                <TableRow
                  key={request._id}
                  sx={{
                    height: "4vw",
                    cursor: "pointer",
                    backgroundColor:
                      (setSelectedRequest === request.name && openDetail) ? "#95dd95" : "none",
                    "&:hover": { backgroundColor: "#ccc " },
                  }}
                >
                  <TableCell
                    onClick={() => handleOpenDetail(request)}
                    cursor="pointer"
                    align="left"
                  >
                    {request.name}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                  >
                    <Collapse
                      in={openDetail && setSelectedRequest === request.name}
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
                              <TableCell>Nome</TableCell>
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
                                {request.name}
                              </TableCell>
                              <TableCell>{request.address}</TableCell>
                              <TableCell>{request.phone}</TableCell>
                              <TableCell>
                                {request.mainContactName} -{" "}
                                {request.mainContactEmail}
                              </TableCell>
                              <TableCell>{request.website}</TableCell>
                              <TableCell>{request.domain}</TableCell>
                              <TableCell>{request.segment}</TableCell>
                              <TableCell>{request.employees}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        <Box sx={{ mt: 3, ml: "90%" }}>
                          <ModeEditIcon
                            cursor="pointer"
                            option="delete"
                            onClick={() => handleOpenEdit(request)}
                            sx={{ color: "grey", mr: 2 }}
                          />
                          <DeleteIcon
                            cursor="pointer"
                            option="delete"
                            onClick={() => handleConfirmDelete(request)}
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
          <AddRequestForm
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
          <EditRequestForm
            openEdit={openEdit}
            selectedRequest={selectedRequest}
            setOpenEdit={setOpenEdit}
            fetchData={fetchData}
          />
        </Dialog>
      )}
      {openDelete && (
        <Dialog open={openDelete} onClose={() => setOpenDelete(!openDelete)}>
          <DeleteRequestForm
            selectedRequest={selectedRequest}
            openDelete={openDelete}
            setOpenDelete={setOpenDelete}
            fetchData={fetchData}
          />
        </Dialog>
      )}
    </Box>
  );
}
