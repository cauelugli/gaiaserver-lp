/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Button,
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

const EditUserForm = ({
  openEdit,
  setOpenEdit,
  selectedCustomer,
  fetchData,
}) => {
  const [name, setName] = React.useState(selectedCustomer.name);
  const [address, setAddress] = React.useState(selectedCustomer.address);
  const [phone, setPhone] = React.useState(selectedCustomer.phone);
  const [mainContactName, setMainContactName] = React.useState(
    selectedCustomer.mainContactName
  );
  const [mainContactEmail, setMainContactEmail] = React.useState(
    selectedCustomer.mainContactEmail
  );
  const [mainContactPosition, setMainContactPosition] = React.useState(
    selectedCustomer.mainContactPosition
  );
  const [domain, setDomain] = React.useState(selectedCustomer.domain);
  const [website, setWebsite] = React.useState(selectedCustomer.website);
  const [cnpj, setCnpj] = React.useState(selectedCustomer.cnpj);
  const [segment, setSegment] = React.useState(selectedCustomer.segment);
  const [employees, setEmployees] = React.useState(selectedCustomer.employees);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/customers", {
        customer: selectedCustomer._id,
        name,
        address,
        phone,
        mainContactName,
        mainContactEmail,
        mainContactPosition,
        segment,
        domain,
        employees,
        website,
        cnpj,
      });
      res.data && alert("Editado com sucesso!");
      setOpenEdit(!openEdit);
      fetchData();
    } catch (err) {
      alert("Vish, editei não...");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleEdit}>
      <DialogTitle>Editando Cliente {selectedCustomer.name}</DialogTitle>
      <DialogContent>
        <Typography sx={{ my: 1 }}>Geral</Typography>
        <TextField
          label="Nome da Empresa"
          margin="dense"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
          sx={{ mr: 1, width: 700 }}
        />
        <TextField
          label="Endereço"
          margin="dense"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          variant="outlined"
          sx={{ mr: 1, width: 700 }}
        />
        <TextField
          label="Telefone"
          margin="dense"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          variant="outlined"
          sx={{ mr: 1, width: 160 }}
        />
        <TextField
          label="CNPJ"
          margin="dense"
          variant="outlined"
          value={cnpj}
          onChange={(e) => setCnpj(e.target.value)}
          sx={{ mr: 1, width: 240 }}
        />
        <TextField
          label="Segmento"
          margin="dense"
          variant="outlined"
          value={segment}
          onChange={(e) => setSegment(e.target.value)}
          sx={{ mr: 1, width: 285 }}
        />
        <Divider sx={{ my: 2 }} />
        <Typography sx={{ my: 1 }}>Contato Principal</Typography>
        <TextField
          label="Nome"
          margin="dense"
          value={mainContactName}
          onChange={(e) => setMainContactName(e.target.value)}
          variant="outlined"
          sx={{ mr: 1, width: 270 }}
        />
        <TextField
          label="Email"
          margin="dense"
          value={mainContactEmail}
          onChange={(e) => setMainContactEmail(e.target.value)}
          variant="outlined"
          sx={{ mr: 1, width: 270 }}
        />

        <FormControl sx={{ my: 1, width: 145 }}>
          <InputLabel>Posição</InputLabel>
          <Select
            label="Posição"
            value={mainContactPosition}
            onChange={(e) => setMainContactPosition(e.target.value)}
          >
            <MenuItem value={"Gerente"}>Gerente</MenuItem>
            <MenuItem value={"Proprietário"}>Proprietário</MenuItem>
          </Select>
        </FormControl>

        <Divider sx={{ my: 2 }} />
        <Typography sx={{ my: 1 }}>Etc</Typography>
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
      </DialogContent>
      <DialogActions>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpenEdit(!openEdit)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
};

export default EditUserForm;
