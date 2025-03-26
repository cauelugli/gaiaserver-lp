/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import { icons } from "../icons";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  Grid2,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  Switch,
  FormControlLabel,
} from "@mui/material";

import { configModalOptions } from "../options/configModalOptions";
import Admin from "../forms/config/Admin";

export default function Config({
  mainColor,
  userId,
  userName,
  configCustomization,
}) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [openModal, setOpenModal] = useState(null);
  const [openAdminModal, setOpenAdminModal] = useState(null);
  const [configData, setConfigData] = useState([]);
  const [chosenModal, setChosenModal] = useState("");

  const [showAdvancedConfig, setShowAdvancedConfig] = useState(false);

  const options = configModalOptions(userName, userId, configCustomization);

  const handleItemClick = (modal) => {
    setOpenModal(modal);
    setChosenModal(modal.type.name);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        setConfigData(config.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const config = await api.get("/config");
      setConfigData(config.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCreateInitialConfig = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/config");
      if (res.data) {
        toast.success("Configuração Inicial Criada!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        fetchData();
      }
    } catch (err) {
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", minHeight: "50vw" }}>
      <Grid2 container direction="row" sx={{ mb: 2 }}>
        <Typography
          sx={{ fontSize: 25, ml: 2, mr: 1, fontWeight: "bold" }}
          id="title"
        >
          Configurações
        </Typography>
        <FormControlLabel
          value={showAdvancedConfig}
          control={
            <Switch
              checked={showAdvancedConfig}
              onChange={(e) => setShowAdvancedConfig(e.target.checked)}
            />
          }
          label={showAdvancedConfig ? "Avançadas" : "Básicas"}
          labelPlacement="start"
          sx={{ mb: 2 }}
        />
      </Grid2>
      {configData ? (
        <Grid2
          container
          rowSpacing={1}
          columnSpacing={1}
          justifyContent="center"
          sx={{ m: 1 }}
        >
          {options
            .filter((config) => showAdvancedConfig || config.isBasic)
            .map((config, index) => (
              <Grid2
                item
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleItemClick(config.modal)}
              >
                <Grid2
                  container
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    width: showAdvancedConfig ? "12vw" : "18vw",
                    height: "10vw",
                    border: `"1px solid #ccc"`,
                    borderRadius: 2,
                    transition: "background-color 0.3s, color 0.3s",
                    backgroundColor:
                      hoveredIndex === index ? "#aaa" : `${mainColor}cf`,
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  {config.icon}
                  <Typography sx={{ mt: 1, fontSize: "1.3vw", color: "white" }}>
                    {config.text}
                  </Typography>
                </Grid2>
              </Grid2>
            ))}
        </Grid2>
      ) : (
        <>
          <Typography>Crie a Configuração Inicial</Typography>
          <Button
            type="submit"
            variant="contained"
            color="success"
            onClick={handleCreateInitialConfig}
          >
            Criar
          </Button>
        </>
      )}

      <Grid2
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
      >
        <Grid2
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            mt: 2,
            mx: 1,
            width: showAdvancedConfig ? "15vw" : "20vw",
            height: "10vw",
            border: `1px solid ${mainColor}88`,
            borderRadius: 2,
            transition: "background-color 0.3s, color 0.3s",
            backgroundColor: `grey`,
            color: `${mainColor}88`,
            cursor: "pointer",
            "&:hover": {
              color: `white`,
              backgroundColor: `${mainColor}88`,
            },
          }}
          onClick={() => setOpenAdminModal(true)}
        >
          {<icons.AttributionIcon sx={{ fontSize: "4vw" }} />}
          <Typography sx={{ mt: 1, fontSize: "1.3vw" }}>Admin</Typography>
        </Grid2>{" "}
        <Link to={"/log"} style={{ textDecoration: "none" }}>
          <Grid2
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{
              mt: 2,
              mx: 1,
              width: showAdvancedConfig ? "15vw" : "20vw",
              height: "10vw",
              border: `1px solid ${mainColor}88`,
              borderRadius: 2,
              transition: "background-color 0.3s, color 0.3s",
              backgroundColor: `grey`,
              color: `${mainColor}88`,
              cursor: "pointer",
              "&:hover": {
                color: `white`,
                backgroundColor: `${mainColor}88`,
              },
            }}
          >
            {<icons.PlagiarismIcon sx={{ fontSize: "4vw" }} />}
            <Typography sx={{ mt: 1, fontSize: "1.3vw" }}>
              Logs do Sistema
            </Typography>
          </Grid2>
        </Link>
      </Grid2>

      <Dialog
        open={!!openModal}
        onClose={() => setOpenModal(null)}
        fullWidth
        maxWidth={
          chosenModal === "Permissions"
            ? "lg"
            : chosenModal === "Tables"
            ? "sm"
            : "md"
        }
      >
        <DialogContent>
          {openModal &&
            React.cloneElement(openModal, {
              onClose: () => setOpenModal(null),
            })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(null)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAdminModal}
        onClose={() => setOpenAdminModal(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogContent>
          <Admin onClose={() => setOpenAdminModal(false)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdminModal(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
