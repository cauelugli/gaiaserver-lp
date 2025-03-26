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
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import { icons } from "../../icons";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function Services({ onClose }) {
  const [configData, setConfigData] = React.useState([]);
  const [serviceTypes, setServiceTypes] = React.useState(null);
  const [newType, setNewType] = React.useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        setConfigData(config.data.services);
        setServiceTypes(config.data.services.serviceTypes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChangeServicesConfig = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/config/services", {
        serviceTypes: serviceTypes,
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

  const handleAddType = () => {
    if (newType && !serviceTypes.includes(newType)) {
      setServiceTypes([...serviceTypes, newType]);
      setNewType("");
    }
  };

  const handleRemoveType = (type) => {
    setServiceTypes(serviceTypes.filter((t) => t !== type));
  };

  return (
    <form onSubmit={handleChangeServicesConfig}>
      <DialogTitle
        sx={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
      >
        Configurações de Serviços
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
                    Tipos de Serviço
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List sx={{ mx: "30%" }}>
                    {serviceTypes.map((type, index) => (
                      <ListItem key={index} sx={{ pl: 0 }}>
                        <ListItemText primary={type} />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleRemoveType(type)}
                          >
                            <icons.DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                  <Grid2
                    container
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Grid2 item>
                      <TextField
                        variant="outlined"
                        label="Adicionar novo tipo"
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                      />
                    </Grid2>
                    <Grid2 item>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddType}
                        sx={{ ml: 1 }}
                      >
                        Adicionar
                      </Button>
                    </Grid2>
                  </Grid2>
                </AccordionDetails>
              </Accordion>
              <Accordion sx={{ width: "100%", mt: 2 }}>
                <AccordionSummary expandIcon={<icons.ArrowDropDownIcon />}>
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    Permissões
                  </Typography>
                </AccordionSummary>
                <AccordionDetails></AccordionDetails>
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
