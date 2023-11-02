/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";
import { Typography } from "@mui/material";

const Dashboard = ({ user }) => {
  return (
    <>
      <p>Dashboard</p>
      <Typography sx={{ my: 3 }}>
        Hellow, <strong>{user.name}</strong> !
      </Typography>
    </>
  );
};

export default Dashboard;
