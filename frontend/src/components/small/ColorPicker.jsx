/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Popover, Typography } from "@mui/material";
import { CirclePicker } from "react-color";
import colors from '../../options/colorList';

const ColorPicker = ({ fields, field, handleChange, required }) => {
  const [color, setColor] = useState(fields[field.name] || "#fff");
  const [colorAnchorEl, setColorAnchorEl] = useState(null);

  const handleClickColor = (event) => {
    setColorAnchorEl(event.currentTarget);
  };

  const handleCloseColor = () => {
    setColorAnchorEl(null);
  };

  const handleChangeColor = (color) => {
    setColor(color.hex);
    handleChange(field.name)({ target: { value: color.hex } });
  };

  return (
    <>
      <div onClick={handleClickColor}>
        <div
          style={{
            width: "38px",
            height: "38px",
            border: "2px solid lightgrey",
            borderRadius: "30%",
            backgroundColor: color,
            cursor: "pointer",
          }}
        />
      </div>
      <Popover
        open={Boolean(colorAnchorEl)}
        anchorEl={colorAnchorEl}
        onClose={handleCloseColor}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <CirclePicker
          colors={colors}
          color={color}
          onChange={handleChangeColor}
          styles={{
            default: {
              card: {
                padding: "25px",
              },
            },
          }}
        />
      </Popover>
      {required && !color && (
        <Typography color="error">Este campo é obrigatório</Typography>
      )}
    </>
  );
};

export default ColorPicker;
