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
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import AddJobForm from "../forms/AddJobForm";
import EditJobForm from "../forms/EditJobForm";
import DeleteJobForm from "../forms/DeleteJobForm";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function JobTable() {
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [selectedJob, setSelectedJob] = React.useState([]);

  const [jobs, setJobs] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/jobs");
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get("/jobs");
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOpenDetail = (job) => {
    setOpenDetail(!openDetail);
    setSelectedJob(job.name);
  };

  const handleOpenEdit = (job) => {
    setOpenEdit(!openEdit);
    setSelectedJob(job);
  };

  const handleConfirmDelete = (job) => {
    setSelectedJob(job);
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
            {jobs.map((job) => (
              <>
                <TableRow
                  key={job._id}
                  sx={{
                    height: "4vw",
                    cursor: "pointer",
                    backgroundColor:
                      (setSelectedJob === job.name && openDetail) ? "#95dd95" : "none",
                    "&:hover": { backgroundColor: "#ccc " },
                  }}
                >
                  <TableCell sx={{ width: "5%" }} cursor="pointer" align="left">
                    <IconButton disabled size="small">
                      {openDetail && setSelectedJob === job.name ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell
                    onClick={() => handleOpenDetail(job)}
                    cursor="pointer"
                    align="left"
                  >
                    {job.name}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                  >
                    <Collapse
                      in={openDetail && setSelectedJob === job.name}
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
                                {job.name}
                              </TableCell>
                              <TableCell>{job.address}</TableCell>
                              <TableCell>{job.phone}</TableCell>
                              <TableCell>
                                {job.mainContactName} -{" "}
                                {job.mainContactEmail}
                              </TableCell>
                              <TableCell>{job.website}</TableCell>
                              <TableCell>{job.domain}</TableCell>
                              <TableCell>{job.segment}</TableCell>
                              <TableCell>{job.employees}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        <Box sx={{ mt: 3, ml: "90%" }}>
                          <ModeEditIcon
                            cursor="pointer"
                            option="delete"
                            onClick={() => handleOpenEdit(job)}
                            sx={{ color: "grey", mr: 2 }}
                          />
                          <DeleteIcon
                            cursor="pointer"
                            option="delete"
                            onClick={() => handleConfirmDelete(job)}
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
          <AddJobForm
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
          <EditJobForm
            openEdit={openEdit}
            selectedJob={selectedJob}
            setOpenEdit={setOpenEdit}
            fetchData={fetchData}
          />
        </Dialog>
      )}
      {openDelete && (
        <Dialog open={openDelete} onClose={() => setOpenDelete(!openDelete)}>
          <DeleteJobForm
            selectedJob={selectedJob}
            openDelete={openDelete}
            setOpenDelete={setOpenDelete}
            fetchData={fetchData}
          />
        </Dialog>
      )}
    </Box>
  );
}
