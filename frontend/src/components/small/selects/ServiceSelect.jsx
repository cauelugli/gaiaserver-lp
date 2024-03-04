/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import axios from "axios";

import {
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

const ServceSelect = () => {
  const [services, setServices] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const services = await api.get("/services");
        setServices(services.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <FormControl>
      <Select
        displayEmpty
        renderValue={(selected) => {
          if (!selected) {
            return <Typography>Serviço</Typography>;
          }

          return selected.name;
        }}
        sx={{ mt: 1, width: 180 }}
      >
        <TextField
          placeholder="Pesquisar"
          variant="outlined"
          autoFocus
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
        {filteredServices.length > 0 ? (
          filteredServices.map((item) => (
            <MenuItem value={item} key={item._id}>
              <Typography id="ghostText" sx={{ color: "white" }}>{"•"}</Typography>
              <Typography>{item.name}</Typography>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            <Typography sx={{ textAlign: "center" }}>
              Nenhum serviço encontrado
            </Typography>
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

export default ServceSelect;
