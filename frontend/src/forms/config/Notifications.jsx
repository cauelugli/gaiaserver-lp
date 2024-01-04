/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

import {
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

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function Notifications({ onClose }) {
  const [configData, setConfigData] = React.useState([]);
  const [passwordComplexity, setPasswordComplexity] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        setConfigData(config.data[0].notifications);
        // setPasswordComplexity(config.data[0].security.passwordComplexity);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChangeNotificationConfig = async (e) => {
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
    <form onSubmit={handleChangeNotificationConfig}>
      <DialogTitle>Configurações de Notificações</DialogTitle>
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
              <Grid item sx={{ my: 1.5 }}>
                <Grid container direction="row">
                  <Typography sx={{ my: "auto", mr: 2 }}>
                    Notificar quando Novo Usuário for criado
                  </Typography>
                  <RadioGroup
                    row
                    value={passwordComplexity}
                    onChange={(e) => setPasswordComplexity(e.target.value)}
                  >
                    <FormControlLabel
                      value={Boolean(true)}
                      control={
                        <Radio size="small" sx={{ mt: -0.25, mr: -0.5 }} />
                      }
                      label={<Typography sx={{ fontSize: 13 }}>Sim</Typography>}
                    />
                    <FormControlLabel
                      value={Boolean(false)}
                      control={
                        <Radio size="small" sx={{ mt: -0.25, mr: -0.5 }} />
                      }
                      label={<Typography sx={{ fontSize: 13 }}>Não</Typography>}
                    />

                    <Typography sx={{ my:"auto", fontSize: 13 }}>Lista de Notificados:</Typography>
                  </RadioGroup>
                </Grid>
              </Grid>
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
