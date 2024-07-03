/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5002");

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  Button,
  DialogActions,
  DialogContent,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  MenuItem,
  Popover,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import DialogHeader from "../../components/small/DialogHeader";
import FormEndLineTenant from "../../components/small/FormEndLineTenant";

export default function AddProductForm({
  userName,
  onClose,
  refreshData,
  setRefreshData,
  configCustomization,
  toast,
  userId,
  type,
}) {
  const [selectedType, setSelectedType] = React.useState(type);
  const [name, setName] = React.useState("");
  const [fields, setFields] = React.useState([]);
  const [image, setImage] = React.useState("");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [newFieldName, setNewFieldName] = React.useState("");
  const [newFieldType, setNewFieldType] = React.useState("a");

  const [newStringOptionMinCharacter, setNewStringOptionMinCharacter] =
    React.useState(1);
  const [newStringOptionMaxCharacter, setNewStringOptionMaxCharacter] =
    React.useState(80);

  const [newNumberOptionType, setNewNumberOptionType] =
    React.useState("integer");
  const [newNumberOptionMinValue, setNewNumberOptionMinValue] =
    React.useState(0);
  const [newNumberOptionMaxValue, setNewNumberOptionMaxValue] =
    React.useState(1);

  const [newOptions, setNewOptions] = React.useState([]);
  const [newOptionItem, setNewOptionItem] = React.useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);

    try {
      const uploadResponse = await api.post("/uploads/singleFile", formData);
      const imagePath = uploadResponse.data.imagePath;
      const productResponse = await api.post("/products", {
        name,
        fields,
        type: selectedType,
        image: imagePath,
        createdBy: userName,
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

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
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
    }

    setFields((prevFields) => [...prevFields, newField]);
    setNewFieldName("");
    setNewFieldType("a");
    setNewStringOptionMinCharacter(1);
    setNewStringOptionMaxCharacter(80);
    setNewNumberOptionType("integer");
    setNewNumberOptionMinValue(0);
    setNewNumberOptionMaxValue(1);
    setNewOptions([]);
    setNewOptionItem("");
    handleClosePopover();
  };

  const handleAddOptionItem = () => {
    setNewOptions((prevOptions) => [...prevOptions, newOptionItem]);
    setNewOptionItem("");
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <form onSubmit={handleAdd}>
      <DialogHeader title={selectedType} femaleGender={false} />
      <DialogContent>
        <Grid
          container
          sx={{ mt: 2 }}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item>
            <Typography sx={{ fontSize: 13 }}>Tipo</Typography>
            <TextField
              size="small"
              value={selectedType}
              disabled
              variant="outlined"
              sx={{ width: 120 }}
            />
          </Grid>

          <Grid item sx={{ mx: 1 }}>
            <Typography sx={{ fontSize: 13 }}>Nome</Typography>
            <TextField
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ width: 200 }}
            />
          </Grid>

          <Grid item sx={{ mt: 2 }}>
            <Grid container direction="row">
              {fields.map((field, index) => (
                <Typography key={index}>
                  {field.type === "string" ? (
                    <TextField
                      size="small"
                      sx={{ mr: 1, width: 150 }}
                      disabled
                      label={`Campo ${index + 1}: Texto`}
                      value={`${field.name}`}
                    />
                  ) : field.type === "number" ? (
                    "Número - "
                  ) : field.type === "options" ? (
                    "Lista de Opções - "
                  ) : (
                    "Data - "
                  )}
                  {!field.name && "Lista de Opções"}{" "}
                  {field.options && field.options.map((opt) => opt)}
                </Typography>
              ))}
            </Grid>
          </Grid>

          <Grid item sx={{ mt: 2 }}>
            <Button
              variant="contained"
              size="small"
              onClick={handleOpenPopover}
              sx={{ maxWidth: 80 }}
            >
              <Typography sx={{ fontSize: 11 }}>Adicionar Campo</Typography>
            </Button>
          </Grid>
        </Grid>

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Grid container direction="column" sx={{ p: 2 }}>
            <Typography>Novo Campo</Typography>
            <Grid item>
              <TextField
                label="Nome do Campo"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                size="small"
                sx={{ my: 2 }}
              />
            </Grid>
            <Grid item>
              <Select
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value)}
                size="small"
                sx={{ mb: 2, width: "100%" }}
              >
                <MenuItem disabled value="a">
                  <Typography>Tipo do Campo</Typography>
                </MenuItem>
                <MenuItem value={"string"}>Texto</MenuItem>
                <MenuItem value={"number"}>Número</MenuItem>
                <MenuItem value={"options"}>Lista de Opções</MenuItem>
                <MenuItem value={"date"}>Data</MenuItem>
              </Select>
            </Grid>
            <Grid item>
              {newFieldType === "string" && (
                <Grid sx={{ my: 2, mx: 1 }}>
                  <Typography>Caracteres</Typography>
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Grid item>
                      <Typography sx={{ fontSize: 10 }}>Min</Typography>
                      <TextField
                        type="number"
                        value={newStringOptionMinCharacter}
                        onChange={(e) =>
                          setNewStringOptionMinCharacter(e.target.value)
                        }
                        size="small"
                        sx={{ maxWidth: 90 }}
                      />
                    </Grid>
                    <Grid item>
                      <Typography sx={{ fontSize: 10 }}>Max</Typography>
                      <TextField
                        type="number"
                        value={newStringOptionMaxCharacter}
                        onChange={(e) =>
                          setNewStringOptionMaxCharacter(e.target.value)
                        }
                        size="small"
                        sx={{ maxWidth: 90 }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
            <Grid item>
              {newFieldType === "number" && (
                <>
                  <Grid sx={{ mt: 2 }}>
                    <Typography>Tipo de Número</Typography>
                    <RadioGroup
                      row
                      value={newNumberOptionType}
                      onChange={(e) => setNewNumberOptionType(e.target.value)}
                    >
                      <FormControlLabel
                        value="integer"
                        control={
                          <Radio size="small" sx={{ mt: -0.25, mr: -0.5 }} />
                        }
                        label={
                          <Typography sx={{ fontSize: 13 }}>Inteiro</Typography>
                        }
                      />
                      <FormControlLabel
                        value="float"
                        control={
                          <Radio size="small" sx={{ mt: -0.25, mr: -0.5 }} />
                        }
                        label={
                          <Typography sx={{ fontSize: 13 }}>Decimal</Typography>
                        }
                      />
                    </RadioGroup>
                  </Grid>
                  <Grid sx={{ my: 2 }}>
                    <Typography>Valores</Typography>
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Grid item>
                        <Typography sx={{ fontSize: 10 }}>Min</Typography>
                        <TextField
                          type="number"
                          value={newNumberOptionMinValue}
                          onChange={(e) =>
                            setNewNumberOptionMinValue(e.target.value)
                          }
                          size="small"
                          sx={{ maxWidth: 90 }}
                        />
                      </Grid>
                      <Grid item>
                        <Typography sx={{ fontSize: 10 }}>Max</Typography>
                        <TextField
                          type="number"
                          value={newNumberOptionMaxValue}
                          onChange={(e) =>
                            setNewNumberOptionMaxValue(e.target.value)
                          }
                          size="small"
                          sx={{ maxWidth: 90 }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>
            <Grid item>
              {newFieldType === "options" && (
                <>
                  <Typography>Itens da Lista</Typography>
                  <Grid container alignItems="center" sx={{ my: 2 }}>
                    <TextField
                      value={newOptionItem}
                      onChange={(e) => setNewOptionItem(e.target.value)}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleAddOptionItem}
                    >
                      Adicionar Item
                    </Button>
                  </Grid>
                  {newOptions.map((option, index) => (
                    <Typography key={index}>{option}</Typography>
                  ))}
                </>
              )}
            </Grid>
            <Grid item>{newFieldType === "date" && "É data"}</Grid>
            <Button variant="contained" onClick={handleAddField}>
              Adicionar
            </Button>
          </Grid>
        </Popover>

        {image && (
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item>
              <img
                src={URL.createObjectURL(image)}
                alt="Prévia da Imagem"
                style={{
                  marginTop: 20,
                  maxWidth: "200px",
                  maxHeight: "200px",
                }}
              />
            </Grid>
            <Grid item>
              <FormHelperText>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={() => setImage("")}
                >
                  Remover
                </Button>
              </FormHelperText>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <FormEndLineTenant configCustomization={configCustomization} />
      <DialogActions sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            onClose();
          }}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
}
