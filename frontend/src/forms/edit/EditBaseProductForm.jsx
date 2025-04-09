/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
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
  CircularProgress,
  Box,
} from "@mui/material";
import { icons } from "../../icons";
import DialogHeader from "../../components/small/DialogHeader";

const api = axios.create({
  baseURL: "/api",
});

export default function EditBaseProductForm({
  productId,
  userName,
  onClose,
  refreshData,
  setRefreshData,
  toast,
  userId,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [type, setType] = useState("");
  const [fields, setFields] = useState([]);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState("a");
  const [newStringOptionMinCharacter, setNewStringOptionMinCharacter] =
    useState(1);
  const [newStringOptionMaxCharacter, setNewStringOptionMaxCharacter] =
    useState(200);
  const [newNumberOptionType, setNewNumberOptionType] = useState("integer");
  const [newNumberOptionMinValue, setNewNumberOptionMinValue] = useState(0);
  const [newNumberOptionMaxValue, setNewNumberOptionMaxValue] = useState(1);
  const [newOptions, setNewOptions] = useState([]);
  const [newOptionItem, setNewOptionItem] = useState("");
  const [newOptionAllowMultiple, setNewOptionAllowMultiple] = useState(false);
  const [newDateType, setNewDateType] = useState("simple");
  const [newDateValue, setNewDateValue] = useState(1);
  const [newDatePeriod, setNewDatePeriod] = useState("day");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const resProducts = await api.get("/get", {
          params: { model: "Product" },
        });

        const product = resProducts.data.find((p) => p._id === productId);

        if (product) {
          setType(product.type);
          setFields(product.fields || []);
        } else {
          toast.error("Produto não encontrado", {
            closeOnClick: true,
            pauseOnHover: false,
            theme: "colored",
            autoClose: 1200,
          });
          onClose();
        }
      } catch (err) {
        toast.error("Erro ao carregar produto", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        console.error(err);
        onClose();
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/edit/baseProduct", {
        id: productId,
        type,
        fields,
        updatedBy: userName,
      });

      if (response.data) {
        toast.success("Produto atualizado com sucesso!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      onClose();
      setRefreshData(!refreshData);
    } catch (err) {
      toast.error("Erro ao atualizar produto", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
      console.error(err);
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

  const getFieldTypeLabel = (type) => {
    switch (type) {
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
  };

  const getFieldTypeIcon = (type) => {
    switch (type) {
      case "string":
        return <icons.AbcIcon fontSize="small" />;
      case "number":
        return <icons.NumbersIcon fontSize="small" />;
      case "currency":
        return <icons.AttachMoneyIcon fontSize="small" />;
      case "options":
        return <icons.ListIcon fontSize="small" />;
      case "date":
        return <icons.CalendarMonthIcon fontSize="small" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <form onSubmit={handleEdit}>
      <DialogHeader
        title={`Editar Produto: ${type}`}
        femaleGender={false}
        extraSmall
      />
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
                <TableCell></TableCell>
              </TableRow>

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
                        {field.options?.length || 0} itens
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

        <Box sx={{ p: 3, border: "1px solid #eee", borderRadius: 1, mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Adicionar Novo Campo
          </Typography>

          <Grid2 container spacing={2} alignItems="center">
            <Grid2 item xs={12} md={4}>
              <TextField
                label="Nome do Campo"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                size="small"
                fullWidth
              />
            </Grid2>

            <Grid2 item xs={12} md={4}>
              <InputLabel>Tipo de Campo</InputLabel>
              <Select
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value)}
                size="small"
                fullWidth
                // eslint-disable-next-line no-unused-vars
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {newFieldType !== "a" && getFieldTypeIcon(newFieldType)}
                    <Typography sx={{ ml: 1 }}>
                      {getFieldTypeLabel(newFieldType)}
                    </Typography>
                  </Box>
                )}
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

            <Grid2 item xs={12} md={4}>
              <Button
                variant="contained"
                onClick={handleAddField}
                disabled={!newFieldName || newFieldType === "a"}
                fullWidth
                sx={{ height: "40px" }}
              >
                Adicionar Campo
              </Button>
            </Grid2>
          </Grid2>

          {/* Configurações específicas por tipo de campo */}
          {newFieldType === "string" && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Configurações de Texto
              </Typography>
              <Grid2 container spacing={2}>
                <Grid2 item xs={6}>
                  <TextField
                    label="Mínimo de caracteres"
                    type="number"
                    value={newStringOptionMinCharacter}
                    onChange={(e) =>
                      setNewStringOptionMinCharacter(e.target.value)
                    }
                    size="small"
                    fullWidth
                  />
                </Grid2>
                <Grid2 item xs={6}>
                  <TextField
                    label="Máximo de caracteres"
                    type="number"
                    value={newStringOptionMaxCharacter}
                    onChange={(e) =>
                      setNewStringOptionMaxCharacter(e.target.value)
                    }
                    size="small"
                    fullWidth
                  />
                </Grid2>
              </Grid2>
            </Box>
          )}

          {newFieldType === "number" && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Configurações de Número
              </Typography>
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
              <Grid2 container spacing={2} sx={{ mt: 1 }}>
                <Grid2 item xs={6}>
                  <TextField
                    label="Valor mínimo"
                    type="number"
                    value={newNumberOptionMinValue}
                    onChange={(e) => setNewNumberOptionMinValue(e.target.value)}
                    size="small"
                    fullWidth
                  />
                </Grid2>
                <Grid2 item xs={6}>
                  <TextField
                    label="Valor máximo"
                    type="number"
                    value={newNumberOptionMaxValue}
                    onChange={(e) => setNewNumberOptionMaxValue(e.target.value)}
                    size="small"
                    fullWidth
                  />
                </Grid2>
              </Grid2>
            </Box>
          )}

          {newFieldType === "options" && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Configurações de Lista
              </Typography>
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
              <Grid2 container spacing={1} alignItems="center" sx={{ mt: 1 }}>
                <Grid2 item xs={9}>
                  <TextField
                    label="Novo item"
                    value={newOptionItem}
                    onChange={(e) => setNewOptionItem(e.target.value)}
                    size="small"
                    fullWidth
                  />
                </Grid2>
                <Grid2 item xs={3}>
                  <Button
                    variant="outlined"
                    onClick={handleAddOptionItem}
                    fullWidth
                    disabled={!newOptionItem.trim()}
                  >
                    Adicionar
                  </Button>
                </Grid2>
              </Grid2>
              {newOptions.length > 0 && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    border: "1px solid #eee",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Itens da Lista:
                  </Typography>
                  {newOptions.map((option, index) => (
                    <Box
                      key={index}
                      sx={{ display: "flex", alignItems: "center", py: 1 }}
                    >
                      <Typography sx={{ flexGrow: 1 }}>{option}</Typography>
                      <icons.DeleteIcon
                        fontSize="small"
                        color="error"
                        sx={{ cursor: "pointer" }}
                        onClick={() => removeOptionItem(index)}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}

          {newFieldType === "date" && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Configurações de Data
              </Typography>
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
              {newDateType === "range" && (
                <Grid2 container spacing={2} sx={{ mt: 1 }}>
                  <Grid2 item xs={6}>
                    <TextField
                      label="Quantidade"
                      type="number"
                      value={newDateValue}
                      onChange={(e) => setNewDateValue(e.target.value)}
                      size="small"
                      fullWidth
                    />
                  </Grid2>
                  <Grid2 item xs={6}>
                    <Select
                      value={newDatePeriod}
                      onChange={(e) => setNewDatePeriod(e.target.value)}
                      size="small"
                      fullWidth
                    >
                      <MenuItem value="day">Dias</MenuItem>
                      <MenuItem value="week">Semanas</MenuItem>
                      <MenuItem value="month">Meses</MenuItem>
                      <MenuItem value="year">Anos</MenuItem>
                    </Select>
                  </Grid2>
                </Grid2>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" color="success">
          Salvar Alterações
        </Button>
        <Button variant="contained" color="error" onClick={onClose}>
          Cancelar
        </Button>
      </DialogActions>
    </form>
  );
}
