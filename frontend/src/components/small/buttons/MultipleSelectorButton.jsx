/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";

import { Button } from "@mui/material";

import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

const MultipleSelectorButton = (props) => {
  return (
    <Button
      size="small"
      variant="outlined"
      sx={{
        mr: 1,
        backgroundColor: props.multiple ? props.mainColor : "none",
        border: `0.5px solid ${props.mainColor}`,
        borderRadius: 3,
        "&:hover": {
          backgroundColor: "none",
          border: `0.5px solid ${props.mainColor}`,
        },
      }}
      onClick={() => props.setMultiple(!props.multiple)}
    >
      {props.multiple ? (
        <CheckBoxIcon />
      ) : (
        <CheckBoxOutlineBlankIcon sx={{ color: props.mainColor }} />
      )}
    </Button>
  );
};

export default MultipleSelectorButton;
