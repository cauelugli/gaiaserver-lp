/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import { IMaskInput } from "react-imask";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const AddClientForm = ({ openAdd, setOpenAdd, fetchData, toast }) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [addressHome, setAddressHome] = React.useState("");
  const [addressDelivery, setAddressDelivery] = React.useState("");
  const [addressBill, setAddressBill] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [cpf, setCpf] = React.useState("");
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
        email,
        addressHome,
        addressDelivery,
        addressBill,
        phone,
        cpf,
      });
      if (res.data) {
        toast.success("Cliente Adicionado!");
      }
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
        <Typography sx={{ my: 2 }}>Geral</Typography>
        <TextField
          label="Nome do Cliente"
          value={name}
          size="small"
          onChange={(e) => setName(e.target.value)}
          required
          variant="outlined"
          sx={{ mr: 1, width: 350 }}
        />
        <TextField
          label="E-mail"
          value={email}
          size="small"
          onChange={(e) => setEmail(e.target.value)}
          required
          variant="outlined"
          sx={{ mr: 1, width: 350 }}
        />
        <Grid item>
          <Typography>CPF</Typography>
          <IMaskInput
            style={{
              padding: "3%",
              marginRight: "2%",
              marginTop: "1%",
              borderColor: "#eee",
            }}
            mask="000.000.000-00"
            definitions={{
              "#": /[1-9]/,
            }}
            onAccept={(value) => setCpf(value)}
            overwrite
            value={cpf}
          />
        </Grid>
        <TextField
          sx={{ mr: 1, width: 450 }}
          required
          value={addressHome}
          size="small"
          onChange={(e) => setAddressHome(e.target.value)}
          variant="outlined"
          label="Endereço Residencial"
        />
        <TextField
          sx={{ mr: 1, width: 450 }}
          required
          value={addressDelivery}
          size="small"
          onChange={(e) => setAddressDelivery(e.target.value)}
          variant="outlined"
          label="Endereço de Entrega"
        />
        <TextField
          sx={{ mr: 1, width: 450 }}
          required
          value={addressBill}
          size="small"
          onChange={(e) => setAddressBill(e.target.value)}
          variant="outlined"
          label="Endereço de Cobrança"
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
              mask="(00) 0000-0000"
              definitions={{
                "#": /[1-9]/,
              }}
              onAccept={(value) => setPhone(value)}
              overwrite
              value={phone}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Checkbox
          checked={showAdditionalOptions}
          onChange={handleCheckboxChange}
        />
        <label>Dados Completos</label>

        {showAdditionalOptions && <></>}
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

export default AddClientForm;
