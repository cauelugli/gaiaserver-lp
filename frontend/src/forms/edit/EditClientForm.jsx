/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Avatar,
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

import FileUploadIcon from "@mui/icons-material/FileUpload";
import DeleteIcon from "@mui/icons-material/Delete";

import { IMaskInput } from "react-imask";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const EditClientForm = ({
  openEdit,
  refreshData,
  setRefreshData,
  setOpenEdit,
  selectedClient,
  toast,
}) => {
  const [name, setName] = React.useState(selectedClient.name);
  const [email, setEmail] = React.useState(selectedClient.email);

  const [addressHome, setAddressHome] = React.useState(
    selectedClient.addressHome
  );
  const [addressDelivery, setAddressDelivery] = React.useState(
    selectedClient.addressDelivery
  );
  const [addressBill, setAddressBill] = React.useState(
    selectedClient.addressBill
  );
  const [phone, setPhone] = React.useState(selectedClient.phone);
  const [cpf, setCpf] = React.useState(selectedClient.cpf);
  const [birthdate, setBirthdate] = React.useState(
    dayjs(selectedClient.birthdate)
  );
  const [gender, setGender] = React.useState(selectedClient.gender);
  const [newImage, setNewImage] = React.useState("");

  const [showAdditionalOptions, setShowAdditionalOptions] =
    React.useState(false);
  const handleCheckboxChange = (event) => {
    setShowAdditionalOptions(event.target.checked);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    let updatedImagePath = selectedClient.image;

    if (newImage) {
      const formData = new FormData();
      formData.append("image", newImage);
      const uploadResponse = await api.post("/uploads/singleProduct", formData);
      updatedImagePath = uploadResponse.data.imagePath;
    }
    try {
      const res = await api.put("/clients", {
        client: selectedClient._id,
        name,
        email,
        addressHome,
        addressDelivery,
        image: updatedImagePath,
        addressBill,
        phone,
        cpf,
        birthdate,
        gender,
      });
      if (res.data) {
        toast.success("Cliente Editado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenEdit(!openEdit);
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
    <form onSubmit={handleEdit}>
      <DialogTitle>Editando - {selectedClient.name}</DialogTitle>
      <DialogContent>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item>
            <Avatar
              alt="Logotipo da Empresa"
              src={`http://localhost:3000/static/${selectedClient.image}`}
              sx={{
                width: 128,
                height: 128,
                borderRadius: 50,
                cursor: "pointer",
                opacity: newImage ? "0.5" : "1",
                marginRight: newImage ? 3 : 0,
              }}
            />
          </Grid>

          <Grid item>
            {newImage && (
              <Avatar
                src={URL.createObjectURL(newImage)}
                alt="Prévia da Imagem"
                style={{
                  width: 128,
                  height: 128,
                  borderRadius: 50,
                }}
              />
            )}
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            style={{ display: "none" }}
            onChange={(e) => {
              const selectedImage = e.target.files[0];
              setNewImage(selectedImage);
            }}
          />
          {!newImage ? (
            <label htmlFor="fileInput">
              <Button
                variant="outlined"
                color="primary"
                component="span"
                size="small"
                startIcon={<FileUploadIcon />}
                sx={{ my: 2 }}
              >
                Alterar Imagem
              </Button>
            </label>
          ) : (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => setNewImage("")}
              sx={{ my: 2 }}
            >
              Remover Imagem
            </Button>
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
              <MenuItem value={"m"}>Masculino</MenuItem>
              <MenuItem value={"f"}>Feminino</MenuItem>
              <MenuItem value={"0"}>Não Informar</MenuItem>
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
          onClick={() => setOpenEdit(!openEdit)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
};

export default EditClientForm;
