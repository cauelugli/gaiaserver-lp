/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
  Grid2,
  Switch,
  Typography,
  Button,
} from "@mui/material";
import FontFamilySelect from "./selects/FontFamilySelect";
import HomePageLayoutSelect from "./selects/HomePageLayoutSelect";

import { icons } from "../../icons";
import HomePagePreferencesSelect from "./selects/HomePagePreferencesSelect";

const AccountPreferencesBox = (props) => {
  const [checkedDarkMode, setCheckedDarkMode] = useState(props.darkMode);
  const [checkedBarPosition, setCheckedBarPosition] = useState(
    props.barPosition
  );
  const [paletteColor, setPaletteColor] = useState(props.paletteColor);
  const [fontFamilyTitle, setFontFamilyTitle] = useState(props.fontFamilyTitle);
  const [fontFamilyRest, setFontFamilyRest] = useState(props.fontFamilyRest);

  const [homePageLayout, setHomePageLayout] = useState(props.homePageLayout);
  const [homePagePreferences, setHomePagePreferences] = useState(props.homePagePreferences);

  React.useEffect(() => {
    setCheckedDarkMode(props.darkMode);
    setPaletteColor(props.paletteColor);
    setCheckedBarPosition(props.barPosition);
    setFontFamilyTitle(props.fontFamilyTitle);
    setFontFamilyRest(props.fontFamilyRest);
    setHomePageLayout(props.homePageLayout);
    setHomePagePreferences(props.homePagePreferences);
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

  const handleHomePageLayoutChange = (homePageLayout) => {
    setHomePageLayout(homePageLayout);
    props.onUpdateHomePageLayout(homePageLayout);
  };
  
  const handleHomePagePreferencesChange = (homePagePreferences) => {
    setHomePagePreferences(homePagePreferences);
    props.onUpdateHomePagePreferences(homePagePreferences);
  };

  const availableColors = checkedDarkMode
    ? ["#0D0D0D", "#1A1A1A", "#333333", "#4D4D4D", "#666666"] // escuro
    : ["#FFFFFF", "#F8F8FF", "#F5F5F5", "#E0E0E0", "#CCCCCC"]; // claro

  return (
    <Grid2
      container
      sx={{ mt: 1, width: 250 }}
      direction="column"
      alignContent="center"
      justifyContent="center"
      rowSpacing={2}
    >
      <Accordion sx={{ width: "100%" }}>
        <AccordionSummary>
          <icons.PaletteIcon />
          <Typography sx={{ fontSize: 16, ml: 1 }}>Tema</Typography>
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
          <Grid2 container spacing={1} sx={{ mt: 1 }}>
            {availableColors.map((color) => (
              <Grid2 item key={color}>
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
              </Grid2>
            ))}
          </Grid2>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ width: "100%", mt: 1 }}>
        <AccordionSummary>
          <icons.AbcIcon />
          <Typography sx={{ fontSize: 16, ml: 1 }}>Fonte</Typography>
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
          <icons.WebAssetIcon />
          <Typography sx={{ fontSize: 16, ml: 1 }}>Posição da Barra</Typography>
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

      <Accordion sx={{ width: "100%", mt: 1 }}>
        <AccordionSummary>
          <icons.ListIcon />
          <Typography sx={{ fontSize: 16, ml: 1 }}>Home Page</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <HomePagePreferencesSelect
            homePagePreferences={homePagePreferences}
            onChangeHomePagePreferences={handleHomePagePreferencesChange}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ width: "100%", mt: 1 }}>
        <AccordionSummary>
          <icons.AppsIcon />
          <Typography sx={{ fontSize: 16, ml: 1 }}>Layout Home Page</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <HomePageLayoutSelect
            homePageLayout={homePageLayout}
            onChangeHomePageLayout={handleHomePageLayoutChange}
          />
        </AccordionDetails>
      </Accordion>


    </Grid2>
  );
};

export default AccountPreferencesBox;
