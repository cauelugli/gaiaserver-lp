/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Avatar,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  Divider,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";

import { IMaskInput } from "react-imask";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import DialogHeader from "../../components/small/DialogHeader";
import FormEndLineTenant from "../../components/small/FormEndLineTenant";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const AddClientForm = ({
  openAdd,
  setOpenAdd,
  refreshData,
  setRefreshData,
  toast,
  configCustomization,
  extraSmall,
}) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [addressHome, setAddressHome] = React.useState("");
  const [addressDelivery, setAddressDelivery] = React.useState("");
  const [addressBill, setAddressBill] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [cpf, setCpf] = React.useState("");
  const [birthdate, setBirthdate] = React.useState(dayjs("11/02/2014"));
  const [gender, setGender] = React.useState("Masculino");
  const [image, setImage] = React.useState("");
  const [showAdditionalOptions, setShowAdditionalOptions] =
    React.useState(false);
  const handleCheckboxChange = (event) => {
    setShowAdditionalOptions(event.target.checked);
  };

  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    try {
      const uploadResponse = await api.post("/uploads/singleProduct", formData);
      const imagePath = uploadResponse.data.imagePath;
      const res = await api.post("/clients", {
        name,
        email,
        image: imagePath,
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

  return (
    <form onSubmit={handleAdd}>
      <DialogHeader
        title="Cliente Pessoa Física"
        femaleGender={false}
        extraSmall={extraSmall}
      />
      <DialogContent>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            style={{ display: "none" }}
            onChange={(e) => {
              const selectedImage = e.target.files[0];
              setImage(selectedImage);
            }}
          />
          <label htmlFor="fileInput">
            <Avatar
              alt="Imagem do Cliente"
              value={image}
              sx={{
                width: 128,
                height: 128,
                borderRadius: 50,
                cursor: "pointer",
              }}
              onClick={handleImageClick}
            >
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Prévia da Imagem"
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <PersonIcon sx={{ fontSize: 80 }} />
              )}
            </Avatar>
          </label>
          {image && (
            <FormHelperText>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => setImage("")}
                sx={{ mt: 1 }}
              >
                Remover
              </Button>
            </FormHelperText>
          )}
        </Grid>
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
              mask="(00) 00000-0000"
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
      <FormEndLineTenant
        configCustomization={configCustomization}
        extraSmall={extraSmall}
      />
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
