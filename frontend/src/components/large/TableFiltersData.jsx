/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

import { Grid2, Chip } from "@mui/material";

import { icons } from "../../icons";

function TableFilteredDataBar({ tableFilters, setTableFilters, tableColumns }) {
  const getLabelByKey = (key) => {
    const column = tableColumns.find((col) => col.id === key);
    return column ? column.label : key;
  };

  return (
    <Grid2
      container
      spacing={1}
      alignItems="center"
      justifyContent="flex-start"
      sx={{ width: "auto", ml: 0.5 }}
    >
      {Object.entries(tableFilters).map(([key, value], index) => (
        <Grid2 item key={index} sx={{ cursor: "pointer" }}>
          <Chip
            label={`${getLabelByKey(key)}: ${value}`}
            variant="contained"
            sx={{
              background: "grey",
            }}
            onDelete={() => {
              setTableFilters((prevFilters) => {
                const { [key]: removed, ...rest } = prevFilters;
                return rest;
              });
            }}
            deleteIcon={<icons.CancelIcon />}
          />
        </Grid2>
      ))}
    </Grid2>
  );
}

export default TableFilteredDataBar;
