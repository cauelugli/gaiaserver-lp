/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid2, MenuItem, Select, Typography } from "@mui/material";

import { icons } from "../../../icons";

const api = axios.create({
  baseURL: "/api",
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
    { name: "Compacto", icon: <icons.ViewCompactIcon /> },
    { name: "Chip", icon: <icons.HomeMaxIcon /> },
    { name: "Avatar", icon: <icons.AccountCircleIcon /> },
    { name: "Tabela", icon: <icons.TableRowsIcon /> },
    { name: "Nuvem", icon: <icons.CloudQueueIcon /> },
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
            <Grid2 container direction="row" alignItems="center">
              {selectedOption.icon}
              <Typography sx={{ ml: 1 }}>{selected}</Typography>
            </Grid2>
          );
        }
        return "";
      }}
    >
      {options.map((item) => (
        <MenuItem value={item.name} key={item.name}>
          <Grid2 container direction="row" alignItems="center">
            {item.icon}
            <Typography sx={{ ml: 1 }}>{item.name}</Typography>
          </Grid2>
        </MenuItem>
      ))}
    </Select>
  );
};

export default HomePageLayoutSelect;
