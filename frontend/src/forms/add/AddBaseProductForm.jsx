/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { io } from "socket.io-client";
import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Grid2,
  ListItemIcon,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  InputLabel,
} from "@mui/material";
import { icons } from "../../icons";
import DialogHeader from "../../components/small/DialogHeader";

const socket = io("http://localhost:5002");
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function AddBaseProductForm({
  onClose,
  refreshData,
  setRefreshData,
  toast,
  userId,
}) {
  const [type, setType] = React.useState("");
  const [fields, setFields] = React.useState([]);
  const [newFieldName, setNewFieldName] = React.useState("");
  const [newFieldType, setNewFieldType] = React.useState("a");
  const [newStringOptionMinCharacter, setNewStringOptionMinCharacter] =
    React.useState(1);
  const [newStringOptionMaxCharacter, setNewStringOptionMaxCharacter] =
    React.useState(200);
  const [newNumberOptionType, setNewNumberOptionType] =
    React.useState("integer");
  const [newNumberOptionMinValue, setNewNumberOptionMinValue] =
    React.useState(0);
  const [newNumberOptionMaxValue, setNewNumberOptionMaxValue] =
    React.useState(1);
  const [newOptions, setNewOptions] = React.useState([]);
  const [newOptionItem, setNewOptionItem] = React.useState("");
  const [newOptionAllowMultiple, setNewOptionAllowMultiple] =
    React.useState(false);
  const [newDateType, setNewDateType] = React.useState("simple");
  const [newDateValue, setNewDateValue] = React.useState(1);
  const [newDatePeriod, setNewDatePeriod] = React.useState("day");

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const productResponse = await api.post("/products", {
        type,
        fields,
      });

      if (productResponse.data) {
        toast.success("Produto Adicionado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        socket.emit("newDataRefreshButton", {
          page: "stock",
          userId: userId,
        });
      }
      onClose();
      setRefreshData(!refreshData);
    } catch (err) {
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
      console.log(err);
    }
  };

  const handleAddField = () => {
    const newField = {
      index: fields.length,
      name: newFieldName,
      type: newFieldType,
    };

    if (newFieldType === "string") {
      newField.minCharacter = newStringOptionMinCharacter;
      newField.maxCharacter = newStringOptionMaxCharacter;
    } else if (newFieldType === "number") {
      newField.numberType = newNumberOptionType;
      newField.minValue = newNumberOptionMinValue;
      newField.maxValue = newNumberOptionMaxValue;
    } else if (newFieldType === "options") {
      newField.options = newOptions;
      newField.allowMultiple = newOptionAllowMultiple;
    } else if (newFieldType === "date") {
      newField.dateType = newDateType;
      newField.dateValue = newDateValue;
      newField.datePeriod = newDatePeriod;
    }

    setFields([...fields, newField]);
    resetFieldForm();
  };

  const resetFieldForm = () => {
    setNewFieldName("");
    setNewFieldType("a");
    setNewStringOptionMinCharacter(1);
    setNewStringOptionMaxCharacter(200);
    setNewNumberOptionType("integer");
    setNewNumberOptionMinValue(0);
    setNewNumberOptionMaxValue(1);
    setNewOptions([]);
    setNewOptionItem("");
    setNewOptionAllowMultiple(false);
    setNewDateType("simple");
    setNewDateValue(1);
    setNewDatePeriod("day");
  };

  const handleAddOptionItem = () => {
    if (newOptionItem.trim()) {
      setNewOptions([...newOptions, newOptionItem.trim()]);
      setNewOptionItem("");
    }
  };

  const removeOptionItem = (index) => {
    setNewOptions(newOptions.filter((_, i) => i !== index));
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleAdd}>
      <DialogHeader title="Produto" femaleGender={false} extraSmall />
      <DialogContent>
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Campo</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Valor</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Header */}
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Tipo do Produto
                </TableCell>
                <TableCell sx={{ width: "80%", pr: 10 }}>
                  <TextField
                    size="small"
                    value={type}
                    required
                    fullWidth
                    onChange={(e) => setType(e.target.value)}
                  />
                </TableCell>
                <TableCell id="ghost" />
              </TableRow>

              {/* Campos existentes */}
              {fields.map((field, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {field.name}
                  </TableCell>
                  <TableCell>
                    {field.type === "string" && (
                      <Typography variant="body2">
                        Texto ({field.minCharacter}-{field.maxCharacter} chars)
                      </Typography>
                    )}
                    {field.type === "number" && (
                      <Typography variant="body2">
                        Número {field.numberType} ({field.minValue}-
                        {field.maxValue})
                      </Typography>
                    )}
                    {field.type === "options" && (
                      <Typography variant="body2">
                        Lista {field.allowMultiple && "(Múltipla)"} -{" "}
                        {field.options.length} itens
                      </Typography>
                    )}
                    {field.type === "date" && (
                      <Typography variant="body2">
                        Data{" "}
                        {field.dateType === "range"
                          ? `período (${field.dateValue} ${field.datePeriod})`
                          : "simples"}
                      </Typography>
                    )}
                    {field.type === "currency" && (
                      <Typography variant="body2">Moeda (R$)</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => removeField(index)}
                      startIcon={<icons.DeleteIcon />}
                    >
                      Remover
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid2
          container
          direction="row"
          sx={{ m: 2 }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid2 item>
            <Typography>Novo Campo</Typography>
          </Grid2>

          <Grid2 item>
            <InputLabel>Tipo de Campo</InputLabel>
            <Select
              value={newFieldType}
              onChange={(e) => setNewFieldType(e.target.value)}
              size="small"
              displayEmpty
              sx={{ width: 200 }}
              renderValue={(selected) => {
                switch (selected) {
                  case "string":
                    return "Texto";
                  case "number":
                    return "Número";
                  case "currency":
                    return "Moeda";
                  case "options":
                    return "Lista";
                  case "date":
                    return "Data";
                  default:
                    return "Tipo do Campo";
                }
              }}
            >
              <MenuItem disabled value="a">
                <Typography>Tipo do Campo</Typography>
              </MenuItem>
              <MenuItem value="string">
                <ListItemIcon>
                  <icons.AbcIcon />
                </ListItemIcon>
                Texto
              </MenuItem>
              <MenuItem value="number">
                <ListItemIcon>
                  <icons.NumbersIcon />
                </ListItemIcon>
                Número
              </MenuItem>
              <MenuItem value="currency">
                <ListItemIcon>
                  <icons.AttachMoneyIcon />
                </ListItemIcon>
                Moeda
              </MenuItem>
              <MenuItem value="options">
                <ListItemIcon>
                  <icons.ListIcon />
                </ListItemIcon>
                Lista
              </MenuItem>
              <MenuItem value="date">
                <ListItemIcon>
                  <icons.CalendarMonthIcon />
                </ListItemIcon>
                Data
              </MenuItem>
            </Select>
          </Grid2>

          <Grid2 item>
            <InputLabel>Nome do Campo</InputLabel>
            <TextField
              sx={{ width: 500 }}
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              size="small"
            />
          </Grid2>

          <Grid2 item sx={{ mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleAddField}
              disabled={!newFieldName || newFieldType === "a"}
            >
              Adicionar Campo
            </Button>
          </Grid2>

          <Grid2 item sx={{ m: 2, width: "85%", mx: "auto" }}>
            {newFieldType === "string" && (
              <Grid2 item>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  Configurações de Texto
                </Typography>
                <Grid2 container direction="row" justifyContent="space-evenly">
                  <Grid2 item>
                    <TextField
                      label="Mínimo de caracteres"
                      type="number"
                      value={newStringOptionMinCharacter}
                      onChange={(e) =>
                        setNewStringOptionMinCharacter(e.target.value)
                      }
                      size="small"
                    />
                  </Grid2>
                  <Grid2 item>
                    <TextField
                      label="Máximo de caracteres"
                      type="number"
                      value={newStringOptionMaxCharacter}
                      onChange={(e) =>
                        setNewStringOptionMaxCharacter(e.target.value)
                      }
                      size="small"
                    />
                  </Grid2>
                </Grid2>
              </Grid2>
            )}

            {newFieldType === "number" && (
              <Grid2 item>
                <Typography sx={{ mt: 2 }}>Configurações de Número</Typography>
                <Grid2
                  container
                  direction="row"
                  justifyContent="space-evenly"
                  sx={{ mb: 1 }}
                >
                  <RadioGroup
                    row
                    value={newNumberOptionType}
                    onChange={(e) => setNewNumberOptionType(e.target.value)}
                  >
                    <FormControlLabel
                      value="integer"
                      control={<Radio size="small" />}
                      label="Inteiro"
                    />
                    <FormControlLabel
                      value="float"
                      control={<Radio size="small" />}
                      label="Decimal"
                    />
                  </RadioGroup>
                </Grid2>
                <Grid2 container direction="row" justifyContent="space-evenly">
                  <Grid2 item>
                    <TextField
                      label="Valor mínimo"
                      type="number"
                      value={newNumberOptionMinValue}
                      onChange={(e) =>
                        setNewNumberOptionMinValue(e.target.value)
                      }
                      size="small"
                    />
                  </Grid2>
                  <Grid2 item>
                    <TextField
                      label="Valor máximo"
                      type="number"
                      value={newNumberOptionMaxValue}
                      onChange={(e) =>
                        setNewNumberOptionMaxValue(e.target.value)
                      }
                      size="small"
                    />
                  </Grid2>
                </Grid2>
              </Grid2>
            )}

            {newFieldType === "options" && (
              <Grid2 item>
                <Grid2
                  container
                  direction="row"
                  alignItems="center"
                  sx={{ my: 1 }}
                >
                  <Typography sx={{ m: 1 }}>Configurações da Lista</Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newOptionAllowMultiple}
                        onChange={(e) =>
                          setNewOptionAllowMultiple(e.target.checked)
                        }
                        size="small"
                      />
                    }
                    label="Permitir seleção múltipla"
                  />
                </Grid2>
                <Grid2 container direction="row" justifyContent="space-evenly">
                  <Grid2 item>
                    <TextField
                      label="Novo Item para Lista"
                      value={newOptionItem}
                      onChange={(e) => setNewOptionItem(e.target.value)}
                      size="small"
                      sx={{ width: 470 }}
                    />
                  </Grid2>
                  <Grid2 item>
                    <Button
                      variant="outlined"
                      onClick={handleAddOptionItem}
                      disabled={!newOptionItem.trim()}
                    >
                      + Item
                    </Button>
                  </Grid2>
                </Grid2>
                {newOptions.length > 0 && (
                  <Grid2 container direction="column" alignItems="center">
                    <Grid2 item>
                      <Typography sx={{ mt: 2, mb: 1 }}>
                        Itens da Lista
                      </Typography>
                    </Grid2>
                    <Grid2 item>
                      <Grid2
                        container
                        direction="column"
                        alignItems="center"
                        justifyContent="space-around"
                      >
                        {newOptions.map((option, index) => (
                          <Grid2
                            key={index}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              m: 1,
                            }}
                          >
                            <Typography sx={{ width: 250 }}>
                              {option}
                            </Typography>
                            <icons.DeleteIcon
                              fontSize="small"
                              color="error"
                              sx={{ cursor: "pointer" }}
                              onClick={() => removeOptionItem(index)}
                            />
                          </Grid2>
                        ))}
                      </Grid2>
                    </Grid2>
                  </Grid2>
                )}
              </Grid2>
            )}

            {newFieldType === "date" && (
              <Grid2 item>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  Configurações de Data
                </Typography>
                <Grid2
                  container
                  direction="row"
                  justifyContent="space-evenly"
                  sx={{ mb: 1 }}
                >
                  <RadioGroup
                    row
                    value={newDateType}
                    onChange={(e) => setNewDateType(e.target.value)}
                  >
                    <FormControlLabel
                      value="simple"
                      control={<Radio size="small" />}
                      label="Data simples"
                    />
                    <FormControlLabel
                      value="range"
                      control={<Radio size="small" />}
                      label="Período"
                    />
                  </RadioGroup>
                </Grid2>
                {newDateType === "range" && (
                  <Grid2
                    container
                    direction="row"
                    justifyContent="center"
                    sx={{ mt: 2 }}
                    spacing={2}
                  >
                    <Grid2 item>
                      <TextField
                        label="Quantidade"
                        type="number"
                        value={newDateValue}
                        onChange={(e) => setNewDateValue(e.target.value)}
                        size="small"
                      />
                    </Grid2>
                    <Grid2 item>
                      <Select
                        value={newDatePeriod}
                        onChange={(e) => setNewDatePeriod(e.target.value)}
                        size="small"
                        sx={{ width: 120 }}
                      >
                        <MenuItem value="day">Dias</MenuItem>
                        <MenuItem value="week">Semanas</MenuItem>
                        <MenuItem value="month">Meses</MenuItem>
                        <MenuItem value="year">Anos</MenuItem>
                      </Select>
                    </Grid2>
                  </Grid2>
                )}
              </Grid2>
            )}
          </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" color="success">
          Salvar Produto
        </Button>
        <Button variant="contained" color="error" onClick={onClose}>
          Cancelar
        </Button>
      </DialogActions>
    </form>
  );
}
