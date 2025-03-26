/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const socket = io("http://localhost:5002");
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { icons } from "../../icons";

export default function Requests({ onClose }) {
  const [configData, setConfigData] = React.useState([]);
  const [statuses, setStatuses] = React.useState([]);

  const [showNewStatus, setShowNewStatus] = React.useState(false);
  const [newStatus, setNewStatus] = React.useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const configResponse = await api.get("/config");
        const configData = configResponse.data.requests;

        setConfigData(configData);
        setStatuses(
          configData.requestStatuses.sort((a, b) => a.localeCompare(b))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChangeRequestConfig = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/config/requests", {
        prevData: configData,
        statuses,
      });

      if (res.data) {
        toast.success("Configuração Alterada!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      onClose();
      socket.emit("forceRefresh");
    } catch (err) {
      console.log("erro", err);
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
    }
  };

  const handleRemoveStatus = (status) => {
    setStatuses((prevStatuses) => prevStatuses.filter((s) => s !== status));
  };

  return (
    <form onSubmit={handleChangeRequestConfig}>
      <DialogTitle
        sx={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
      >
        Configurações de Solicitações
      </DialogTitle>
      {configData.length !== 0 && (
        <>
          <DialogContent>
            <Grid2
              container
              sx={{ mt: 2 }}
              direction="column"
              justifyContent="center"
              alignItems="flex-start"
            >
              <Accordion sx={{ width: "100%" }}>
                <AccordionSummary expandIcon={<icons.ArrowDropDownIcon />}>
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    Permissões
                  </Typography>
                </AccordionSummary>
                <AccordionDetails></AccordionDetails>
              </Accordion>
              <Accordion sx={{ width: "100%", mt: 2 }}>
                <AccordionSummary expandIcon={<icons.ArrowDropDownIcon />}>
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    Status
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid2 item sx={{ my: 1.5 }}>
                    <Grid2 container direction="column" alignItems="center">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Ações</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {statuses.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={3}>
                                Nenhum status disponível
                              </TableCell>
                            </TableRow>
                          ) : (
                            statuses.map((status, index) => (
                              <TableRow key={index}>
                                <TableCell>{status}</TableCell>
                                <TableCell>
                                  <IconButton
                                    color="secondary"
                                    onClick={() => handleRemoveStatus(status)}
                                    disabled={
                                      status === "Aberto" ||
                                      status === "Resolvido"
                                    }
                                  >
                                    <icons.DeleteIcon
                                      sx={{
                                        color:
                                          status === "Aberto" ||
                                          status === "Resolvido"
                                            ? "darkgrey"
                                            : "red",
                                      }}
                                    />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </Grid2>
                    <Grid2 container direction="column" alignItems="center">
                      {showNewStatus && (
                        <Grid2 sx={{ mt: 2 }}>
                          <TextField
                            sx={{ mr: 2 }}
                            label="Nome do Novo Status"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                          />
                        </Grid2>
                      )}
                      <Grid2 item>
                        <Button
                          variant="contained"
                          onClick={() => setShowNewStatus((prev) => !prev)}
                          color={showNewStatus ? "error" : "inherit"}
                          sx={{ my: 2, mr: 2 }}
                        >
                          {showNewStatus ? "Cancelar" : "+ NOVO STATUS"}
                        </Button>
                        {showNewStatus && (
                          <Button
                            variant={
                              newStatus === "" ? "outlined" : "contained"
                            }
                            onClick={() => {
                              setStatuses((prevStatuses) =>
                                [...prevStatuses, newStatus].sort((a, b) =>
                                  a.localeCompare(b)
                                )
                              );
                              setNewStatus("");
                              setShowNewStatus(false);
                            }}
                            color={newStatus === "" ? "inherit" : "success"}
                            disabled={newStatus === ""}
                          >
                            Adicionar Status
                          </Button>
                        )}
                      </Grid2>
                    </Grid2>
                  </Grid2>
                </AccordionDetails>
              </Accordion>
            </Grid2>
          </DialogContent>
          <DialogActions>
            <Button type="submit" variant="contained" color="success">
              OK
            </Button>
          </DialogActions>
        </>
      )}
    </form>
  );
}
