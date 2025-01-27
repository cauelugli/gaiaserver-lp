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
import FontFamilySelect from "./selects/FontFamilySelect";

const AccountPreferencesBox = (props) => {
  const [checkedDarkMode, setCheckedDarkMode] = useState(props.darkMode);
  const [checkedBarPosition, setCheckedBarPosition] = useState(
    props.barPosition
  );
  const [paletteColor, setPaletteColor] = useState(props.paletteColor);
  const [fontFamilyTitle, setFontFamilyTitle] = useState(props.fontFamilyTitle);
  const [fontFamilyRest, setFontFamilyRest] = useState(props.fontFamilyRest);

  React.useEffect(() => {
    setCheckedDarkMode(props.darkMode);
    setPaletteColor(props.paletteColor);
    setCheckedBarPosition(props.barPosition);
    setFontFamilyTitle(props.fontFamilyTitle);
    setFontFamilyRest(props.fontFamilyRest);
  }, [props]);

  const handleChangeDarkMode = (event) => {
    const newDarkMode = event.target.checked;
    props.onUpdateDarkMode(newDarkMode);
  };

  const handleChangeBarPosition = (event) => {
    const newBarPosition = event.target.checked;
    props.onUpdateBarPosition(newBarPosition);
  };

  const handlePaletteColorChange = (color) => {
    setPaletteColor(color);
    props.onUpdatePaletteColor(color);
  };

  const handleFontTitleChange = (font) => {
    setFontFamilyTitle(font);
    props.setFontFamilyTitle(font);
  };

  const handleFontRestChange = (font) => {
    setFontFamilyRest(font);
    props.setFontFamilyRest(font);
  };

  const availableColors = checkedDarkMode
    ? ["#0D0D0D", "#1A1A1A", "#333333", "#4D4D4D", "#666666"] // escuro
    : ["#FFFFFF", "#F8F8FF", "#F5F5F5", "#E0E0E0", "#CCCCCC"]; // claro

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
          <Typography sx={{ mt: 2 }}>Tom do Plano de Fundo</Typography>
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
          <Typography sx={{ fontSize: 16 }}>Fonte</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FontFamilySelect
            fontFamilyTitle={fontFamilyTitle}
            onChangeFontTitle={handleFontTitleChange}
            fontFamilyRest={fontFamilyRest}
            onChangeFontRest={handleFontRestChange}
          />
          <Button
            type="submit"
            variant="contained"
            color="success"
            size="small"
            sx={{ ml: "70%", mt: 2 }}
            onClick={() =>
              props.handleUpdateFontFamily(fontFamilyTitle, fontFamilyRest)
            }
          >
            OK
          </Button>
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
