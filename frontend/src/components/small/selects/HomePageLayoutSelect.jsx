/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid, MenuItem, Select, Typography } from "@mui/material";

import { icons } from "../../../icons";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const HomePageLayoutSelect = (props) => {
  const [selectedValue, setSelectedValue] = useState(
    props.homePageLayout || ""
  );

  useEffect(() => {
    setSelectedValue(props.homePageLayout || "");
  }, [props.homePageLayout]);

  const options = [
    { name: "Padrão", icon: <icons.GridViewIcon /> },
    { name: "Avatar", icon: <icons.AccountCircleIcon /> },
    { name: "Compacto", icon: <icons.TableRowsIcon /> },
    { name: "Carrossel", icon: <icons.ViewCarouselIcon /> },
  ];

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
    if (props.onChangeHomePageLayout) {
      props.onChangeHomePageLayout(value);
    }
  };

  return (
    <Select
      size="small"
      fullWidth
      value={selectedValue}
      onChange={handleChange}
      renderValue={(selected) => {
        if (selected) {
          const selectedOption = options.find(
            (option) => option.name === selected
          );
          return (
            <Grid container direction="row" alignItems="center">
              {selectedOption.icon}
              <Typography sx={{ ml: 1 }}>{selected}</Typography>
            </Grid>
          );
        }
        return "";
      }}
    >
      {options.map((item) => (
        <MenuItem value={item.name} key={item.name}>
          <Grid container direction="row" alignItems="center">
            {item.icon}
            <Typography sx={{ ml: 1 }}>{item.name}</Typography>
          </Grid>
        </MenuItem>
      ))}
    </Select>
  );
};

export default HomePageLayoutSelect;
