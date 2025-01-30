/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import * as React from "react";

import { Grid, Tooltip } from "@mui/material";

import { icons } from "../../../icons";

export default function HighlightArchivedButton({
  highlightArchived,
  setHighlightArchived,
  mainColor,
}) {
  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="center"
      onClick={() => {
        setHighlightArchived(!highlightArchived);
      }}
      sx={{
        cursor: "pointer",
        width: 50,
        mr: 1,
        border: `0.5px solid ${mainColor ? mainColor : "#32aacd"}`,
        borderRadius: 3,
        backgroundColor: highlightArchived ? mainColor : "",
      }}
    >
      <Tooltip
        title={
          highlightArchived
            ? "Ocultar Itens Arquivados"
            : "Mostrar Itens Arquivados"
        }
      >
        <icons.ArchiveIcon
          sx={{
            p: 0.5,
            color: highlightArchived ? "" : mainColor,
          }}
        />
      </Tooltip>
    </Grid>
  );
}
