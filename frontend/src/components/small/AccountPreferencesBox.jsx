/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
  Button,
} from "@mui/material";

const AccountPreferencesBox = ({
  onUpdateDarkMode,
  onUpdateBarPosition,
  onUpdatePaletteColor,
}) => {
  const [checkedDarkMode, setCheckedDarkMode] = useState(
    JSON.parse(sessionStorage.getItem("userPreferences"))?.darkMode === true
  );
  const [checkedBarPosition, setCheckedBarPosition] = useState(
    JSON.parse(sessionStorage.getItem("userPreferences"))?.barPosition === true
  );
  const [paletteColor, setPaletteColor] = useState(
    JSON.parse(sessionStorage.getItem("userPreferences"))?.paletteColor ||
      "#000000"
  );

  useEffect(() => {
    const preferences = JSON.parse(sessionStorage.getItem("userPreferences"));

    const darkModeStored = preferences?.darkMode === true;
    const barPositionStored = preferences?.barPosition === true;
    const paletteColorStored = preferences?.paletteColor || "#000000";

    if (checkedDarkMode !== darkModeStored) {
      setCheckedDarkMode(darkModeStored);
    }

    if (checkedBarPosition !== barPositionStored) {
      setCheckedBarPosition(barPositionStored);
    }

    if (paletteColor !== paletteColorStored) {
      setPaletteColor(paletteColorStored);
    }
  }, []);

  const handleChangeDarkMode = (event) => {
    const newDarkMode = event.target.checked;
    setCheckedDarkMode(newDarkMode);

    const updatedPreferences = {
      ...JSON.parse(sessionStorage.getItem("userPreferences")),
      darkMode: newDarkMode,
    };
    sessionStorage.setItem(
      "userPreferences",
      JSON.stringify(updatedPreferences)
    );

    onUpdateDarkMode(newDarkMode);
  };

  const handleChangeBarPosition = (event) => {
    const newBarPosition = event.target.checked;
    setCheckedBarPosition(newBarPosition);

    const updatedPreferences = {
      ...JSON.parse(sessionStorage.getItem("userPreferences")),
      barPosition: newBarPosition,
    };
    sessionStorage.setItem(
      "userPreferences",
      JSON.stringify(updatedPreferences)
    );

    onUpdateBarPosition(newBarPosition);
  };

  const handlePaletteColorChange = (color) => {
    setPaletteColor(color);

    const updatedPreferences = {
      ...JSON.parse(sessionStorage.getItem("userPreferences")),
      paletteColor: color,
    };
    sessionStorage.setItem(
      "userPreferences",
      JSON.stringify(updatedPreferences)
    );

    onUpdatePaletteColor(color);
  };

  const availableColors = checkedDarkMode
    ? ["#0D0D0D", "#1A1A1A", "#333333", "#4D4D4D", "#666666"] // Cores para o tema escuro (tons de preto/cinza)
    : ["#FFFFFF", "#F8F8FF", "#F5F5F5", "#E0E0E0", "#CCCCCC"]; // Cores para o tema claro (tons de branco/cinza)

  return (
    <Grid
      container
      sx={{ mt: 1, width: 250 }}
      direction="column"
      alignContent="center"
      justifyContent="center"
      rowSpacing={2}
    >
      <Accordion sx={{ width: "100%" }}>
        <AccordionSummary>
          <Typography sx={{ fontSize: 16 }}>Tema</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControlLabel
            labelPlacement="start"
            label={checkedDarkMode ? "Modo Escuro" : "Modo Claro"}
            control={
              <Switch
                checked={checkedDarkMode}
                onChange={handleChangeDarkMode}
              />
            }
          />
          <Typography sx={{ mt: 2 }}>Escolha a Cor Principal:</Typography>
          <Grid container spacing={1} sx={{ mt: 1 }}>
            {availableColors.map((color) => (
              <Grid item key={color}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: color,
                    width: 36,
                    height: 36,
                    minWidth: 36,
                    border:
                      paletteColor === color ? "2px solid #0000FF" : "none",
                    "&:hover": {
                      backgroundColor: color,
                    },
                  }}
                  onClick={() => handlePaletteColorChange(color)}
                />
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ width: "100%", mt: 1 }}>
        <AccordionSummary>
          <Typography sx={{ fontSize: 16 }}>Barra de Ferramentas</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControlLabel
            labelPlacement="start"
            label={`Barra ${checkedBarPosition ? "Superior" : "Lateral"}`}
            control={
              <Switch
                checked={checkedBarPosition}
                onChange={handleChangeBarPosition}
              />
            }
          />
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};

export default AccountPreferencesBox;
