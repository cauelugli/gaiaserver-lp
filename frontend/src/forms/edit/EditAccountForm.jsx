/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

import { IMaskInput } from "react-imask";

import { Avatar, Grid, TextField, Tooltip } from "@mui/material";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const EditAccountForm = ({ openEdit, user, setOpenEdit, toast }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [newImage, setNewImage] = useState("");
  const previousData = user;

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      let updatedImagePath = user.image;

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
        userId: user._id,
        name,
        email,
        phone,
        image: updatedImagePath,
        previousData,
        option: "account",
        isManager: Boolean(user.role.name === "Gerente"),
      });
      if (res.data) {
        setIsSuccessDialogOpen(!isSuccessDialogOpen);
      }
    } catch (err) {
      console.log(err);
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

  const handleLogout = () => {
    sessionStorage.clear();
    toast.info("Realizando Logout", {
      closeOnClick: true,
      pauseOnHover: false,
      theme: "colored",
      autoClose: 800,
    });
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  return (
    <form onSubmit={handleEdit}>
      <DialogTitle>Editando Perfil</DialogTitle>
      <DialogContent>
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
                src={`http://localhost:3000/static/${user.image}`}
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
                  <Typography sx={{ mb: 1, ml: 2 }}>Departamento</Typography>
                  <Tooltip
                    title={
                      <Typography sx={{ fontSize: 12 }}>
                        Para alterar visite a seção{" "}
                        <Link
                          to={"/departments"}
                          style={{
                            textDecoration: "none",
                            color: "white",
                          }}
                        >
                          Departamentos
                        </Link>
                      </Typography>
                    }
                  >
                    <TextField
                      value={user.department.name}
                      size="small"
                      required
                      disabled
                      sx={{ ml: 2, width: 250 }}
                    />
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Typography sx={{ mb: 1, ml: 2 }}>Cargo</Typography>
                  <Tooltip
                    title={
                      <Typography sx={{ fontSize: 12 }}>
                        Para alterar visite a seção{" "}
                        <Link
                          to={"/users"}
                          style={{
                            textDecoration: "none",
                            color: "white",
                          }}
                        >
                          Colaboradores
                        </Link>
                      </Typography>
                    }
                  >
                    <TextField
                      value={user.position || "Gerente"}
                      size="small"
                      required
                      disabled
                      sx={{ ml: 2, width: 250 }}
                    />
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>{" "}
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
      <Dialog
        open={isSuccessDialogOpen}
        onClose={() => setIsSuccessDialogOpen(false)}
      >
        <DialogTitle>Perfil Editado</DialogTitle>
        <DialogContent>
          <Typography>Seu perfil foi editado com sucesso!</Typography>
          <Typography>
            Realize o logout abaixo para aplicar as alterações.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Fazer Logout
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default EditAccountForm;
