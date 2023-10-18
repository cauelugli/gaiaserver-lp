/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { TextField, Box, Avatar } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

const Members = ({ users, value, onChange }) => {
  const filteredUsers = users.filter(
    (user) =>
      !value.some((selectedUser) => selectedUser._id === user._id) &&
      !value.some((prevUser) => prevUser.id === user._id)
  );

  return (
    <Box>
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
    </Box>
  );
};

export default Members;
