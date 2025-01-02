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
  Typography,
} from "@mui/material";

import { icons } from "../../icons";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function Files({ onClose }) {
  const [configData, setConfigData] = React.useState([]);
  const [showAgenda, setShowAgenda] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        // change here
        setConfigData(config.data[0].dashboard);
        setShowAgenda(config.data[0].dashboard.showAgenda);
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
        Configurações de Arquivos
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
                    Preferências
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container direction="row">
                    <Typography sx={{ my: "auto", mr: 2 }}>
                      Something
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
