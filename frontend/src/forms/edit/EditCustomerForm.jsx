/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Avatar,
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

import FileUploadIcon from "@mui/icons-material/FileUpload";
import DeleteIcon from "@mui/icons-material/Delete";

import { IMaskInput } from "react-imask";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const EditCustomerForm = ({
  openEdit,
  setOpenEdit,
  selectedCustomer,
  fetchData,
  toast,
}) => {
  const [name, setName] = React.useState(selectedCustomer.name);
  const [address, setAddress] = React.useState(selectedCustomer.address);
  const [phone, setPhone] = React.useState(selectedCustomer.phone);
  const [image, setImage] = React.useState(selectedCustomer.image);
  const [newImage, setNewImage] = React.useState("");
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
      let updatedImagePath = selectedCustomer.image;

      if (newImage) {
        const formData = new FormData();
        formData.append("image", newImage);
        const uploadResponse = await api.post(
          "/uploads/singleProduct",
          formData
        );
        updatedImagePath = uploadResponse.data.imagePath;
      }

      const res = await api.put("/customers", {
        customer: selectedCustomer._id,
        name,
        address,
        phone,
        image: updatedImagePath,
        mainContactName,
        mainContactEmail,
        mainContactPosition,
        segment,
        domain,
        employees,
        website,
        cnpj,
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
      fetchData();
    } catch (err) {
      alert("Vish, editei não...");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleEdit}>
      <DialogTitle>Editando Cliente - {selectedCustomer.name}</DialogTitle>
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
              src={`http://localhost:3000/static/${selectedCustomer.image}`}
              sx={{
                width: 250,
                height: 70,
                borderRadius: 1,
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
                  width: 250,
                  height: 70,
                  borderRadius: 3,
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
            <MenuItem value={"Sócio"}>Sócio</MenuItem>
            <MenuItem value={"Proprietário"}>Proprietário</MenuItem>
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
