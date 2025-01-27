/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Button,
} from "@mui/material";

const FontFamilySelect = ({ currentFont, selectedFont, onChangeFont }) => {
  const fontOptions = [
    { name: "Arial", value: "Arial, sans-serif" },
    { name: "Verdana", value: "Verdana, sans-serif" },
    { name: "Tahoma", value: "Tahoma, sans-serif" },
    { name: "Trebuchet MS", value: "Trebuchet MS, sans-serif" },
    { name: "Georgia", value: "Georgia, serif" },
    { name: "Times New Roman", value: "Times New Roman, serif" },
    { name: "Courier New", value: "Courier New, monospace" },
    { name: "Lucida Console", value: "Lucida Console, monospace" },
  ];

  return (
    <>
      <Typography sx={{ fontSize: 14, fontFamily: currentFont, mt: -2, mb: 1 }}>
        Atual: {currentFont}
      </Typography>
      <FormControl fullWidth>
        <InputLabel id="font-family-select-label">Nova Fonte</InputLabel>
        <Select
          labelId="font-family-select-label"
          value={selectedFont}
          onChange={(e) => onChangeFont(e.target.value)}
          label="Nova Fonte"
        >
          {fontOptions.map((font) => (
            <MenuItem
              key={font.value}
              value={font.value}
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
