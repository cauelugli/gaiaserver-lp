/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  FormLabel,
} from "@mui/material";

import WebFont from "webfontloader";

const FontFamilySelect = ({
  fontFamilyTitle = { name: "Arial", value: "Arial, sans-serif" }, // Valor padrão
  onChangeFontTitle,
  fontFamilyRest = { name: "Verdana", value: "Verdana, sans-serif" }, // Valor padrão
  onChangeFontRest,
}) => {
  const fontOptions = [
    { name: "Arial", value: "Arial, sans-serif" },
    { name: "Verdana", value: "Verdana, sans-serif" },
    { name: "Tahoma", value: "Tahoma, sans-serif" },
    { name: "Georgia", value: "Georgia, serif" },
    { name: "Times New Roman", value: "Times New Roman, serif" },
    { name: "Courier New", value: "Courier New, monospace" },
    { name: "Lucida Console", value: "Lucida Console, monospace" },
  ];

  const additionalFontOptions = [
    { name: "Pacifico", value: "Pacifico, cursive" },
    { name: "Lobster", value: "Lobster, cursive" },
    { name: "Righteous", value: "Righteous, sans-serif" },
    { name: "Cinzel", value: "Cinzel, serif" },
    { name: "Dancing Script", value: "Dancing Script, cursive" },
    { name: "Abril Fatface", value: "Abril Fatface, serif" },
    { name: "Zilla Slab", value: "Zilla Slab, serif" },
    { name: "Anton", value: "Anton, sans-serif" },
  ];

  WebFont.load({
    google: {
      families: additionalFontOptions.map((font) => font.name),
    },
  });

  return (
    <>
      <FormControl fullWidth>
        <FormLabel>Títulos</FormLabel>
        <Select
          value={fontFamilyTitle}
          onChange={(e) => onChangeFontTitle(e.target.value)}
          size="small"
          renderValue={(selected) =>
            selected ? (
              <Typography sx={{ fontSize: 18, fontFamily: selected.value }}>
                {selected.name}
              </Typography>
            ) : (
              <Typography>{fontFamilyTitle?.name}</Typography>
            )
          }
        >
          <InputLabel sx={{ ml: 1, fontSize: 13 }}>Nativas</InputLabel>
          {fontOptions.map((font, index) => (
            <MenuItem
              key={index}
              value={font}
              style={{ fontFamily: font.value }}
            >
              {font.name}
            </MenuItem>
          ))}
          <InputLabel sx={{ ml: 1, fontSize: 13 }}>Adicionais</InputLabel>
          {additionalFontOptions.map((font, index) => (
            <MenuItem
              key={index}
              value={font}
              style={{ fontFamily: font.value }}
            >
              {font.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mt: 1 }}>
        <FormLabel>Restante</FormLabel>
        <Select
          value={fontFamilyRest}
          onChange={(e) => onChangeFontRest(e.target.value)}
          size="small"
          renderValue={(selected) =>
            selected ? (
              <Typography sx={{ fontSize: 18, fontFamily: selected.value }}>
                {selected.name}
              </Typography>
            ) : (
              <Typography>{fontFamilyRest?.name}</Typography>
            )
          }
        >
          <InputLabel sx={{ ml: 1, fontSize: 13 }}>Nativas</InputLabel>
          {fontOptions.map((font, index) => (
            <MenuItem
              key={index}
              value={font}
              style={{ fontFamily: font.value }}
            >
              {font.name}
            </MenuItem>
          ))}
          <InputLabel sx={{ ml: 1, fontSize: 13 }}>Adicionais</InputLabel>
          {additionalFontOptions.map((font, index) => (
            <MenuItem
              key={index}
              value={font}
              style={{ fontFamily: font.value }}
            >
              {font.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default FontFamilySelect;
