/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SketchPicker } from "react-color";

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Popover,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import ColorLensIcon from "@mui/icons-material/ColorLens";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function Customization({ onClose }) {
  const [configData, setConfigData] = React.useState([]);
  const [mainColor, setMainColor] = React.useState(null);
  const [fontColor, setFontColor] = React.useState(null);
  const [logo, setLogo] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        setConfigData(config.data[0].customization);
        setMainColor(config.data[0].customization.mainColor);
        setFontColor(config.data[0].customization.fontColor);
        setLogo(config.data[0].customization.logo);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChangeCustomizationConfig = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/config/customization", {
        mainColor,
        fontColor,
        logo,
      });

      if (res.data) {
        toast.success("Configuração Alterada!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      onClose();
    } catch (err) {
      console.log("erro", err);
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
    }
  };

  return (
    <form onSubmit={handleChangeCustomizationConfig}>
      <DialogTitle>Alterando Configurações de Personalização</DialogTitle>
      {configData.length !== 0 && (
        <>
          <DialogContent>
            <Grid
              container
              sx={{ mt: 2 }}
              direction="column"
              justifyContent="center"
              alignItems="flex-start"
            >
              <Grid item sx={{ my: 1.5 }}>
                <Grid container direction="row">
                  <Typography sx={{ my: "auto" }}>Cor Principal</Typography>
                  <Tooltip
                    title={
                      <Typography sx={{ fontSize: 12 }}>
                        A cor que será utilizada no sistema. Forneça um valor
                        hexadecimal de seis caracteres. A opção padrão é
                        "#32aacd"
                      </Typography>
                    }
                  >
                    <Button
                      size="small"
                      sx={{
                        backgroundColor: "white",
                        color: "#32aacd",
                        "&:hover": {
                          backgroundColor: "white",
                        },
                      }}
                    >
                      ?
                    </Button>
                  </Tooltip>
                  <TextField
                    variant="outlined"
                    size="small"
                    value={mainColor}
                    onChange={(e) => setMainColor(e.target.value)}
                    sx={{ mx: 1, width: "25%" }}
                  />
                  <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <ColorLensIcon sx={{ fontSize: 28 }} />
                  </IconButton>
                  <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                  >
                    <SketchPicker
                      color={mainColor || "#32aacd"}
                      onChange={(color) => setMainColor(color.hex)}
                      disableAlpha
                    />
                  </Popover>
                  <Paper sx={{m:1,width:28, height:28, backgroundColor:mainColor, borderRadius:50}} />
                </Grid>
              </Grid>
              <Grid item sx={{ my: 1.5 }}>
                <Grid container direction="row">
                  <Typography sx={{ my: "auto" }}>Cor da Fonte</Typography>
                  <Tooltip
                    title={
                      <Typography sx={{ fontSize: 12 }}>
                        A cor da fonte que será utilizada na barra lateral.
                        Forneça um valor hexadecimal de seis caracteres, também
                        pode ser utilizado "black" ou "white". A opção padrão é
                        "white"
                      </Typography>
                    }
                  >
                    <Button
                      size="small"
                      sx={{
                        backgroundColor: "white",
                        color: "#32aacd",
                        "&:hover": {
                          backgroundColor: "white",
                        },
                      }}
                    >
                      ?
                    </Button>
                  </Tooltip>
                  <TextField
                    variant="outlined"
                    size="small"
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                    sx={{ mx: 1, width: "25%" }}
                  />
                  <IconButton onClick={(e) => setAnchorEl2(e.currentTarget)}>
                    <ColorLensIcon sx={{ fontSize: 28 }} />
                  </IconButton>
                  <Popover
                    open={Boolean(anchorEl2)}
                    anchorEl={anchorEl2}
                    onClose={() => setAnchorEl2(null)}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                  >
                    <SketchPicker
                      color={fontColor}
                      onChange={(color) => setFontColor(color.hex)}
                      disableAlpha
                      presetColors={["#ffffff", "#000000"]}
                    />
                  </Popover>
                  <Paper sx={{m:1,width:28, height:28, backgroundColor:fontColor, borderRadius:50}} />

                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button type="submit" variant="contained" color="success">
              OK
            </Button>
          </DialogActions>
        </>
      )}
    </form>
  );
}
