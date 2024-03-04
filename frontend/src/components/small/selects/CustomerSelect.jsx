/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import axios from "axios";
import {
  Avatar,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const CustomerSelect = () => {
  const [customers, setCustomers] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const resCustomers = await api.get("/customers");
        const resClients = await api.get("/clients");
        const combinedData = [...resCustomers.data, ...resClients.data];
        setCustomers(combinedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <FormControl>
      <Select
        displayEmpty
        renderValue={(selected) => {
          if (!selected) {
            return <Typography>Cliente</Typography>;
          }

          return selected.name;
        }}
        sx={{ mt: 1, width: 180 }}
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
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((item) => (
            <MenuItem value={item} key={item._id}>
              <Grid container direction="row" alignItems="center">
                <Avatar
                  alt="Imagem do Cliente"
                  src={`http://localhost:3000/static/${item.image}`}
                  sx={{ width: 24, height: 24, marginRight: 2 }}
                />
                <Typography>{item.name}</Typography>
              </Grid>
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
