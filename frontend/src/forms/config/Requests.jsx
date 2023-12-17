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
  Typography,
} from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function Requests({ test, onClose }) {
  const [configData, setConfigData] = React.useState([]);
  const [requestsNeedApproval, setRequestsNeedApproval] = React.useState(null);
  const [
    requestsCanBeDeletedBySomeoneElse,
    setRequestsCanBeDeletedBySomeoneElse,
  ] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        setConfigData(config.data[0].requests);
        setRequestsNeedApproval(config.data[0].requests.requestsNeedApproval);
        setRequestsCanBeDeletedBySomeoneElse(
          config.data[0].requests.canDeleteSomeoneElsesRequest
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
        requestsNeedApproval,
        requestsCanBeDeletedBySomeoneElse,
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
    <form onSubmit={handleChangeRequestConfig}>
      <DialogTitle>Alterando Configurações de Pedidos</DialogTitle>
      {configData.length !== 0 && (
        <>
          <DialogContent>
            <Grid
              container
              sx={{ mt: 2 }}
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item sx={{ mb: 2 }}>
                <Typography>
                  Pedidos Precisam de Aprovação do Gerente
                </Typography>
                <RadioGroup
                  row
                  value={requestsNeedApproval}
                  onChange={(e) => setRequestsNeedApproval(e.target.value)}
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
                </RadioGroup>
              </Grid>
              <Grid item sx={{ mb: 2 }}>
                <Typography>
                  Pedidos Podem ser Deletados por Não Criadores
                </Typography>
                <RadioGroup
                  row
                  value={requestsCanBeDeletedBySomeoneElse}
                  onChange={(e) =>
                    setRequestsCanBeDeletedBySomeoneElse(e.target.value)
                  }
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
                </RadioGroup>
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
