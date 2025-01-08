/* eslint-disable react/no-unescaped-entities */
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
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
} from "@mui/material";

import { icons } from "../../icons";
import ManagerSelectTableCell from "../../components/tableCells/ManagerSelectTableCell";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function Departments({ onClose }) {
  const [configData, setConfigData] = React.useState([]);
  const [stockEntriesDispatcherManager, setStockEntriesDispatcherManager] =
    React.useState(null);
  const [stockEntriesNeedApproval, setStockEntriesNeedApproval] =
    React.useState(null);
  const [stockEntriesCanBeChallenged, setStockEntriesCanBeChallenged] =
    React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        const managersResponse = await api.get("/get", {
          params: { model: "User" },
        });
        const managersData = managersResponse.data.filter(
          (user) => user.isManager
        );
        setConfigData(config.data[0].stock);
        const approverManager = managersData.find(
          (manager) => manager._id === configData.stockEntriesDispatcherManager
        );
        setStockEntriesDispatcherManager(approverManager || null);

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
  }, [configData.stockEntriesDispatcherManager]);

  const handleChangeStockConfig = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/config/stock", {
        stockEntriesDispatcherManager: stockEntriesDispatcherManager
          ? stockEntriesDispatcherManager._id
          : "",
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
                    Permissões
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid item sx={{ my: 1.5 }}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-between"
                      sx={{ px: 4 }}
                    >
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
                        <Typography sx={{ my: "auto", mr: 1 }}>
                          Entradas de Estoque Precisam de Aprovação do Gerente
                        </Typography>
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
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-between"
                      sx={{ px: 4 }}
                    >
                      <Tooltip
                        title={
                          <Typography sx={{ fontSize: 12 }}>
                            Selecione o Gerente que será responsável pela
                            Aprovação das Entradas de Estoque solicitadas.
                          </Typography>
                        }
                      >
                        <Typography sx={{ my: "auto" }}>
                          Gerente Aprovador
                        </Typography>
                      </Tooltip>
                      <ManagerSelectTableCell
                        fromConfig
                        requestsApproverManager={stockEntriesDispatcherManager}
                        setRequestsApproverManager={
                          setStockEntriesDispatcherManager
                        }
                        field={{ dynamicData: "managers", required: false }}
                      />
                    </Grid>
                  </Grid>
                  <Grid item sx={{ my: 1.5 }}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-between"
                      sx={{ px: 4 }}
                    >
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
                        <Typography sx={{ my: "auto", mr: 1 }}>
                          Entradas de Estoque Aprovadas podem ser Contestadas
                        </Typography>
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
