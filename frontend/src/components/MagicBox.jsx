import React from "react";

import { Grid, Paper } from "@mui/material";

const MagicBox = () => {
  return (
    
      <Paper
        sx={{
          p: 1,
          height: "95%",
          backgroundColor: "lightblue",
          borderRadius: "00px 10px 10px 00px",
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={10}>
            something
          </Grid>
        </Grid>
      </Paper>
  );
};

export default MagicBox;
