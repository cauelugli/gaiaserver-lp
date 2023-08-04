/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const AddCustomerForm = ({ openAdd, setOpenAdd, fetchData }) => {
  const [name, setName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [mainContactName, setMainContactName] = React.useState("");
  const [mainContactEmail, setMainContactEmail] = React.useState("");
  const [mainContactPosition, setMainContactPosition] = React.useState("");
  const [domain, setDomain] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [cnpj, setCnpj] = React.useState("");
  const [segment, setSegment] = React.useState("");
  const [employees, setEmployees] = React.useState("");
  const [showAdditionalOptions, setShowAdditionalOptions] =
    React.useState(false);
  const handleCheckboxChange = (event) => {
    setShowAdditionalOptions(event.target.checked);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/customers", {
        name,
        address,
        phone,
        mainContactName,
        mainContactEmail,
        mainContactPosition,
        domain,
        website,
        cnpj,
        segment,
        employees,
      });
      res.data && alert("Cliente Adicionado!");
      setOpenAdd(!openAdd);
      fetchData();
    } catch (err) {
      alert("Vish, deu não...");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleAdd}>
      <DialogTitle>Novo Cliente</DialogTitle>
      <DialogContent>
        <Typography sx={{ my: 1 }}>Geral</Typography>
        <TextField
          label="Nome da Empresa"
          margin="dense"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          variant="outlined"
          sx={{ mr: 1, width: 700 }}
        />
        <TextField
          sx={{ mr: 1, width: 700 }}
          margin="dense"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          variant="outlined"
          label="Endereço"
        />
        <TextField
          label="Telefone"
          margin="dense"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          variant="outlined"
          sx={{ mr: 1, width: 160 }}
        />
        <TextField
          margin="dense"
          variant="outlined"
          label="CNPJ"
          value={cnpj}
          required
          onChange={(e) => setCnpj(e.target.value)}
          sx={{ mr: 1, width: 240 }}
        />
        <TextField
          margin="dense"
          variant="outlined"
          label="Segmento"
          value={segment}
          required
          onChange={(e) => setSegment(e.target.value)}
          sx={{ mr: 1, width: 285 }}
        />
        <Divider sx={{ my: 2 }} />
        <Typography>Contato Principal</Typography>
        <TextField
          label="Nome"
          margin="dense"
          id="mainContactName"
          value={mainContactName}
          onChange={(e) => setMainContactName(e.target.value)}
          required
          variant="outlined"
          sx={{ mr: 1, width: 270 }}
        />
        <TextField
          label="Email"
          margin="dense"
          id="mainContactEmail"
          value={mainContactEmail}
          onChange={(e) => setMainContactEmail(e.target.value)}
          required
          variant="outlined"
          sx={{ mr: 1, width: 270 }}
        />

        <FormControl sx={{ my: 1, width: 145 }}>
          <InputLabel>Posição</InputLabel>
          <Select
            id="mainContactPosition"
            value={mainContactPosition}
            onChange={(e) => setMainContactPosition(e.target.value)}
            label="Posição"
            required
          >
            <MenuItem value={"Supervisor"}>Supervisor</MenuItem>
            <MenuItem value={"Diretor"}>Diretor</MenuItem>
            <MenuItem value={"Proprietário"}>Proprietário</MenuItem>
          </Select>
        </FormControl>

        <Divider sx={{ my: 2 }} />
        <Checkbox
          checked={showAdditionalOptions}
          onChange={handleCheckboxChange}
        />
        <label>Dados Completos</label>

        {showAdditionalOptions && (
          <Box>
            <Divider sx={{ my: 2 }} />
            <Typography>Etc</Typography>
            <TextField
              margin="dense"
              variant="outlined"
              label="Website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              sx={{ mr: 1, width: 270 }}
            />
            <TextField
              margin="dense"
              variant="outlined"
              label="Domínio"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              sx={{ mr: 1, width: 250 }}
            />

            <FormControl sx={{ mt: 1, width: 165 }}>
              <InputLabel>Colaboradores</InputLabel>
              <Select
                value={employees}
                onChange={(e) => setEmployees(e.target.value)}
                label="Colaboradores"
              >
                <MenuItem value={"1-9"}>1 à 9</MenuItem>
                <MenuItem value={"10-50"}>10 à 50</MenuItem>
                <MenuItem value={"51-100"}>51 à 100</MenuItem>
                <MenuItem value={"101-200"}>100 à 200</MenuItem>
                <MenuItem value={"+201"}>201 ou mais</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpenAdd(!openAdd)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
};

export default AddCustomerForm;
