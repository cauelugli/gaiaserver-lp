/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import axios from "axios";
import {
  Avatar,
  FormControl,
  Grid2,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { icons } from "../../../icons";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const CustomerSelect = (props) => {
  const [customers, setCustomers] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const resCustomers = await api.get("/get", {
          params: { model: "Customer" },
        });
        const resClients = await api.get("/get", {
          params: { model: "Client" },
        });
        const combinedData = [...resCustomers.data, ...resClients.data];
        setCustomers(
          props.customerType
            ? props.customerType === "Empresa"
              ? resCustomers.data
              : resClients.data
            : combinedData
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [props.customerType]);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <FormControl
      sx={{ mx: props.mx075 ? 0.75 : props.marginAddJobForm ? 2 : 0 }}
    >
      <Select
        displayEmpty
        disabled={props.fromShortcut}
        size={props.sizeSmall || (props.addFromShortcut && "small")}
        renderValue={(selected) => {
          if (props.selectedCustomer) {
            selected = props.selectedCustomer;
            return selected.name;
          } else {
            if (props.selectedCustomer || props.fromShortcut) {
              selected = props.selectedCustomer;
              return selected.name;
            } else {
              if (!selected) {
                return <Typography>Cliente</Typography>;
              }

              return selected.name;
            }
          }
        }}
        sx={{
          mt: props.marginAddJobForm ? 0 : props.addFromShortcut ? 4 : 1,
          width: props.addFromShortcut ? 235 : 180,
        }}
        onChange={(e) =>
          props.handleCustomerChange
            ? props.handleCustomerChange(e.target.value)
            : props.addFromShortcut
            ? props.setCustomer({
                _id: e.target.value._id,
                name: e.target.value.name,
                address: e.target.value.address,
                phone: e.target.value.phone,
                image: e.target.value.image,
                addressHome: e.target.value.addressHome || null,
                cpf: e.target.value.cpf || null,
                cnpj: e.target.value.cnpj || null,
                mainContactName: e.target.value.mainContactName || null,
                mainContactEmail: e.target.value.mainContactEmail || null,
                mainContactPosition: e.target.value.mainContactPosition || null,
              })
            : props.setCustomer({
                id: e.target.value._id,
                name: e.target.value.name,
              })
        }
      >
        <TextField
          placeholder="Pesquisar"
          variant="outlined"
          sx={{ my: 1, mx: "10%" }}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <icons.SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((item) => (
            <MenuItem value={item} key={item._id}>
              <Grid2 container direction="row" alignItems="center">
                <Avatar
                  alt="Imagem do Cliente"
                  src={`http://localhost:3000/static/${item.image}`}
                  sx={{ width: 24, height: 24, marginRight: 2 }}
                />
                <Typography id="ghostText" sx={{ color: "white" }}>
                  {"•"}
                </Typography>
                <Typography>{item.name}</Typography>
              </Grid2>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            <Typography sx={{ textAlign: "center" }}>
              Nenhum cliente encontrado
            </Typography>
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

export default CustomerSelect;
