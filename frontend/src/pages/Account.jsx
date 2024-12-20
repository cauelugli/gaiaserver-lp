/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";

const socket = io("http://localhost:5002");

import {
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { icons } from "../icons";

import AccountPreferencesBox from "../components/small/AccountPreferencesBox";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function Account({
  user,
  userPreferences,
  refreshData,
  setRefreshData,
  topBar,
}) {
  const [image, setImage] = React.useState("");
  const [darkMode, setDarkMode] = React.useState(userPreferences.darkMode);
  const [paletteColor, setPaletteColor] = React.useState(
    userPreferences.paletteColor
  );
  const [barPosition, setBarPosition] = React.useState(
    userPreferences.barPosition
  );

  React.useEffect(() => {
    setDarkMode(userPreferences.darkMode);
    setPaletteColor(userPreferences.paletteColor);
    setBarPosition(userPreferences.barPosition);
  }, [userPreferences]);

  const handleChangeImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);

    try {
      const uploadResponse = await api.post("/uploads/singleFile", formData);
      const imagePath = uploadResponse.data.imagePath;
      let res;
      if (user.username === "admin") {
        res = await api.put("/admin/changeProfilePicture", {
          image: imagePath,
        });
      } else {
        res = await api.put("/users/changeProfilePicture", {
          userId: user._id,
          image: imagePath,
        });
      }

      if (res.data) {
        toast.success("Imagem Alterada Adicionado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        toast.info("Realize Logout para aplicar a Alteração.", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 8000,
        });
      }
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

  const handleUpdateDarkMode = async (newDarkMode) => {
    try {
      const response = await api.put("/userPreferences/darkMode", {
        userId: user._id,
        darkMode: newDarkMode,
      });

      if (response.data) {
        toast.success("Modo Escuro Atualizado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        setRefreshData(!refreshData);
        const newPaletteColor = newDarkMode ? "#000000" : "#ffffff";
        await handleUpdatePaletteColor(newPaletteColor);
      }
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

  const handleUpdatePaletteColor = async (newPaletteColor) => {
    try {
      const response = await api.put("/userPreferences/paletteColor", {
        userId: user._id,
        paletteColor: newPaletteColor,
      });
      if (response.data) {
        setRefreshData(!refreshData);
        socket.emit("forceIndividualRefresh", user._id);
      }
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

  const handleUpdateBarPosition = async (newBarPosition) => {
    try {
      const response = await api.put("/userPreferences/barPosition", {
        userId: user._id,
        barPosition: newBarPosition,
      });

      if (response.data) {
        setRefreshData(!refreshData);
        toast.success("Posição da Barra Atualizada!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
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
    <Box sx={{ width: topBar ? "105%" : "100%", minHeight: "50vw" }}>
      <Typography sx={{ fontSize: 25, ml: 2, mb: 2, fontWeight: "bold" }}>
        Perfil
      </Typography>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        {userPreferences && (
          <AccountPreferencesBox
            onUpdatePaletteColor={handleUpdatePaletteColor}
            onUpdateDarkMode={handleUpdateDarkMode}
            onUpdateBarPosition={handleUpdateBarPosition}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            paletteColor={paletteColor}
            setPaletteColor={setPaletteColor}
            barPosition={barPosition}
            setBarPosition={setBarPosition}
          />
        )}

        <Box>
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            sx={{ mb: 3 }}
          >
            <Grid
              container
              direction="row"
              alignItems="center"
              justifyContent="center"
            >
              <Avatar
                alt="Imagem do Usuário"
                src={`http://localhost:3000/static/${user.image}`}
                sx={{
                  width: 230,
                  height: 230,
                  opacity: image ? 0.5 : 1,
                }}
              />
              {image && (
                <Avatar
                  alt="Nova Imagem do Usuário"
                  src={URL.createObjectURL(image)}
                  sx={{ ml: 3, width: 230, height: 230 }}
                />
              )}
            </Grid>

            <input
              accept="image/*"
              style={{ display: "none" }}
              id="raised-button-file"
              multiple
              type="file"
              onChange={(e) => {
                const selectedImage = e.target.files[0];
                setImage(selectedImage);
              }}
            />
            <label htmlFor="raised-button-file">
              <Button
                variant="outlined"
                color="primary"
                component="span"
                size="small"
                startIcon={<icons.FileUploadIcon />}
                sx={{ mt: 2 }}
              >
                Nova Imagem
              </Button>
            </label>
            {image && (
              <Grid
                container
                direction="row"
                justifyContent="space-evenly"
                sx={{ mt: 2 }}
              >
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  startIcon={<icons.ClearIcon />}
                  onClick={() => setImage("")}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  startIcon={<icons.CheckIcon />}
                  onClick={handleChangeImage}
                >
                  Salvar Nova Imagem
                </Button>
              </Grid>
            )}
          </Grid>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography sx={{ fontSize: "14px", color: "#777" }}>
                    Nome
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: "14px", color: "#777" }}>
                    E-mail
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: "14px", color: "#777" }}>
                    Telefone
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: "14px", color: "#777" }}>
                    Departamento
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography>{user.name}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>{user.email}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>{user.phone}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {user.department ? (
                      <Grid container direction="user">
                        <Paper
                          elevation={0}
                          sx={{
                            mr: 1,
                            mt: 0.5,
                            width: 15,
                            height: 15,
                            borderRadius: 50,
                            backgroundColor: user.department.color,
                          }}
                        ></Paper>
                        <Typography>{user.department.name}</Typography>
                      </Grid>
                    ) : (
                      "-"
                    )}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Table size="small" sx={{ mt: 4 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <Typography sx={{ fontSize: "14px", color: "#777" }}>
                    Cargo
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: "14px", color: "#777" }}>
                    Nome de Operador
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: "14px", color: "#777" }}>
                    Perfil de Acesso
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="center">
                  <Typography>
                    {user.position ? user.position.name : "-"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>{user.username ? user.username : "-"}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>{user.role ? user.role.name : "-"}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
        <Grid id="ghost" />
        <Grid id="ghost" />
      </Grid>
    </Box>
  );
}
