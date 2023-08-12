/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { IMaskInput } from "react-imask";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const EditCustomerForm = ({
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
        <Typography sx={{ my: 2 }}>Geral</Typography>
        <TextField
          label="Nome da Empresa"
          value={name}
          size="small"
          onChange={(e) => setName(e.target.value)}
          required
          variant="outlined"
          sx={{ mr: 1, width: 350 }}
        />
        <TextField
          sx={{ mr: 1, width: 450 }}
          required
          value={address}
          size="small"
          onChange={(e) => setAddress(e.target.value)}
          variant="outlined"
          label="Endereço"
        />
        <Grid
          container
          sx={{ pr: "4%", mt: 2 }}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item>
            <Typography>Telefone</Typography>
            <IMaskInput
              style={{
                padding: "3%",
                marginRight: "2%",
                marginTop: "1%",
                borderColor: "#eee",
              }}
              mask="(00) 00000-0000"
              definitions={{
                "#": /[1-9]/,
              }}
              onAccept={(value) => setPhone(value)}
              overwrite
              value={phone}
            />
          </Grid>
          <Grid item>
            <Typography>CNPJ</Typography>
            <IMaskInput
              style={{
                padding: "3%",
                marginRight: "2%",
                marginTop: "1%",
                borderColor: "#eee",
              }}
              mask="00.000.000/0000-00"
              definitions={{
                "#": /[1-9]/,
              }}
              onAccept={(value) => setCnpj(value)}
              overwrite
              value={cnpj}
            />
          </Grid>
          <Grid item>
            <TextField
              variant="outlined"
              label="Segmento"
              size="small"
              value={segment}
              required
              onChange={(e) => setSegment(e.target.value)}
              sx={{ mr: 1, mt: 1, width: 205 }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Typography sx={{ my: 2 }}>Contato Principal</Typography>
        <TextField
          label="Nome"
          value={mainContactName}
          onChange={(e) => setMainContactName(e.target.value)}
          required
          size="small"
          variant="outlined"
          sx={{ mr: 1, width: 340 }}
        />
        <TextField
          label="Email"
          value={mainContactEmail}
          onChange={(e) => setMainContactEmail(e.target.value)}
          required
          size="small"
          variant="outlined"
          sx={{ mr: 1, width: 300 }}
        />

        <FormControl sx={{ mb: 1, width: 155 }}>
          <Select
            value={mainContactPosition}
            onChange={(e) => setMainContactPosition(e.target.value)}
            size="small"
            required
          >
            <MenuItem value={"Admin2"}>Sócio</MenuItem>
            <MenuItem value={"Admin"}>Proprietário</MenuItem>
          </Select>
        </FormControl>

        <Box>
          <Divider sx={{ my: 2 }} />
          <Typography sx={{ my: 2 }}>Domínio</Typography>
          <TextField
            variant="outlined"
            label="Website"
            size="small"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            sx={{ mr: 1, width: 270 }}
          />
          <TextField
            variant="outlined"
            label="Domínio"
            size="small"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            sx={{ mr: 1, width: 250 }}
          />

          <FormControl sx={{ width: 165 }}>
            <Select
              value={employees}
              size="small"
              onChange={(e) => setEmployees(e.target.value)}
            >
              <MenuItem value={"1-9"}>1 à 9</MenuItem>
              <MenuItem value={"10-50"}>10 à 50</MenuItem>
              <MenuItem value={"51-100"}>51 à 100</MenuItem>
              <MenuItem value={"101-200"}>100 à 200</MenuItem>
              <MenuItem value={"+201"}>201 ou mais</MenuItem>
            </Select>
            <FormHelperText># de Colaboradores</FormHelperText>
          </FormControl>
        </Box>
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

export default EditCustomerForm;
