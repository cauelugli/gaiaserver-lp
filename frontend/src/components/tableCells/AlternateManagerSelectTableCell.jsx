/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import {
  Avatar,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

import { checkAvailability } from "../../../../controllers/functions/overallFunctions";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const AlternateManagerSelectTableCell = (props) => {
  const [options, setOptions] = React.useState([]);
  const [selectedAlternate, setSelectedAlternate] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const resManagers = await api.get("/get", {
          params: { model: "User" },
        });
        const filteredUsers = resManagers.data.filter(
          (user) => user._id !== props.requestsApproverManager._id
        );
        setOptions(filteredUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [props]);

  const renderValue = (selected) => {
    if (!selected || props.requestsApproverAlternate === "none") {
      return (
        <Grid container direction="row" alignItems="center">
          <Avatar sx={{ width: 24, height: 24, marginRight: 2 }} />
          <Typography sx={{ fontSize: 13 }}>Nenhum</Typography>
        </Grid>
      );
    } else if (selected === "none") {
      return (
        <Grid container direction="row" alignItems="center">
          <Avatar sx={{ width: 24, height: 24, marginRight: 2 }} />
          <Typography sx={{ fontSize: 13 }}>Nenhum</Typography>
        </Grid>
      );
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

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedAlternate(value);

    if (props.fromConfig) {
      props.setRequestsApproverAlternate(value || "none");
    } else {
      props.handleChange(props.field.name)(event);
    }
  };

  return (
    <Grid>
      <InputLabel>{props.field.label}</InputLabel>
      <Select
        value={
          props.fromConfig
            ? props.requestsApproverAlternate
              ? props.requestsApproverAlternate
              : selectedAlternate
            : selectedAlternate
        }
        onChange={handleChange}
        sx={{
          width: 200,
          minWidth: 175,
        }}
        size="small"
        renderValue={renderValue}
      >
        <MenuItem value={"none"}>
          <Grid container direction="row" alignItems="center">
            <Avatar sx={{ width: 24, height: 24, marginRight: 2 }} />
            <Typography sx={{ fontSize: 13 }}>Nenhum</Typography>
          </Grid>
        </MenuItem>
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
    </Grid>
  );
};

export default AlternateManagerSelectTableCell;
