/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  InputAdornment,
  Paper,
} from "@mui/material";

const ServicesTableCell = (props) => {
  const [services, setServices] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const resServices = await api.get("/get", {
          params: { model: "Service" },
        });
        const resDepartments = await api.get("/get", {
          params: { model: "Department" },
        });

        const sortedServices = resServices.data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        const filteredDepartments = resDepartments.data
          .filter((department) => department.type !== "Interno")
          .sort((a, b) => a.name.localeCompare(b.name));

        setServices(sortedServices);
        setDepartments(filteredDepartments);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [props.field.dynamicData, props.fields.data]);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <InputLabel>{props.field.label}</InputLabel>
      <Select
        value={props.fields[props.field.name]}
        onChange={props.handleChange(props.field.name)}
        sx={{ minWidth: 175, width: 200, maxHeight: 500 }}
        size="small"
        renderValue={(selected) =>
          selected ? (
            <Typography>{selected.name}</Typography>
          ) : (
            <Typography>Selecione um Serviço</Typography>
          )
        }
        MenuProps={{ PaperProps: { sx: { padding: "10px" } } }}
      >
        <TextField
          placeholder="Buscar..."
          variant="outlined"
          size="small"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.stopPropagation()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                🔍 {/* Ícone de busca */}
              </InputAdornment>
            ),
          }}
          sx={{
            marginBottom: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "4px",
              fontSize: "13px",
              height: "30px",
            },
          }}
        />
        {departments.reduce((menuItems, department) => {
          const departmentServices = filteredServices.filter((service) =>
            department.services.includes(service._id)
          );

          if (departmentServices.length > 0) {
            menuItems.push(
              <Grid2 container direction="row">
                <Paper
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: 50,
                    ml: 0.5,
                    my: "auto",
                    backgroundColor: department.color,
                  }}
                />
                <InputLabel
                  key={`${department._id}-label`}
                  sx={{ ml: 0.5, mt: 0.25, fontSize: 13 }}
                >
                  {department.name}
                </InputLabel>
              </Grid2>
            );

            menuItems.push(
              ...departmentServices.map((service, index) => (
                <MenuItem value={service} key={index} sx={{ mb: 1 }}>
                  <Typography>{service.name}</Typography>
                </MenuItem>
              ))
            );
          }

          return menuItems;
        }, [])}
        {filteredServices.length === 0 && (
          <Typography sx={{ ml: 1, fontSize: 13 }}>
            Nenhum Serviço Encontrado
          </Typography>
        )}
      </Select>
    </>
  );
};

export default ServicesTableCell;
