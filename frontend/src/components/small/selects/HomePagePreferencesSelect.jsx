/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { FormLabel, Grid, MenuItem, Select, Typography } from "@mui/material";

const HomePagePreferencesSelect = (props) => {
  const [selectedValue, setSelectedValue] = useState(
    props.homePagePreferences || 1
  );

  useEffect(() => {
    setSelectedValue(props.homePagePreferences || 1);
  }, [props.homePagePreferences]);

  const options = [
    { name: "Mostrar com Calendário Aberto", number: 1 },
    { name: "Mostrar com Calendário Fechado", number: 2 },
    { name: "Não Mostrar", number: 3 },
  ];

  const handleChange = (event) => {
    const value = event.target.value;
    if (props.onChangeHomePagePreferences) {
      props.onChangeHomePagePreferences(value);
    }
  };

  return (
    <>
      <FormLabel>Barra Lateral</FormLabel>
      <Select
        size="small"
        fullWidth
        value={selectedValue}
        onChange={handleChange}
        renderValue={(selected) => {
          const selectedOption = options.find(
            (option) => option.number === selected
          );
          return selectedOption ? selectedOption.name : "";
        }}
      >
        {options.map((item, index) => (
          <MenuItem value={item.number} key={index}>
            <Grid container direction="row" alignItems="center">
              <Typography sx={{ ml: 1 }}>{item.name}</Typography>
            </Grid>
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default HomePagePreferencesSelect;
