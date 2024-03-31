/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Avatar,
  Button,
  DialogActions,
  DialogContent,
  FormHelperText,
  Grid,
  ListSubheader,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import { IMaskInput } from "react-imask";
import DialogHeader from "../../components/small/DialogHeader";
import FormEndLineTenant from "../../components/small/FormEndLineTenant";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const AddManagerForm = ({
  departments,
  setOpenAdd,
  refreshData,
  setRefreshData,
  toast,
  configCustomization,
  addFromShortcut
}) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [image, setImage] = React.useState("");

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
      const res = await api.post("/managers", {
        name,
        email,
        phone,
        image: imagePath,
        department: {
          id: department._id,
          name: department.name,
          phone: department.phone,
          email: department.email,
          color: department.color,
        },
      });

      if (res.data) {
        toast.success("Gerente Adicionado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }

      setOpenAdd(false);
      if (!addFromShortcut) {
        setRefreshData(!refreshData);
      }
    } catch (err) {
      if (err.response && err.response.status === 422) {
        toast.error(err.response.data.error, {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      } else {
        toast.error("Houve algum erro...", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
    }
  };

  return (
    <form onSubmit={handleAdd}>
      <DialogHeader title="Gerente" femaleGender={false} />
      <DialogContent>
        <Grid container direction="row" justifyContent="space-around">
          <Grid item>
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
                  alt="Imagem do Usuário"
                  value={image}
                  sx={{ width: 100, height: 100, cursor: "pointer" }}
                  onClick={handleImageClick}
                >
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Prévia da Imagem"
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : null}
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
          </Grid>
          <Grid item>
            <Grid
              container
              sx={{ mt: 2 }}
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid item>
                <Typography>Nome</Typography>
                <TextField
                  size="small"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  sx={{ mr: 1, width: 200 }}
                />
              </Grid>
              <Grid item>
                <Typography>Email</Typography>
                <TextField
                  value={email}
                  size="small"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mr: 1, width: 185 }}
                />
              </Grid>
              <Grid item sx={{ mr: 1 }}>
                <Typography>Departamento</Typography>
                <Select
                  onChange={(e) => setDepartment(e.target.value)}
                  value={department}
                  renderValue={(selected) => selected.name}
                  size="small"
                  sx={{ minWidth: 200 }}
                >
                  <ListSubheader sx={{ color: "green", m: -1 }}>
                    Disponíveis
                  </ListSubheader>
                  {departments
                    .filter((department) => !department.manager)
                    .map((department) => (
                      <MenuItem
                        value={department}
                        key={department._id}
                        sx={{ fontSize: "100%" }}
                      >
                        <Grid container direction="row">
                          <Paper
                            elevation={0}
                            sx={{
                              mr: 1,
                              mt: 0.5,
                              width: 15,
                              height: 15,
                              borderRadius: 50,
                              backgroundColor: department.color,
                            }}
                          />
                          <Typography>{department.name}</Typography>
                        </Grid>
                      </MenuItem>
                    ))}
                  <ListSubheader sx={{ color: "red", m: -1, mt: 0 }}>
                    Gerenciados
                  </ListSubheader>
                  {departments
                    .filter((department) => department.manager)
                    .map((department) => (
                      <MenuItem
                        disabled
                        value={department}
                        key={department._id}
                        sx={{ fontSize: "100%" }}
                      >
                        <Grid container direction="row">
                          <Paper
                            elevation={0}
                            sx={{
                              mr: 1,
                              mt: 0.5,
                              width: 15,
                              height: 15,
                              borderRadius: 50,
                              backgroundColor: department.color,
                            }}
                          />
                          <Typography>{department.name}</Typography>
                        </Grid>{" "}
                      </MenuItem>
                    ))}
                </Select>
              </Grid>
              <Grid item>
                <Typography>Telefone</Typography>
                <IMaskInput
                  style={{
                    padding: "5%",
                    marginRight: "4%",
                    marginTop: "1%",
                    borderColor: "#eee",
                    borderRadius: 4,
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
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <FormEndLineTenant configCustomization={configCustomization} />

      <DialogActions>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpenAdd(false)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
};

export default AddManagerForm;
