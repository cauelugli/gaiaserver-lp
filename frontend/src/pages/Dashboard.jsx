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
      <img
        src={`http://localhost:3000/static${user.image}`}
        alt="Logo do Tenant"
        style={{
          width: "8%",
          marginLeft: 30,
          marginTop: 2,
          marginBottom: 2,
          cursor: "pointer",
        }}
      />
    </>
  );
};

export default Dashboard;
