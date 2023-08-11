/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useRef, useState } from "react";
import { TextField, Box } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

const Members = ({ users, value, onChange }) => {
  const filteredUsers = users.filter(user => !value.some(selectedUser => selectedUser._id === user._id));

  return (
    <Box>
      <Autocomplete
        multiple
        options={filteredUsers}
        value={value}
        onChange={(event, newValue) => {
          onChange(newValue);
        }}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} />}
      />
    </Box>
  );
};



export default Members;
