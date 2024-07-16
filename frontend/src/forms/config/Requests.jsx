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
  Radio,
  RadioGroup,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function Requests({ onClose }) {
  const [configData, setConfigData] = React.useState([]);
  const [managers, setManagers] = React.useState([]);
  const [requestsNeedApproval, setRequestsNeedApproval] = React.useState(null);
  const [requestsApproverManagerId, setRequestsApproverManagerId] =
    React.useState(null);
  const [requestsCanBeDeleted, setRequestsCanBeDeleted] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const configResponse = await api.get("/config");
        const managersResponse = await api.get("/get", {
          params: { model: "Manager" },
        });
        const managersData = managersResponse.data;
        const configData = configResponse.data[0].requests;

        setManagers(managersData);
        setConfigData(configData);
        setRequestsNeedApproval(configData.requestsNeedApproval);
        setRequestsCanBeDeleted(configData.canBeDeleted);

        const approverManager = managersData.find(
          (manager) => manager._id === configData.requestsApproverManagerId
        );
        setRequestsApproverManagerId(approverManager || null);
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
        requestsNeedApproval,
        requestsApproverManagerId: requestsApproverManagerId._id,
        requestsCanBeDeleted,
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
    <form onSubmit={handleChangeRequestConfig}>
      <DialogTitle
        sx={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
      >
        Configurações de Solicitações
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
                <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    Permissões
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid item sx={{ my: 1.5 }}>
                    <Grid container direction="row">
                      <Typography sx={{ my: "auto" }}>
                        Solicitações Precisam de Aprovação do Gerente
                      </Typography>
                      <Tooltip
                        title={
                          <Typography sx={{ fontSize: 12 }}>
                            Se a opção marcada for "Sim", o 'status' de uma nova
                            solicitação de Job será "Aberto". Se estiver marcado
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
                        value={requestsNeedApproval}
                        onChange={(e) =>
                          setRequestsNeedApproval(e.target.value)
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
                  {requestsNeedApproval && (
                    <Grid item sx={{ my: 1.5 }}>
                      <Grid container direction="row">
                        <Typography sx={{ my: "auto" }}>
                          Gerente Aprovador{" "}
                        </Typography>
                        <Select
                          sx={{ ml: 3, minWidth: 200 }}
                          size="small"
                          onChange={(e) => {
                            setRequestsApproverManagerId(e.target.value);
                          }}
                          value={requestsApproverManagerId}
                          displayEmpty
                          required
                          renderValue={(selected) => {
                            if (selected.length === 0) {
                              return (
                                <Typography>Selecione o Gerente</Typography>
                              );
                            } else {
                              return (
                                <Grid container direction="row">
                                  <Avatar
                                    alt="Imagem"
                                    src={`http://localhost:3000/static/${selected.image}`}
                                    sx={{ width: 22, height: 22, mr: 1 }}
                                  />
                                  <Typography>{selected.name}</Typography>
                                </Grid>
                              );
                            }
                          }}
                        >
                          {managers.map((item) => (
                            <MenuItem value={item} key={item.id}>
                              <Avatar
                                alt="Imagem do Colaborador"
                                src={`http://localhost:3000/static/${item.image}`}
                                sx={{ width: 22, height: 22, mr: 2 }}
                              />
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                    </Grid>
                  )}

                  <Grid item sx={{ my: 1.5 }}>
                    <Grid container direction="row">
                      <Typography sx={{ my: "auto", mr: 1 }}>
                        Solicitações Podem ser Deletadas
                      </Typography>
                      <Tooltip
                        title={
                          <Typography sx={{ fontSize: 12 }}>
                            Se a opção marcada for "Sim", as solicitações de
                            Jobs e Vendas poderão ser deletadas. A opção padrão
                            é "Sim".
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
                        value={requestsCanBeDeleted}
                        onChange={(e) =>
                          setRequestsCanBeDeleted(e.target.value)
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
