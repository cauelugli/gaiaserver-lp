/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

import { Popover, Typography } from "@mui/material";

import { CirclePicker } from "react-color";

const ColorPicker = ({handleClickColor, color, colorAnchorEl, handleCloseColor, handleChangeColor}) => {
  const colors = [
    "#FF0000",
    "#FF4500",
    "#FFA500",
    "#FFFF00",
    "#ADFF2F",
    "#00FF00",
    "#00FF7F",
    "#00CED1",
    "#00BFFF",
    "#0000FF",
    "#8A2BE2",
    "#FF00FF",
    "#FF1493",
    "#FF69B4",
    "#FFC0CB",
    "#FFD700",
    "#FF8C00",
    "#FF6347",
    "#CD5C5C",
    "#F08080",
    "#FA8072",
    "#E9967A",
    "#DC143C",
    "#B22222",
    "#8B0000",
    "#808000",
    "#556B2F",
    "#6B8E23",
    "#808000",
    "#2E8B57",
    "#3CB371",
    "#20B2AA",
    "#5F9EA0",
    "#4682B4",
    "#87CEEB",
    "#1E90FF",
    "#6495ED",
    "#0000CD",
    "#8A2BE2",
    "#9400D3",
    "#9932CC",
    "#8A2BE2",
    "#BA55D3",
    "#FF00FF",
    "#FF1493",
    "#FF69B4",
    "#FFC0CB",
    "#FFD700",
    "#FF8C00",
    "#FF6347",
    "#DC143C",
    "#B22222",
    "#8B0000",
    "#CD5C5C",
    "#F08080",
    "#FA8072",
    "#E9967A",
    "#FF4500",
    "#FF6347",
    "#FFA500",
    "#FFD700",
    "#FFFF00",
    "#ADFF2F",
    "#7CFC00",
    "#32CD32",
    "#00FF7F",
    "#00FF00",
    "#00FA9A",
    "#00CED1",
    "#00BFFF",
    "#1E90FF",
    "#4682B4",
    "#8A2BE2",
    "#FF00FF",
    "#FF1493",
    "#FF69B4",
    "#FFC0CB",
  ];
  return (
    <>
      <Typography>Cor</Typography>
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
