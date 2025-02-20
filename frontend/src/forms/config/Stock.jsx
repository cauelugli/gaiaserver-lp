/* eslint-disable react-hooks/exhaustive-deps */
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
  Grid2,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
} from "@mui/material";

import { icons } from "../../icons";
import ManagerSelectTableCell from "../../components/tableCells/ManagerSelectTableCell";
import AlternateManagerSelectTableCell from "../../components/tableCells/AlternateManagerSelectTableCell";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function Stock({ onClose }) {
  const [configData, setConfigData] = React.useState([]);
  const [stockEntriesApproverManager, setStockEntriesApproverManager] =
    React.useState(null);
  const [stockEntriesApproverAlternate, setStockEntriesApproverAlternate] =
    React.useState(null);
  const [stockEntriesNeedApproval, setStockEntriesNeedApproval] =
    React.useState(null);
  const [stockEntriesCanBeChallenged, setStockEntriesCanBeChallenged] =
    React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        const configData = config.data[0].stock;

        setConfigData(configData);
        const usersResponse = await api.get("/get", {
          params: { model: "User" },
        });
        const managersData = usersResponse.data.filter(
          (user) => user.isManager
        );
        const approverManager = managersData.find(
          (manager) => manager._id === configData.stockEntriesApproverManager
        );
        const approverManagerAlternate = usersResponse.data.find(
          (user) => user._id === configData.stockEntriesApproverAlternate
        );
        setStockEntriesNeedApproval(configData.stockEntriesNeedApproval);
        setStockEntriesCanBeChallenged(configData.stockEntriesCanBeChallenged);
        setStockEntriesApproverManager(approverManager || null);
        setStockEntriesApproverAlternate(approverManagerAlternate || null);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [configData.stockEntriesApproverAlternate]);

  const handleChangeStockConfig = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/config/stock", {
        prevData: configData,
        stockEntriesApproverManager: stockEntriesApproverManager
          ? stockEntriesApproverManager._id
          : "",
        stockEntriesApproverAlternate: stockEntriesApproverAlternate
          ? stockEntriesApproverAlternate._id
          : "none",
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
                <AccordionDetails>
                  <Grid2 item sx={{ my: 1.5 }}>
                    <Grid2
                      container
                      direction="row"
                      justifyContent="space-between"
                      sx={{ px: 4 }}
                    >
                      <Tooltip
                        title={
                          <Typography sx={{ fontSize: 12, color: "white" }}>
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
                    </Grid2>
                  </Grid2>
                  <Grid2 item sx={{ my: 1.5 }}>
                    <Grid2
                      container
                      direction="row"
                      justifyContent="space-between"
                      sx={{ px: 4 }}
                    >
                      <Tooltip
                        title={
                          <Typography sx={{ fontSize: 12, color: "white" }}>
                            Selecione o Gerente que será responsável pela
                            Aprovação das Entradas de Estoque solicitadas. Este
                            Gerente será notificado também para novas
                            Solicitações de Compras de Produtos.
                          </Typography>
                        }
                      >
                        <Typography sx={{ my: "auto" }}>
                          Gerente Aprovador
                        </Typography>
                      </Tooltip>
                      <ManagerSelectTableCell
                        fromConfig
                        stockEntriesApproverManager={
                          stockEntriesApproverManager
                        }
                        setStockEntriesApproverManager={
                          setStockEntriesApproverManager
                        }
                        field={""}
                        fields={""}
                        type="stock"
                      />
                    </Grid2>
                  </Grid2>
                  <Grid2 item sx={{ my: 1.5 }}>
                    <Grid2
                      container
                      direction="row"
                      justifyContent="space-between"
                      sx={{ px: 4 }}
                    >
                      <Tooltip
                        title={
                          <Typography sx={{ fontSize: 12, color: "white" }}>
                            Selecione um Colaborador que também poderá Aprovar
                            as Entradas de Estoque além do Gerente. Por padrão a
                            opção é "Nenhum".
                          </Typography>
                        }
                      >
                        <Typography sx={{ my: "auto" }}>Suplente</Typography>
                      </Tooltip>
                      <AlternateManagerSelectTableCell
                        type="stock"
                        fromConfig
                        setStockEntriesApproverAlternate={
                          setStockEntriesApproverAlternate
                        }
                        stockEntriesApproverAlternate={
                          stockEntriesApproverAlternate
                        }
                        approverManager={stockEntriesApproverManager}
                        field={{ dynamicData: "users", required: false }}
                      />
                    </Grid2>
                  </Grid2>
                  <Grid2 item sx={{ my: 1.5 }}>
                    <Grid2
                      container
                      direction="row"
                      justifyContent="space-between"
                      sx={{ px: 4 }}
                    >
                      <Tooltip
                        title={
                          <Typography sx={{ fontSize: 12, color: "white" }}>
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
