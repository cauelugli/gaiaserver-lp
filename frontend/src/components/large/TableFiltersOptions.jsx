/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Grid,
  Chip,
  Typography,
  Paper,
  TextField,
  Popper,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";

function TableFiltersBar({
  tableColumns,
  mainColor,
  tableFilters,
  setTableFilters,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openFilter, setOpenFilter] = useState(null);
  const [filterValue, setFilterValue] = useState("");

  const handleOpenFilter = (event, column) => {
    setAnchorEl(event.currentTarget);
    setOpenFilter(column);
    setFilterValue(tableFilters[column.id] || "");
  };

  const handleApplyFilter = () => {
    setTableFilters((prevFilters) => ({
      ...prevFilters,
      [openFilter.id]: filterValue,
    }));
    setOpenFilter(null);
    setAnchorEl(null);
    setFilterValue("");
  };

  const handleClose = () => {
    setOpenFilter(null);
    setAnchorEl(null);
    setFilterValue("");
  };

  const availableColumns = tableColumns.filter(
    (column) => !(column.id in tableFilters && tableFilters[column.id])
  );

  return (
    <Grid
      container
      spacing={1}
      alignItems="center"
      justifyContent="flex-start"
      sx={{ width:"auto" }}
    >
      {availableColumns.map(
        (column, index) =>
          index !== 0 && (
            <Grid item key={index} sx={{ cursor: "pointer" }}>
              <Chip
                label={column.label}
                size="small"
                variant="contained"
                onClick={(event) => handleOpenFilter(event, column)}
                sx={{
                  background: mainColor,
                  "&:hover": {
                    backgroundColor: "lightgrey",
                  },
                }}
              />
              <Popper
                open={openFilter && openFilter.id === column.id}
                anchorEl={anchorEl}
                placement="bottom-start"
                disablePortal={false}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    mt: 1,
                    minWidth: 200,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <TextField
                    label={`${column.label}`}
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    size="small"
                    variant="outlined"
                  />
                  <Grid
                    container
                    spacing={1}
                    justifyContent="flex-end"
                    sx={{ mt: 1 }}
                  >
                    <CheckIcon
                      onClick={handleApplyFilter}
                      color="success"
                      sx={{ cursor: "pointer", mr: 2 }}
                    />
                    <CancelIcon
                      onClick={handleClose}
                      color="error"
                      sx={{ cursor: "pointer" }}
                    />
                  </Grid>
                </Paper>
              </Popper>
            </Grid>
          )
      )}
    </Grid>
  );
}

export default TableFiltersBar;
