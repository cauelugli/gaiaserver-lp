/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  Avatar,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { IMaskInput } from "react-imask";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import DeleteIcon from "@mui/icons-material/Delete";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const EditUserForm = ({
  openEdit,
  selectedUser,
  departments,
  setOpenEdit,
  fetchData,
  toast,
}) => {
  const [name, setName] = React.useState(selectedUser.name);
  const [email, setEmail] = React.useState(selectedUser.email);
  const [image, setImage] = React.useState(selectedUser.image);
  const [newImage, setNewImage] = React.useState("");

  const [phone, setPhone] = React.useState(selectedUser.phone);
  const [department, setDepartment] = React.useState(
    selectedUser.department || ""
  );
  const [position, setPosition] = React.useState(selectedUser.position);
  const previousData = selectedUser;

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      let updatedImagePath = selectedUser.image;

      if (newImage) {
        const formData = new FormData();
        formData.append("image", newImage);
        const uploadResponse = await api.post(
          "/uploads/singleProduct",
          formData
        );
        updatedImagePath = uploadResponse.data.imagePath;
      }

      const res = await api.put("/users", {
        userId: selectedUser._id,
        name,
        email,
        phone,
        role: selectedUser.role,
        image: updatedImagePath,
        department: {
          id: department.id || department._id,
          name: department.name,
          phone: department.phone,
          email: department.email,
          color: department.color,
        },
        position,
        previousData,
      });
      if (res.data) {
        toast.success("Colaborador Editado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenEdit(!openEdit);
      fetchData();
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
    <form onSubmit={handleEdit}>
      <DialogTitle>Editando Colaborador - {selectedUser.name}</DialogTitle>
      <DialogContent>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item>
            <Avatar
              alt="Imagem do Usuário"
              src={`http://localhost:3000/static/${selectedUser.image}`}
              sx={{
                width: 200,
                height: 200,
                opacity: newImage ? "0.5" : "1",
                marginRight: newImage ? 5 : 0,
              }}
            />
          </Grid>

          <Grid item>
            {newImage && (
              <Avatar
                src={URL.createObjectURL(newImage)}
                alt="Prévia da Imagem"
                style={{
                  width: 200,
                  height: 200,
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

        <Grid>
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
                  sx={{ mr: 1, width: 300 }}
                />
              </Grid>
              <Grid item>
                <Typography>Email</Typography>
                <TextField
                  value={email}
                  size="small"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mr: 1, width: 285 }}
                />
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
            <Grid
              container
              sx={{ mt: 2 }}
              direction="row"
              justifyContent="space-evenly"
              alignItems="center"
            >
              <Grid item>
                <Typography sx={{ mb: 1 }}>Departamento</Typography>
                <Select
                  onChange={(e) => setDepartment(e.target.value)}
                  value={department}
                  renderValue={(selected) => selected.name}
                  size="small"
                  sx={{ minWidth: 250 }}
                >
                  {departments.map((item) => (
                    <MenuItem
                      value={item}
                      key={item.id}
                      sx={{
                        backgroundColor: item.color,
                        color: "white",
                        "&:hover": {
                          backgroundColor: item.color,
                          color: "white",
                        },
                      }}
                    >
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item>
                <Typography sx={{ mb: 1, ml: 2 }}>Ocupação</Typography>
                <TextField
                  value={position}
                  size="small"
                  required
                  onChange={(e) => setPosition(e.target.value)}
                  sx={{ ml: 2, width: 250 }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
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
