/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

import {
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const TableFilters = ({
  searchValue,
  setSearchValue,
  searchOption,
  setSearchOption,
  searchOptionList,
  searchOptionLabel,
  setSearchOptionLabel,
  handleSearchChange,
}) => {
  return (
    <Grid container direction="row" justifyContent="flex-start">
      <Grid item>
        <TextField
          placeholder={`Pesquise por ${searchOptionLabel}...`}
          size="small"
          variant="standard"
          sx={{ my: 1, ml: "2%", width: 230 }}
          value={searchValue}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ mb: 1, ml: 1, mr:-0.5 }} />
              </InputAdornment>
            ),
            endAdornment:
              searchValue.length > 0 ? (
                <InputAdornment position="end">
                  <ClearIcon
                    cursor="pointer"
                    sx={{ color: "#d21404" }}
                    onClick={() => setSearchValue("")}
                  />
                </InputAdornment>
              ) : (
                ""
              ),
          }}
        />
      </Grid>

      <Grid item sx={{ ml: "3%", mb: 1 }}>
        <Select
          value={searchOption}
          onChange={(e) => {
            setSearchOption(e.target.value),
              setSearchOptionLabel(e.explicitOriginalTarget.innerText);
          }}
          size="small"
          sx={{ minWidth: 180, color: "#777" }}
          renderValue={() => <Typography>Filtrar por</Typography>}
        >
          {searchOptionList.options.map((option) => (
            <MenuItem key value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </Grid>

    </Grid>
  );
};

export default TableFilters;
