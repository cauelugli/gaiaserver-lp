/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const socket = io("http://localhost:5002");

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";

import { icons } from "../../icons";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function Departments({ onClose }) {
  const [configData, setConfigData] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);

  const [
    stockentriesDispatcherDepartment,
    setStockentriesDispatcherDepartment,
  ] = React.useState(null);
  const [stockEntriesNeedApproval, setStockEntriesNeedApproval] =
    React.useState(null);
  const [stockEntriesCanBeChallenged, setStockEntriesCanBeChallenged] =
    React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        const departments = await api.get("/departments");
        setDepartments(departments.data);
        setConfigData(config.data[0].stock);
        setStockentriesDispatcherDepartment(
          config.data[0].stock.stockentriesDispatcherDepartment
        );
        setStockEntriesNeedApproval(
          config.data[0].stock.stockEntriesNeedApproval
        );
        setStockEntriesCanBeChallenged(
          config.data[0].stock.stockEntriesCanBeChallenged
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChangeStockConfig = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/config/stock", {
        stockentriesDispatcherDepartment,
        stockEntriesNeedApproval,
        stockEntriesCanBeChallenged,
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

  return (
    <form onSubmit={handleChangeStockConfig}>
      <DialogTitle
        sx={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
      >
        Configurações de Estoque
      </DialogTitle>
      {configData.length !== 0 && (
        <>
          <DialogContent>
            <Grid
              container
              sx={{ mt: 2 }}
              direction="column"
              justifyContent="center"
              alignItems="flex-start"
            >
              <Accordion sx={{ width: "100%" }}>
                <AccordionSummary expandIcon={<icons.ArrowDropDownIcon />}>
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    Departamento Responsável
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid item sx={{ my: 1.5 }}>
                    <Grid container direction="row" justifyContent="space-evenly">
                      <Grid item sx={{my:"auto"}}>
                        <Select
                          onChange={(e) =>
                            setStockentriesDispatcherDepartment(e.target.value)
                          }
                          value={stockentriesDispatcherDepartment}
                          displayEmpty
                          disabled={!stockEntriesNeedApproval}
                          required
                          renderValue={(selected) => {
                            if (!selected) {
                              return (
                                <Typography>
                                  Selecione o Departamento
                                </Typography>
                              );
                            } else {
                              return (
                                <Grid container direction="row">
                                  <Paper
                                    elevation={0}
                                    sx={{
                                      mr: 1,
                                      mt: 0.5,
                                      width: 15,
                                      height: 15,
                                      borderRadius: 50,
                                      backgroundColor: selected.color,
                                    }}
                                  />
                                  <Typography>{selected.name}</Typography>
                                </Grid>
                              );
                            }
                          }}
                          sx={{ minWidth: "200px", mr: 1 }}
                        >
                          {departments.map((item) => (
                            <MenuItem value={item} key={item.id} disabled={!item.manager}>
                              <Grid container direction="row">
                                <Paper
                                  elevation={0}
                                  sx={{
                                    mr: 1,
                                    mt: 0.5,
                                    width: 15,
                                    height: 15,
                                    borderRadius: 50,
                                    backgroundColor: item.color,
                                  }}
                                />
                                <Typography>{item.name}</Typography>
                              </Grid>
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid item>
                        {stockentriesDispatcherDepartment &&
                          stockEntriesNeedApproval &&
                          stockentriesDispatcherDepartment.manager && (
                            <Grid
                              container
                              direction="column"
                              alignItems="center"
                              justifyContent="space-around"
                            >
                              <Avatar
                                src={`http://localhost:3000/static/${stockentriesDispatcherDepartment.manager.image}`}
                                style={{
                                  width: 82,
                                  height: 82,
                                }}
                              />
                              <Typography
                                sx={{ mt: 1, fontSize: 12, color: "grey" }}
                              >
                                Gerente:{" "}
                                <strong>
                                  {
                                    stockentriesDispatcherDepartment.manager
                                      .name
                                  }
                                </strong>
                              </Typography>
                            </Grid>
                          )}{" "}
                        {/* </Grid> */}
                      </Grid>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Accordion sx={{ width: "100%", mt: 2 }}>
                <AccordionSummary expandIcon={<icons.ArrowDropDownIcon />}>
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    Permissões
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid item sx={{ my: 1.5 }}>
                    <Grid container direction="row">
                      <Typography sx={{ my: "auto" }}>
                        Entradas de Estoque Precisam de Aprovação do Gerente
                      </Typography>
                      <Tooltip
                        title={
                          <Typography sx={{ fontSize: 12 }}>
                            Se a opção marcada for "Sim", o 'status' de uma nova
                            Entrada de Estoque será "Aberto". Se estiver marcado
                            "Não", o status será 'Aprovado'. A opção padrão é
                            "Sim".
                          </Typography>
                        }
                      >
                        <Button
                          size="small"
                          sx={{
                            backgroundColor: "white",
                            color: "#32aacd",
                            "&:hover": {
                              backgroundColor: "white",
                            },
                          }}
                        >
                          ?
                        </Button>
                      </Tooltip>
                      <RadioGroup
                        row
                        value={stockEntriesNeedApproval}
                        onChange={(e) =>
                          setStockEntriesNeedApproval(e.target.value)
                        }
                      >
                        <FormControlLabel
                          value={Boolean(true)}
                          control={
                            <Radio size="small" sx={{ mt: -0.25, mr: -0.5 }} />
                          }
                          label={
                            <Typography sx={{ fontSize: 13 }}>Sim</Typography>
                          }
                        />
                        <FormControlLabel
                          value={Boolean(false)}
                          control={
                            <Radio size="small" sx={{ mt: -0.25, mr: -0.5 }} />
                          }
                          label={
                            <Typography sx={{ fontSize: 13 }}>Não</Typography>
                          }
                        />
                      </RadioGroup>
                    </Grid>
                  </Grid>
                  <Grid item sx={{ my: 1.5 }}>
                    <Grid container direction="row">
                      <Typography sx={{ my: "auto" }}>
                        Entradas de Estoque Aprovadas podem ser Contestadas
                      </Typography>
                      <Tooltip
                        title={
                          <Typography sx={{ fontSize: 12 }}>
                            Se a opção marcada for "Sim", os operadores com
                            acesso à página 'Financeiro' poderão rejeitar as
                            aprovações do Gerente designado às Entradas de
                            Estoque. Se estiver marcado "Não", os operadores não
                            poderão fazer nenhuma contestação. A opção padrão é
                            "Sim".
                          </Typography>
                        }
                      >
                        <Button
                          size="small"
                          sx={{
                            backgroundColor: "white",
                            color: "#32aacd",
                            "&:hover": {
                              backgroundColor: "white",
                            },
                          }}
                        >
                          ?
                        </Button>
                      </Tooltip>
                      <RadioGroup
                        row
                        value={stockEntriesCanBeChallenged}
                        onChange={(e) =>
                          setStockEntriesCanBeChallenged(e.target.value)
                        }
                      >
                        <FormControlLabel
                          value={Boolean(true)}
                          control={
                            <Radio size="small" sx={{ mt: -0.25, mr: -0.5 }} />
                          }
                          label={
                            <Typography sx={{ fontSize: 13 }}>Sim</Typography>
                          }
                        />
                        <FormControlLabel
                          value={Boolean(false)}
                          control={
                            <Radio size="small" sx={{ mt: -0.25, mr: -0.5 }} />
                          }
                          label={
                            <Typography sx={{ fontSize: 13 }}>Não</Typography>
                          }
                        />
                      </RadioGroup>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
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
