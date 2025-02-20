/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import {
  Avatar,
  Grid2,
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
  const [selectedAlternate, setSelectedAlternate] = React.useState(
    props.fromConfig
      ? props.type === "requests"
        ? props.requestsApproverAlternate
        : props.type === "stock"
        ? props.stockEntriesApproverAlternate
        : ""
      : null
  );

  React.useEffect(() => {
    if (props.fromConfig) {
      if (props.type === "requests") {
        setSelectedAlternate(props.requestsApproverAlternate || "none");
      } else if (props.type === "stock") {
        setSelectedAlternate(props.stockEntriesApproverAlternate || "none");
      }
    }
  }, [
    props.fromConfig,
    props.type,
    props.requestsApproverAlternate,
    props.stockEntriesApproverAlternate,
  ]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const resUsers = await api.get("/get", {
          params: { model: "User" },
        });
        const filteredUsers = props.approverManager
          ? resUsers.data.filter(
              (user) => user._id !== props.approverManager._id
            )
          : resUsers.data;
        setOptions(filteredUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [props]);

  const renderValue = (selected) => {
    if (!selected || selected === "none") {
      return (
        <Grid2 container direction="row" alignItems="center">
          <Avatar sx={{ width: 24, height: 24, marginRight: 2 }} />
          <Typography sx={{ fontSize: 13 }}>Nenhum</Typography>
        </Grid2>
      );
    } else {
      return (
        <Grid2 container direction="row" alignItems="center">
          <Avatar
            alt="Imagem"
            src={`http://localhost:3000/static/${selected.image}`}
            sx={{ width: 24, height: 24, marginRight: 2 }}
          />
          <Typography sx={{ fontSize: 13 }}>{selected.name}</Typography>
        </Grid2>
      );
    }
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedAlternate(value); // Atualiza o estado local
    if (props.fromConfig) {
      if (props.type === "requests") {
        props.setRequestsApproverAlternate(value || "none");
      }
      if (props.type === "stock") {
        props.setStockEntriesApproverAlternate(value || "none");
      }
    } else {
      props.handleChange(props.field.name)(event);
    }
  };

  return (
    <Grid2>
      <InputLabel>{props.field.label}</InputLabel>
      <Select
        value={selectedAlternate || "none"} // Garante que o valor nunca seja undefined
        onChange={handleChange}
        sx={{
          width: 200,
          minWidth: 175,
        }}
        size="small"
        renderValue={renderValue}
      >
        <MenuItem value={"none"}>
          <Grid2 container direction="row" alignItems="center">
            <Avatar sx={{ width: 24, height: 24, marginRight: 2 }} />
            <Typography sx={{ fontSize: 13 }}>Nenhum</Typography>
          </Grid2>
        </MenuItem>
        {options.map((option, index) => (
          <MenuItem
            value={option}
            key={index}
            disabled={
              props.fromConfig ? "" : checkAvailability("manager", option)
            }
          >
            <Grid2 container direction="row" alignItems="center">
              <Avatar
                alt="Imagem"
                src={`http://localhost:3000/static/${option.image}`}
                sx={{ width: 24, height: 24, marginRight: 2 }}
              />
              <Typography sx={{ fontSize: 13 }}>{option.name}</Typography>
            </Grid2>
          </MenuItem>
        ))}
      </Select>
    </Grid2>
  );
};

export default AlternateManagerSelectTableCell;
