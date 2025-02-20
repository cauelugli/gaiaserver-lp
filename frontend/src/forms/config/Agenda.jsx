/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});
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
  FormHelperText,
  Grid2,
  IconButton,
  List,
  ListItem,
  Paper,
  Popover,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";

import { icons } from "../../icons";

import { SketchPicker } from "react-color";

export default function Agenda({ onClose }) {
  const [configData, setConfigData] = React.useState([]);
  const [minTime, setMinTime] = React.useState(null);
  const [maxTime, setMaxTime] = React.useState(null);
  const [showServiceColorOnEvents, setShowServiceColorOnEvents] =
    React.useState(null);
  const [eventTypes, setEventTypes] = React.useState([]);
  const [newType, setNewType] = React.useState({ name: "", color: "white" });
  const [newJobEventTypeColor, setNewJobEventTypeColor] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        setConfigData(config.data[0].agenda);
        setMinTime(config.data[0].agenda.minTime);
        setMaxTime(config.data[0].agenda.maxTime);
        setEventTypes(config.data[0].agenda.eventTypes);
        setShowServiceColorOnEvents(
          config.data[0].agenda.showServiceColorOnEvents
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChangeAgendaConfig = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/config/agenda", {
        minTime,
        maxTime,
        eventTypes,
        newJobEventTypeColor,
        showServiceColorOnEvents,
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
    if (newType.name && !eventTypes.includes(newType.name)) {
      setEventTypes([...eventTypes, newType]);
      setNewType({ name: "", color: "white" });
    }
  };

  const handleRemoveType = (type) => {
    setEventTypes(eventTypes.filter((t) => t !== type));
  };

  return (
    <form onSubmit={handleChangeAgendaConfig}>
      <DialogTitle
        sx={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
      >
        Configurações da Agenda
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
                    Preferências
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid2 container direction="row">
                    <Typography sx={{ my: "auto", mr: 1 }}>
                      Utilizar cor do Serviço para Jobs na Agenda
                    </Typography>
                    <RadioGroup
                      row
                      value={showServiceColorOnEvents}
                      onChange={(e) =>
                        setShowServiceColorOnEvents(e.target.value)
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
                          <Typography sx={{ fontSize: 13 }}>
                            Não, utilizar cor padrão do tipo de evento "Job"
                          </Typography>
                        }
                      />
                    </RadioGroup>
                  </Grid2>{" "}
                </AccordionDetails>
              </Accordion>
              <Accordion sx={{ width: "100%", mt: 2 }}>
                <AccordionSummary expandIcon={<icons.ArrowDropDownIcon />}>
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    Horário da Agenda
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid2 container direction="row">
                    <Typography sx={{ my: "auto", mr: 1 }}>Das</Typography>

                    <TextField
                      type="number"
                      size="small"
                      value={minTime}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (inputValue >= 0) {
                          setMinTime(inputValue);
                        }
                      }}
                      required
                      variant="outlined"
                      sx={{ width: 80, mr: 1 }}
                    />
                    <Typography sx={{ my: "auto", mr: 1 }}>às</Typography>

                    <TextField
                      type="number"
                      size="small"
                      value={maxTime}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (inputValue >= minTime + 1) {
                          setMaxTime(inputValue);
                        }
                      }}
                      required
                      variant="outlined"
                      sx={{ width: 80 }}
                    />
                  </Grid2>
                </AccordionDetails>
              </Accordion>
              <Accordion sx={{ width: "100%", mt: 2 }}>
                <AccordionSummary expandIcon={<icons.ArrowDropDownIcon />}>
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    Tipos de Eventos
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid2
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <List>
                      {eventTypes.map((type, index) => (
                        <ListItem key={index} sx={{ pl: 0 }}>
                          <Grid2
                            container
                            direction="row"
                            alignItems="center"
                            justifyContent="flex-start"
                          >
                            <Paper
                              elevation={0}
                              sx={{
                                mr: 1.5,
                                width: 15,
                                height: 15,
                                borderRadius: 50,
                                backgroundColor: type.color || "lightgrey",
                              }}
                            />
                            <Typography
                              sx={{
                                width: 180,
                                color: type.name === "Job" && "grey",
                              }}
                            >
                              {type.name || type}
                            </Typography>
                            {type.name === "Job" ? (
                              <>
                                <IconButton
                                  edge="end"
                                  onClick={(e) => setAnchorEl2(e.currentTarget)}
                                >
                                  <icons.PaletteIcon />
                                </IconButton>
                                {newJobEventTypeColor && (
                                  <>
                                    <Paper
                                      sx={{
                                        ml: 2,
                                        width: 20,
                                        height: 20,
                                        backgroundColor: newJobEventTypeColor,
                                        borderRadius: 50,
                                      }}
                                    />
                                    <FormHelperText
                                      sx={{
                                        fontSize: 10,
                                        ml: 1,
                                        color: "grey",
                                      }}
                                    >
                                      Nova cor de Job
                                    </FormHelperText>
                                    <IconButton
                                      sx={{ color: "red", fontSize: 12 }}
                                      onClick={() =>
                                        setNewJobEventTypeColor(null)
                                      }
                                    >
                                      X
                                    </IconButton>
                                  </>
                                )}
                                <Popover
                                  open={Boolean(anchorEl2)}
                                  anchorEl={anchorEl2}
                                  onClose={() => setAnchorEl2(null)}
                                  anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "center",
                                  }}
                                  transformOrigin={{
                                    vertical: "top",
                                    horizontal: "center",
                                  }}
                                >
                                  <SketchPicker
                                    color={newJobEventTypeColor || "white"}
                                    onChange={(color) =>
                                      setNewJobEventTypeColor(color.hex)
                                    }
                                    disableAlpha
                                  />
                                </Popover>
                              </>
                            ) : (
                              <IconButton
                                edge="end"
                                onClick={() => handleRemoveType(type)}
                              >
                                <icons.DeleteIcon />
                              </IconButton>
                            )}
                          </Grid2>
                        </ListItem>
                      ))}
                    </List>
                  </Grid2>
                  <Grid2
                    container
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    sx={{ my: 3 }}
                  >
                    <Grid2 item>
                      <TextField
                        variant="outlined"
                        label="Novo tipo"
                        value={newType.name}
                        onChange={(e) =>
                          setNewType({
                            name: e.target.value,
                            color: newType.color,
                          })
                        }
                        sx={{ width: 200 }}
                      />
                    </Grid2>
                    <IconButton
                      edge="start"
                      sx={{ ml: 2 }}
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                    >
                      <icons.ColorLensIcon sx={{ fontSize: 28 }} />
                    </IconButton>
                    <Popover
                      open={Boolean(anchorEl)}
                      anchorEl={anchorEl}
                      onClose={() => setAnchorEl(null)}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                    >
                      <SketchPicker
                        color={newType.color || "white"}
                        onChange={(color) =>
                          setNewType({ name: newType.name, color: color.hex })
                        }
                        disableAlpha
                      />
                    </Popover>
                    <Paper
                      sx={{
                        m: 1,
                        width: 28,
                        height: 28,
                        backgroundColor: newType.color,
                        borderRadius: 50,
                      }}
                    />
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
