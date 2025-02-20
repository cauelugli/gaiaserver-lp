/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import * as React from "react";

import { Grid2, Tooltip } from "@mui/material";

import { icons } from "../../../icons";

export default function HighlightSelfUserButton({
  highlightSelfUser,
  setHighlightSelfUser,
  mainColor,
}) {
  return (
    <Grid2
      container
      direction="row"
      alignItems="center"
      justifyContent="center"
      onClick={() => {
        setHighlightSelfUser(!highlightSelfUser);
      }}
      sx={{
        cursor: "pointer",
        width: 50,
        mr: 1,
        border: `0.5px solid ${mainColor ? mainColor : "#32aacd"}`,
        borderRadius: 3,
        backgroundColor: highlightSelfUser ? mainColor : "",
      }}
    >
      <Tooltip title={"Mostrar Somente Atribuidos à Mim"}>
        <icons.PersonIcon
          sx={{
            p: 0.5,
            color: highlightSelfUser ? "" : mainColor,
          }}
        />
      </Tooltip>
    </Grid2>
  );
}
