/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  Avatar,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

const AllCustomersTableCell = (props) => {
  const [options, setOptions] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        let data = [];
        const resCustomers = await api.get("/get", {
          params: { model: "Customer" },
        });
        const resClients = await api.get("/get", {
          params: { model: "Client" },
        });
        data = [...resCustomers.data, ...resClients.data];
        setOptions(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [props.field.dynamicData, props.fields.data]);

  const renderValue = (selected) => {
    if (!selected) {
      return <Typography>{props.field.label}</Typography>;
    } else {
      return (
        <>
          {
            <Grid container direction="row" alignItems="center">
              <Avatar
                alt="Imagem"
                src={`http://localhost:3000/static/${selected.image}`}
                sx={{ width: 24, height: 24, marginRight: 2 }}
              />
              <Typography sx={{ fontSize: 13 }}>{selected.name}</Typography>
            </Grid>
          }
        </>
      );
    }
  };

  return (
    <>
      <InputLabel>{props.field.label}</InputLabel>
      <Select
        value={props.fields[props.field.name]}
        onChange={props.handleChange(props.field.name)}
        sx={{
          width:
            props.modalOptions.maxWidth === "xs"
              ? 190
              : props.modalOptions.maxWidth === "sm"
              ? 175
              : props.modalOptions.maxWidth === "md"
              ? 200
              : 200,
          minWidth: 175,
        }}
        size="small"
        renderValue={renderValue}
      >
        {options.map((option, index) => (
          <MenuItem value={option} key={index}>
            <Grid container direction="row" alignItems="center">
              <Avatar
                alt="Imagem"
                src={`http://localhost:3000/static/${option.image}`}
                sx={{ width: 24, height: 24, marginRight: 2 }}
              />
              <Typography>{option.name}</Typography>
            </Grid>
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default AllCustomersTableCell;
