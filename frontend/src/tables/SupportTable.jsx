/* eslint-disable react/prop-types */
import * as React from "react";
import axios from "axios";

import {
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

import EditRequestForm from "../forms/edit/EditRequestForm";
// import DeleteRequestForm from "../forms/delete/DeleteRequestForm";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function SupportTable({ selectedCustomer, fetchData }) {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [selectedRequest, setSelectedRequest] = React.useState([]);

  const [filteredSupports, setFilteredSupports] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const supports = await api.get("/supports");
        setFilteredSupports(
          supports.data.filter((support) => support.customerId === selectedCustomer._id)
        );
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [selectedCustomer]);

  const handleOpenDetail = (request) => {
    setOpenDetail(!openDetail);
    setSelectedRequest(request);
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
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: "100%" }}>
          <TableBody>
            {filteredSupports.map((request) => (
              <>
                <TableRow
                  key={request._id}
                  sx={{
                    cursor: "pointer",
                    backgroundColor:
                      setSelectedRequest === request.title && openDetail
                        ? "#95dd95"
                        : "none",
                    "&:hover": { backgroundColor: "#ccc " },
                  }}
                >
                  <TableCell
                    onClick={() => handleOpenDetail(request)}
                    cursor="pointer"
                    align="left"
                  >
                    {request.title}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                  >
                    <Collapse
                      in={openDetail && selectedRequest.title === request.title}
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
                              <TableCell>Titulo</TableCell>
                              <TableCell>Tipo</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell component="th" scope="row">
                                {request.title}
                              </TableCell>
                              <TableCell>{request.type}</TableCell>
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
      {/* {openDelete && (
        <Dialog open={openDelete} onClose={() => setOpenDelete(!openDelete)}>
          <DeleteRequestForm
            selectedRequest={selectedRequest}
            openDelete={openDelete}
            setOpenDelete={setOpenDelete}
            fetchData={fetchData}
          />
        </Dialog>
      )} */}
    </Box>
  );
}
