/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  Avatar,
  Grid2,
  MenuItem,
  Select,
  Typography,
  Chip,
  InputLabel,
} from "@mui/material";

import { createScheduleSlots } from "../../../../controllers/functions/overallFunctions";

const DynamicDataTableCell = (props) => {
  const [options, setOptions] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      // this is stupid...
      // update: really...
      try {
        let data = [];
        if (props.field.dynamicData === "scheduleTime") {
          const configAgenda = await api.get("/config/specific", {
            params: { key: "agenda", items: ["minTime", "maxTime"] },
          });
          const slots = createScheduleSlots(
            configAgenda.data.minTime,
            configAgenda.data.maxTime,
            props.serviceLength
          );
          data = slots;
        } else if (props.field.dynamicData === "serviceTypes") {
          const resServiceTypes = await api.get("/getConfig", {
            params: { item: "services", parameter: "serviceTypes" },
          });
          data = resServiceTypes.data;
        } else if (props.field.dynamicData === "services") {
          const resServices = await api.get("/get", {
            params: { model: "Service" },
          });
          data = resServices.data;
        } else {
          const response = await api.get(`/${props.field.dynamicData}`);
          data = response.data;
        }
        setOptions(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [props.field.dynamicData, props.fields.data, props.serviceLength]);

  const renderValue = (selected) => {
    if (props.multiple && selected) {
      return (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {props
            ? props.fields[props.field.name].map((value, index) =>
                value ? (
                  <Chip
                    size="small"
                    key={index}
                    label={value.name}
                    sx={{ mr: 1 }}
                  />
                ) : null
              )
            : selected.map((value, index) => (
                <Chip
                  size="small"
                  key={index}
                  label={value.name}
                  style={{ margin: 2 }}
                />
              ))}
        </div>
      );
    } else {
      if (!selected) {
        return <Typography>{props.field.label}</Typography>;
      } else {
        return (
          <>
            {props.field.hasAvatar ? (
              <Grid2 container direction="row" alignItems="center">
                <Avatar
                  alt="Imagem"
                  src={`http://localhost:8080/static/${selected.image}`}
                  sx={{ width: 24, height: 24, marginRight: 2 }}
                />
                <Typography sx={{ fontSize: 13 }}>{selected.name}</Typography>
              </Grid2>
            ) : (
              <Typography sx={{ fontSize: 13 }}>
                {selected.name || selected}
              </Typography>
            )}
          </>
        );
      }
    }
  };

  return (
    <>
      <InputLabel>{props.field.label}</InputLabel>
      <Select
        value={
          props.multiple && props.fields[props.field.name]
            ? Array.isArray(
                props.fields[props.field.name][props.field.dynamicData]
              )
              ? props.fields[props.field.name][props.field.dynamicData]
              : [props.fields[props.field.name][props.field.dynamicData]]
            : props.fields[props.field.name] || (props.multiple ? [] : "")
        }
        onChange={props.handleChange(props.field.name)}
        sx={{
          width: props.multiple
            ? "100%"
            : props.modalOptions.maxWidth === "xs"
            ? 190
            : props.modalOptions.maxWidth === "sm"
            ? 175
            : props.modalOptions.maxWidth === "md"
            ? 200
            : 200,
          minWidth: 175,
        }}
        size="small"
        required={props.field.required}
        multiple={props.multiple}
        renderValue={renderValue}
      >
        {options.map((option, index) => (
          <MenuItem value={option} key={index}>
            {option.name || option}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default DynamicDataTableCell;
