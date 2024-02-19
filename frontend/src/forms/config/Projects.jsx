/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

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

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DeleteIcon from "@mui/icons-material/Delete";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function Projects({ onClose }) {
  const [configData, setConfigData] = React.useState([]);
  const [canBeDeleted, setCanBeDeleted] = React.useState(null);
  const [notifyWhenProjectIsCreated, setNotifyWhenProjectIsCreated] =
    React.useState(null);
  const [projectTypes, setProjectTypes] = React.useState([]);
  const [newType, setNewType] = React.useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        setConfigData(config.data[0].projects);
        setCanBeDeleted(config.data[0].projects.canBeDeleted);
        setProjectTypes(config.data[0].projects.projectTypes);
        setNotifyWhenProjectIsCreated(
          config.data[0].projects.notifyWhenProjectIsCreated
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
      const res = await api.put("/config/projects", {
        canBeDeleted,
        projectTypes,
        notifyWhenProjectIsCreated,
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

  const handleAddType = () => {
    if (newType && !projectTypes.includes(newType)) {
      setProjectTypes([...projectTypes, newType]);
      setNewType("");
    }
  };

  const handleRemoveType = (type) => {
    setProjectTypes(projectTypes.filter((t) => t !== type));
  };

  return (
    <form onSubmit={handleChangeRequestConfig}>
      <DialogTitle
        sx={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
      >
        Configurações de Projetos
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
                  <Grid container direction="row">
                    <Typography sx={{ my: "auto", mr: 1 }}>
                      Projetos Podem ser Deletados
                    </Typography>
                    <Tooltip
                      title={
                        <Typography sx={{ fontSize: 12 }}>
                          Se a opção marcada for "Sim", os Projetos poderão ser
                          deletados DEFINITIVAMENTE. A opção padrão é "Não".
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
                      value={canBeDeleted}
                      onChange={(e) => setCanBeDeleted(e.target.value)}
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
              <Accordion sx={{ width: "100%", mt: 2 }}>
                <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    Tipos de Projeto
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List sx={{ mx: "30%" }}>
                    {projectTypes.map((type, index) => (
                      <ListItem key={index} sx={{ pl: 0 }}>
                        <ListItemText primary={type} />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleRemoveType(type)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Grid item>
                      <TextField
                        variant="outlined"
                        label="Adicionar novo tipo"
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddType}
                        sx={{ ml: 1 }}
                      >
                        Adicionar
                      </Button>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              <Accordion sx={{ width: "100%", mt: 2 }}>
                <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    Notificações
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {" "}
                  <AccordionDetails>
                    <Grid container direction="row">
                      <Typography sx={{ my: "auto", mr: 1 }}>
                        Notificar Membros ao Criar Projeto
                      </Typography>
                      <Tooltip
                        title={
                          <Typography sx={{ fontSize: 12 }}>
                            Se a opção marcada for "Sim", os Membros de Novos
                            Projetos serão notificados quando um novo projeto
                            for criado. A opção padrão é "Sim".
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
                        value={notifyWhenProjectIsCreated}
                        onChange={(e) => setNotifyWhenProjectIsCreated(e.target.value)}
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
