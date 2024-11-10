/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { InputLabel, Popover } from "@mui/material";
import { CirclePicker } from "react-color";
import colors from "../../options/colorList";

const ColorPicker = ({ prevColor, fields, field, handleChange }) => {
  const [color, setColor] = useState(
    prevColor ? prevColor : fields[field.name] || "#fff"
  );
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
      <InputLabel>Cor</InputLabel>
      <div onClick={handleClickColor}>
        <div
          style={{
            width: "36px",
            height: "36px",
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
    </>
  );
};

export default ColorPicker;
