/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";

import { useAppData } from "../../src/AppDataContext";

const socket = io("http://localhost:5002");

import {
  Avatar,
  Box,
  Button,
  Grid2,
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
  const appData = useAppData();
  const idIndexList = appData.idIndexList;
  const [image, setImage] = React.useState("");
  const [darkMode, setDarkMode] = React.useState(userPreferences.darkMode);
  const [paletteColor, setPaletteColor] = React.useState(
    userPreferences.paletteColor
  );
  const [barPosition, setBarPosition] = React.useState(
    userPreferences.barPosition
  );
  const [fontFamilyTitle, setFontFamilyTitle] = React.useState(
    userPreferences.fontFamilyTitle
  );
  const [fontFamilyRest, setFontFamilyRest] = React.useState(
    userPreferences.fontFamilyRest
  );
  const [homePageLayout, setHomePageLayout] = React.useState(
    userPreferences.homePageLayout
  );
  const [homePagePreferences, setHomePagePreferences] = React.useState(
    userPreferences.homePagePreferences
  );

  React.useEffect(() => {
    setDarkMode(userPreferences.darkMode);
    setPaletteColor(userPreferences.paletteColor);
    setBarPosition(userPreferences.barPosition);
    setFontFamilyTitle(userPreferences.fontFamilyTitle);
    setFontFamilyRest(userPreferences.fontFamilyRest);
    setHomePageLayout(userPreferences.homePageLayout);
    setHomePagePreferences(userPreferences.homePagePreferences);
  }, [userPreferences]);

  const handleChangeImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);

    try {
      const uploadResponse = await api.post("/uploads/singleFile", formData);
      const imagePath = uploadResponse.data.imagePath;
      const res = await api.put("/admin/changeProfilePicture", {
        image: imagePath,
      });

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

  const handleUpdateFontFamily = async (
    newFontFamilyTitle,
    newFontFamilyRest
  ) => {
    setFontFamilyTitle(newFontFamilyTitle);
    setFontFamilyRest(newFontFamilyRest);

    try {
      const response = await api.put("/userPreferences/fontFamily", {
        userId: user._id,
        fontFamilyTitle: newFontFamilyTitle,
        fontFamilyRest: newFontFamilyRest,
      });

      if (response.data) {
        setRefreshData(!refreshData);
        socket.emit("forceIndividualRefresh", user._id);
        toast.success("Fonte Atualizada!", {
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

  const handleUpdateHomePageLayout = async (newHomePageLayout) => {
    try {
      const response = await api.put("/userPreferences/homePageLayout", {
        userId: user._id,
        homePageLayout: newHomePageLayout,
      });

      if (response.data) {
        setRefreshData(!refreshData);
        toast.success("Layout da Home Page Atualizado!", {
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

  const handleUpdateHomePagePreferences = async (newHomePagePreferences) => {
    try {
      const response = await api.put("/userPreferences/homePagePreferences", {
        userId: user._id,
        homePagePreferences: newHomePagePreferences,
      });

      if (response.data) {
        setRefreshData(!refreshData);
        toast.success("Home Page Atualizada!", {
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
    <Grid2 sx={{ width: "175%" }}>
      <Typography
        sx={{ fontSize: 25, ml: 2, mb: 2, fontWeight: "bold" }}
        id="title"
      >
        Perfil
      </Typography>
      <Grid2
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
            onUpdateHomePageLayout={handleUpdateHomePageLayout}
            onUpdateHomePagePreferences={handleUpdateHomePagePreferences}
            darkMode={darkMode}
            paletteColor={paletteColor}
            barPosition={barPosition}
            homePageLayout={homePageLayout}
            homePagePreferences={homePagePreferences}
            fontFamilyTitle={fontFamilyTitle}
            fontFamilyRest={fontFamilyRest}
            handleUpdateFontFamily={handleUpdateFontFamily}
            setFontFamilyTitle={setFontFamilyTitle}
            setFontFamilyRest={setFontFamilyRest}
          />
        )}

        <Grid2 container justifyContent="center" alignItems="center">
          <Grid2
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            sx={{ mb: 3 }}
          >
            <Grid2
              container
              direction="row"
              alignItems="center"
              justifyContent="center"
            >
              <Avatar
                alt="Imagem do Usuário"
                src={`http://localhost:8080/static/${user.image}`}
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
            </Grid2>

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
                sx={{ mt: 3, mb: 1 }}
              >
                Nova Imagem
              </Button>
            </label>
            {image && (
              <Grid2
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
                  sx={{ ml: 2 }}
                  variant="contained"
                  color="success"
                  size="small"
                  startIcon={<icons.CheckIcon />}
                  onClick={handleChangeImage}
                >
                  Salvar Nova Imagem
                </Button>
              </Grid2>
            )}
          </Grid2>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <Typography sx={{ fontSize: "14px" }}>Nome</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: "14px" }}>
                    Nome de Operador
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: "14px" }}>E-mail</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="center">
                  <Typography>{user.name}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>{user.username ? user.username : ""}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>{user.email}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid2>
        <Grid2 id="ghost" />
        <Grid2 id="ghost" />
      </Grid2>
    </Grid2>
  );
}
