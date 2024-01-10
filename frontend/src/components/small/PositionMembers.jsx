/* eslint-disable no-unused-vars */
import React from "react";

import { Avatar, Grid, Typography } from "@mui/material";

const PositionMembers = () => {
  const map = [1, 2, 3, 4, 5, 6, 7];
  return (
    <Grid container direction="row" alignItems="center" justifyContent="center">
      {map.slice(0, 3).map((item) => (
        <Avatar key alt={item} sx={{ width: 30, height: 30, ml: 0.5 }} />
      ))}
      {map.length > 3 && (
        <Typography sx={{ fontSize: 13, color: "#777", ml: 0.5 }}>
          ...+{map.length - 3}
        </Typography>
      )}
    </Grid>
  );
};

export default PositionMembers;
