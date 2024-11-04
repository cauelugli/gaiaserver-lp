/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import axios from "axios";

import {
  FormControl,
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

const GroupSelect = (props) => {
  const [groups, setGroups] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const groups = await api.get("/groups");
        setGroups(groups.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const filteredServices = groups.filter((group) =>
  group.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <FormControl>
      <Select
        displayEmpty
        renderValue={(selected) => {
          if (!selected) {
            return <Typography>Grupo</Typography>;
          }

          return selected.name;
        }}
        sx={{ mt: 1, width: 180 }}
        onChange={(e) =>
          props.setGroup({
            id: e.target.value._id,
            name: e.target.value.name,
          })
        }
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
                <icons.SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        {filteredServices.length > 0 ? (
          filteredServices.map((item) => (
            <MenuItem value={item} key={item._id}>
              <Typography id="ghostText" sx={{ color: "white" }}>
                {"•"}
              </Typography>
              <Typography>{item.name}</Typography>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            <Typography sx={{ textAlign: "center" }}>
              Nenhum grupo encontrado
            </Typography>
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

export default GroupSelect;
