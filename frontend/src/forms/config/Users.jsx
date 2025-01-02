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

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function Users({ onClose }) {
  const [configData, setConfigData] = React.useState([]);
  const [usersCanBeDeleted, setUsersCanBeDeleted] = React.useState(null);
  const [managersCanBeDeleted, setManagersCanBeDeleted] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        setConfigData(config.data[0].users);
        setUsersCanBeDeleted(config.data[0].users.usersCanBeDeleted);
        setManagersCanBeDeleted(config.data[0].users.managersCanBeDeleted);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChangeRequestConfig = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/config/users", {
        usersCanBeDeleted,
        managersCanBeDeleted,
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
        Configurações de Colaboradores
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
                            Se a opção marcada for "Sim", os Colaboradores criados
                            poderão ser deletados pelos colaboradores. A opção
                            padrão é "Sim".
                          </Typography>
                        }
                      >
                        <Typography sx={{ my: "auto", mr: 1 }}>
                          Colaboradores Podem ser Deletados
                        </Typography>
                      </Tooltip>
                      <RadioGroup
                        row
                        value={usersCanBeDeleted}
                        onChange={(e) =>
                          setUsersCanBeDeleted(e.target.value)
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
                            Se a opção marcada for "Sim", os Gerentes criados
                            poderão ser deletados pelos colaboradores. A opção
                            padrão é "Sim".
                          </Typography>
                        }
                      >
                        <Typography sx={{ my: "auto", mr: 1 }}>
                          Gerentes Podem ser Deletados
                        </Typography>
                      </Tooltip>
                      <RadioGroup
                        row
                        value={managersCanBeDeleted}
                        onChange={(e) =>
                          setManagersCanBeDeleted(e.target.value)
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
