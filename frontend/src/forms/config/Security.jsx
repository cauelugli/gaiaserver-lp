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
  Grid2,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
} from "@mui/material";

import { icons } from "../../icons";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function Security({ onClose }) {
  const [configData, setConfigData] = React.useState([]);
  const [passwordComplexity, setPasswordComplexity] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        setConfigData(config.data[0].security);
        setPasswordComplexity(config.data[0].security.passwordComplexity);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChangeSecurityConfig = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/config/security", {
        passwordComplexity,
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
    <form onSubmit={handleChangeSecurityConfig}>
      <DialogTitle
        sx={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
      >
        Configurações de Segurança
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
                    Parâmetros
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
                            Para a opção "Baixo", não há exigência de
                            complexidade, exemplo: "senha123". Para a opção
                            "Alto" é exigido no mínimo 10 caracteres, incluindo
                            letras maiúsculas, minúsculas, números e caracteres
                            especiais, exemplo: "SeNh@123#CjM". Para a opção
                            "Extremo" é exigido no mínimo 16 caracteres, com
                            combinação robusta de letras maiúsculas, minúsculas,
                            números, caracteres especiais, exemplo:
                            "J#rL$bm*9W!p2Qz". A opção padrão é "Baixo".
                          </Typography>
                        }
                      >
                        <Typography sx={{ my: "auto", mr: 1 }}>
                          Complexidade de Senha
                        </Typography>
                      </Tooltip>
                      <RadioGroup
                        row
                        value={passwordComplexity}
                        onChange={(e) => setPasswordComplexity(e.target.value)}
                      >
                        <FormControlLabel
                          value={"low"}
                          control={
                            <Radio size="small" sx={{ mt: -0.25, mr: -0.5 }} />
                          }
                          label={
                            <Typography sx={{ fontSize: 13 }}>Baixo</Typography>
                          }
                        />
                        <FormControlLabel
                          value={"high"}
                          control={
                            <Radio size="small" sx={{ mt: -0.25, mr: -0.5 }} />
                          }
                          label={
                            <Typography sx={{ fontSize: 13 }}>Alto</Typography>
                          }
                        />
                        <FormControlLabel
                          value={"extreme"}
                          control={
                            <Radio size="small" sx={{ mt: -0.25, mr: -0.5 }} />
                          }
                          label={
                            <Typography sx={{ fontSize: 13 }}>
                              Extremo
                            </Typography>
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
