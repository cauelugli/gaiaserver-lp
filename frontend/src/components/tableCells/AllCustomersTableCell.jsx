/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  Avatar,
  Divider,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";

const AllCustomersTableCell = (props) => {
  const [customers, setCustomers] = React.useState([]);
  const [clients, setClients] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const resCustomers = await api.get("/get", {
          params: { model: "Customer" },
        });
        const resClients = await api.get("/get", {
          params: { model: "Client" },
        });

        const sortedCustomers = resCustomers.data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        const sortedClients = resClients.data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setCustomers(sortedCustomers);
        setClients(sortedClients);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [props.field.dynamicData, props.fields.data]);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            <Grid2 container direction="row" alignItems="center">
              <Avatar
                alt="Imagem"
                src={`http://localhost:3000/static/${selected.image}`}
                sx={{ width: 24, height: 24, marginRight: 2 }}
              />
              <Typography
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 100,
                }}
              >
                {selected.name}
              </Typography>
            </Grid2>
          ) : (
            <Typography>Selecione um Cliente</Typography>
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
        {filteredCustomers.length !== 0 && (
          <InputLabel sx={{ ml: 1, fontSize: 13 }}>Empresas</InputLabel>
        )}
        {filteredCustomers.length === 0 ? (
          filteredClients.length === 0 ? (
            <Typography sx={{ ml: 1, fontSize: 13 }}>
              Nenhum Cliente Encontrada
            </Typography>
          ) : (
            <Typography sx={{ ml: 1, fontSize: 13 }}>
              Nenhuma Empresa Encontrada
            </Typography>
          )
        ) : (
          filteredCustomers.map((option, index) => (
            <MenuItem value={option} key={index}>
              <Grid2 container direction="row" alignItems="center">
                <Avatar
                  alt="Imagem"
                  src={`http://localhost:3000/static/${option.image}`}
                  sx={{ width: 24, height: 24, marginRight: 2 }}
                />
                <Typography>{option.name}</Typography>
              </Grid2>
            </MenuItem>
          ))
        )}
        <Divider
          sx={{ border: "1px nothing #444", width: "75%", mx: "auto", my: 1 }}
        />
        {filteredClients.length !== 0 && (
          <InputLabel sx={{ ml: 1, fontSize: 13 }}>Pessoa Física</InputLabel>
        )}
        {filteredClients.length === 0 ? (
          filteredCustomers.length === 0 ? (
            ""
          ) : (
            <Typography sx={{ ml: 1, fontSize: 13 }}>
              Nenhum Cliente Encontrado
            </Typography>
          )
        ) : (
          filteredClients.map((option, index) => (
            <MenuItem value={option} key={index}>
              <Grid2 container direction="row" alignItems="center">
                <Avatar
                  alt="Imagem"
                  src={`http://localhost:3000/static/${option.image}`}
                  sx={{ width: 24, height: 24, marginRight: 2 }}
                />
                <Typography>{option.name}</Typography>
              </Grid2>
            </MenuItem>
          ))
        )}
      </Select>
    </>
  );
};

export default AllCustomersTableCell;
