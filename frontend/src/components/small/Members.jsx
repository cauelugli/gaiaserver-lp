/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useRef, useState } from "react";
import { TextField, Box } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

const Members = ({ users, value, onChange }) => {
  const filteredUsers = users.filter(
    (user) =>
      !value.some((selectedUser) => selectedUser._id === user._id) &&
      !value.some((prevUser) => prevUser.id === user._id) &&
      // BY DEFAULT, USERS CAN HAVE ONLY ONE GROUP.
      // SOON WILL BE ADDED IN CONFIG THE OPTION TO WORK 
      // WITH MULTIPLE DEPARTMENTS.
      // THIS CONDITION CHECKS IT.
      !user.department
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
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} />}
      />
    </Box>
  );
};

export default Members;
