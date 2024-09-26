/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import { Avatar, Grid, MenuItem, Select, Typography } from "@mui/material";

import { checkAvailability } from "../../../../controllers/functions/overallFunctions";

const ManagerSelectTableCell = (props) => {
  const [options, setOptions] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        let data = [];
        const resManagers = await api.get("/get", {
          params: { model: "User" },
        });
        data = resManagers.data.filter((user) => user.isManager);
        setOptions(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [props.field.dynamicData]);

  const renderValue = (selected) => {
    if (!selected) {
      return "";
    } else {
      return (
        <Grid container direction="row" alignItems="center">
          <Avatar
            alt="Imagem"
            src={`http://localhost:3000/static/${selected.image}`}
            sx={{ width: 24, height: 24, marginRight: 2 }}
          />
          <Typography sx={{ fontSize: 13 }}>{selected.name}</Typography>
        </Grid>
      );
    }
  };

  return (
    <Select
      value={
        props.fromConfig
          ? props.requestsApproverManager
            ? props.requestsApproverManager
            : ""
          : props.fields[props.field.name]
      }
      onChange={
        props.fromConfig
          ? (e) => props.setRequestsApproverManager(e.target.value)
          : props.handleChange(props.field.name)
      }
      sx={{
        width: 200,
        minWidth: 175,
      }}
      size="small"
      renderValue={renderValue}
    >
      {options.map((option, index) => (
        <MenuItem
          value={option}
          key={index}
          disabled={
            props.fromConfig ? "" : checkAvailability("manager", option)
          }
        >
          <Grid container direction="row" alignItems="center">
            <Avatar
              alt="Imagem"
              src={`http://localhost:3000/static/${option.image}`}
              sx={{ width: 24, height: 24, marginRight: 2 }}
            />
            <Typography sx={{ fontSize: 13 }}>{option.name}</Typography>
          </Grid>
        </MenuItem>
      ))}
    </Select>
  );
};

export default ManagerSelectTableCell;
