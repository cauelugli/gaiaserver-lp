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
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { IMaskInput } from "react-imask";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";

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
  const [birthdate, setBirthdate] = React.useState(dayjs("11/02/2014"));
  const [gender, setGender] = React.useState("Masculino");
  const [showAdditionalOptions, setShowAdditionalOptions] =
    React.useState(false);
  const handleCheckboxChange = (event) => {
    setShowAdditionalOptions(event.target.checked);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/clients", {
        name,
        email,
        addressHome,
        addressDelivery,
        addressBill,
        phone,
        cpf,
        birthdate,
        gender,
      });
      if (res.data) {
        toast.success("Cliente Adicionado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
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
      <DialogTitle>Novo Cliente Pessoa Física</DialogTitle>
      <DialogContent>
        <Typography sx={{ my: 1, fontWeight: "bold" }}>Dados</Typography>
        <Grid container direction="column" alignItems="center">
          <TextField
            label="Nome do Cliente"
            value={name}
            fullWidth
            size="small"
            onChange={(e) => setName(e.target.value)}
            required
            variant="outlined"
          />
          <TextField
            sx={{ my: 2 }}
            label="E-mail"
            value={email}
            size="small"
            onChange={(e) => setEmail(e.target.value)}
            required
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid container direction="row" alignItems="center">
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
          <Grid item sx={{ ml: 3 }}>
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
        </Grid>

        <Grid container direction="row" alignItems="center" sx={{ mt: 2 }}>
          <Grid item sx={{ width: "60%" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  value={birthdate}
                  format="DD/MM/YYYY"
                  onChange={(newValue) => setBirthdate(newValue)}
                  label="Data de Nascimento"
                />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>
          <Grid item sx={{ mb: 2, ml: 2 }}>
            <InputLabel>Gênero</InputLabel>
            <Select value={gender} onChange={(e) => setGender(e.target.value)}>
              <MenuItem value={"Masculino"}>Masculino</MenuItem>
              <MenuItem value={"Feminino"}>Feminino</MenuItem>
              <MenuItem value={"Não Informado"}>Não Informar</MenuItem>
            </Select>
          </Grid>
        </Grid>

        <Typography sx={{ mt: 2, fontWeight: "bold" }}>Endereços</Typography>
        <Grid container direction="column" alignItems="center">
          <TextField
            fullWidth
            required
            sx={{ mt: 1 }}
            value={addressHome}
            size="small"
            onChange={(e) => setAddressHome(e.target.value)}
            variant="outlined"
            label="Endereço de Residência"
          />
          <TextField
            sx={{ my: 2 }}
            fullWidth
            required
            value={addressDelivery}
            size="small"
            onChange={(e) => setAddressDelivery(e.target.value)}
            variant="outlined"
            label="Endereço de Entrega"
          />
          <TextField
            fullWidth
            required
            value={addressBill}
            size="small"
            onChange={(e) => setAddressBill(e.target.value)}
            variant="outlined"
            label="Endereço de Cobrança"
          />
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
