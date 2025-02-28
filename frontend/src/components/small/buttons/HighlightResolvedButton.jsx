/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import * as React from "react";

import { Grid2, Tooltip } from "@mui/material";

import { icons } from "../../../icons";

export default function HighlightResolvedButton({
  highlightResolved,
  setHighlightResolved,
  mainColor,
}) {
  return (
    <Grid2
      container
      direction="row"
      alignItems="center"
      justifyContent="center"
      onClick={() => {
        setHighlightResolved(!highlightResolved);
      }}
      sx={{
        cursor: "pointer",
        width: 50,
        mr: 1,
        border: `0.5px solid ${mainColor ? mainColor : "#32aacd"}`,
        borderRadius: 3,
        backgroundColor: highlightResolved ? mainColor : "",
      }}
    >
      <Tooltip
        title={
          highlightResolved
            ? "Ocultar Itens Resolvidos"
            : "Mostrar Itens Resolvidos"
        }
      >
        <icons.CheckIcon
          sx={{
            p: 0.5,
            color: highlightResolved ? "" : mainColor,
          }}
        />
      </Tooltip>
    </Grid2>
  );
}
