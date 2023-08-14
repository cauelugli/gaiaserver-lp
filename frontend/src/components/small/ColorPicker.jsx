/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

import { Popover, Typography } from "@mui/material";

import { CirclePicker } from "react-color";

const ColorPicker = ({
  handleClickColor,
  color,
  colorAnchorEl,
  handleCloseColor,
  handleChangeColor,
}) => {
  const colors = [
    "#ff0000",
    "#ff3300",
    "#ff6600",
    "#ff6600",
    "#ff9900",
    "#ffcc00",
    "#ffcc00",
    "#ffff00",
    "#ffff66",
    "#66ff00",
    "#99ff00",
    "#ccff00",
    "#00ccff",
    "#0066ff",
    "#0000ff",
    "#6600ff",
    "#9900ff",
    "#cc00ff",
    "#cc00cc",
    "#cc66ff",
    "#9900cc",
    "#888",
    "#aaa",
    "#bbb",
  ];

  return (
    <>
      <div onClick={handleClickColor}>
        <div
          style={{
            width: "50px",
            height: "50px",
            border: "2px solid lightgrey",
            borderRadius: "30%",
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
