/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

import {
  TextField,
  Box,
  Avatar,
  Typography,
  FormControl,
  FormLabel,
  Button,
} from "@mui/material";

import Autocomplete from "@mui/material/Autocomplete";

const Members = ({ users, value, onChange, option }) => {
  const filteredUsers = users.filter(
    (user) =>
      !value.some((selectedUser) => selectedUser._id === user._id) &&
      !value.some((prevUser) => prevUser.id === user._id)
  );

  const filteredGroupMembers = users.filter(
    (user) => !value.some((selectedUser) => selectedUser._id === user._id)
  );

  return (
    <Box>
      {option === "department" && (
        <Autocomplete
          multiple
          size="small"
          options={filteredUsers}
          value={value}
          onChange={(event, newValue) => {
            onChange(newValue);
          }}
          getOptionLabel={(option) => (
            <Box display="flex" alignItems="center">
              <Avatar
                alt="Imagem do Colaborador"
                src={`http://localhost:3000/static/${option.image}`}
                sx={{ width: 22, height: 22, marginRight: 1 }}
              />
              {option.name}
            </Box>
          )}
          renderInput={(params) => <TextField {...params} />}
        />
      )}
      {option === "projectDepartments" && (
        <FormControl sx={{ m: 2 }}>
          <FormLabel>
            <Typography sx={{ fontSize: 13, color: "#777" }}>
              Departamentos Secundários
            </Typography>
          </FormLabel>
          <Autocomplete
            sx={{ width: 300 }}
            multiple
            size="small"
            options={filteredUsers}
            value={value}
            onChange={(event, newValue) => {
              onChange(newValue);
            }}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} />}
          />
        </FormControl>
      )}
      {option === "group" && (
        <Autocomplete
          multiple
          size="small"
          options={users}
          value={value}
          sx={{ width: 300 }}
          onChange={(event, newValue) => {
            onChange(newValue);
          }}
          getOptionLabel={(option) => option.name}
          filterOptions={(options, { inputValue }) => {
            const filteredOptionsByName = options.filter((option) =>
              option.name.toLowerCase().includes(inputValue.toLowerCase())
            );

            return filteredOptionsByName.filter(
              (option) =>
                !value.some((selectedUser) => selectedUser._id === option._id)
            );
          }}
          renderOption={(props, option) => (
            <li {...props}>
              <Box display="flex" alignItems="center">
                <Avatar
                  alt="Imagem do Colaborador"
                  src={`http://localhost:3000/static/${option.image}`}
                  sx={{ width: 22, height: 22, marginRight: 1 }}
                />
                {option.name}
              </Box>
            </li>
          )}
          renderInput={(params) => <TextField {...params} />}
        />
      )}
    </Box>
  );
};

export default Members;
