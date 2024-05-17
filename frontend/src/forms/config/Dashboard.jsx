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
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function Dashboard({ onClose }) {
  const [configData, setConfigData] = React.useState([]);
  const [showAgenda, setShowAgenda] = React.useState(null);
  const [showHelloIsActive, setShowHelloIsActive] = React.useState(null);
  const [showHelloInitialText, setShowHelloInitialText] = React.useState(null);
  const [showHelloFinalText, setShowHelloFinalText] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        setConfigData(config.data[0].dashboard);
        setShowAgenda(config.data[0].dashboard.showAgenda);
        setShowHelloIsActive(config.data[0].dashboard.showHello.isActive);
        setShowHelloInitialText(
          config.data[0].dashboard.showHello.helloInitialText
        );
        setShowHelloFinalText(
          config.data[0].dashboard.showHello.helloFinalText
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChangeDashboardConfig = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/config/dashboard", {
        showAgenda,
        showHello: {
          isActive: showHelloIsActive,
          helloInitialText: showHelloInitialText,
          helloFinalText: showHelloFinalText,
        },
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
    <form onSubmit={handleChangeDashboardConfig}>
      <DialogTitle
        sx={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
      >
        Configurações da Dashboard
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
                    Preferências
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container direction="row">
                    <Typography sx={{ my: "auto", mr: 2 }}>
                      Mostrar Agenda
                    </Typography>
                    <RadioGroup
                      row
                      value={showAgenda}
                      onChange={(e) => setShowAgenda(e.target.value)}
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
                  <Grid container direction="row" sx={{ mt: 2 }}>
                    <Typography sx={{ my: "auto", mr: 2 }}>
                      Mostrar Saudação Inicial
                    </Typography>
                    <RadioGroup
                      row
                      value={showHelloIsActive}
                      onChange={(e) => setShowHelloIsActive(e.target.value)}
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
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                      sx={{ my: 2 }}
                    >
                      <Grid item>
                        <Select
                          size="small"
                          sx={{ width: 150 }}
                          value={showHelloInitialText}
                          onChange={(e) => setShowHelloInitialText(e.target.value)}
                        >
                          <MenuItem value={"hello"}>Olá</MenuItem>
                          <MenuItem value={"welcome"}>Bem vindo (a)</MenuItem>
                          <MenuItem value={"formal"}>Bom dia</MenuItem>
                        </Select>
                      </Grid>
                      <Typography sx={{ mx: 2 }}>
                        nome do colaborador.
                      </Typography>
                      <TextField
                        sx={{ width: 250 }}
                        size="small"
                        label="mensagem extra (opcional)"
                        variant="outlined"
                        value={showHelloFinalText}
                        onChange={(e) => setShowHelloFinalText(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              {/* <Accordion sx={{ width: "100%", mt: 2 }}> */}
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
