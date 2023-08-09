/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

import { Popover, Typography } from "@mui/material";

import { CirclePicker } from "react-color";

const ColorPicker = ({handleClickColor, color, colorAnchorEl, handleCloseColor, handleChangeColor}) => {
  return (
    <>
      <Typography>Cor</Typography>
      <div onClick={handleClickColor}>
        <div
          style={{
            width: "30px",
            height: "30px",
            border: "1px solid lightgrey",
            borderRadius: "50%",
            backgroundColor: color,
            cursor: "pointer",
          }}
        ></div>
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
          color={color}
          onChange={handleChangeColor}
          styles={{
            default: {
              card: {
                padding: "10px",
              },
            },
          }}
        />
      </Popover>
    </>
  );
};

export default ColorPicker;
