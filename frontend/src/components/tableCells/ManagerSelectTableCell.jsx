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

const ManagerSelectTableCell = (props) => {
  const [options, setOptions] = React.useState([]);
  const [selectedManager, setSelectedManager] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const resManagers = await api.get("/get", {
          params: { model: "User" },
        });
        const filteredUsers = resManagers.data.filter((user) => user.isManager);
        setOptions(filteredUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [props.field.dynamicData]);

  React.useEffect(() => {
    if (props.fromConfig) {
      setSelectedManager(
        props.type === "requests"
          ? props.requestsApproverManager
          : props.stockEntriesApproverManager
      );
    } else {
      setSelectedManager(props.fields.manager);
    }
  }, [
    props.fromConfig,
    props.type,
    props.requestsApproverManager,
    props.stockEntriesApproverManager,
    props.fields.manager,
  ]);

  const renderValue = (selected) => {
    if (!selected) {
      return "";
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
    setSelectedManager(value);

    if (props.fromConfig) {
      if (props.type === "requests") {
        props.setRequestsApproverManager(value);
      } else if (props.type === "stock") {
        props.setStockEntriesApproverManager(value);
      }
    } else {
      props.handleChange(props.field.name)(event);
    }
  };

  return (
    <Grid2>
      <InputLabel>{props.field.label}</InputLabel>
      <Select
        value={selectedManager || ""}
        onChange={handleChange}
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
              props.fromConfig
                ? ""
                : checkAvailability("manager", option, props.targetId)
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

export default ManagerSelectTableCell;
