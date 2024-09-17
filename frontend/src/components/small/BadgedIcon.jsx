/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";

import { Avatar, Button, Grid, Paper, Typography } from "@mui/material";

export default function BadgedIcon(props) {
  const handleChangeItem = () => {
    props.handleProductChange(props.item);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: 150,
        "&:hover": {
          backgroundColor: "#ccc",
        },
      }}
    >
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item>
          <Typography sx={{ fontSize: 12, my: 0.5 }}>
            {props.item.name}
          </Typography>
        </Grid>

        <Grid item>
          <Avatar
            alt="Imagem do Item"
            src={`http://localhost:3000/static/${props.item.images[0]}`}
            sx={{ width: 64, height: 64 }}
          />
        </Grid>
        <Grid item>
          <Typography sx={{ fontSize: 12, my: 0.5, fontWeight: "bold" }}>
            {props.item.type}
          </Typography>
        </Grid>
        <Grid item sx={{ m: 1 }}>
          <Button
            size="small"
            variant="contained"
            sx={{
              backgroundColor: props.isInList ? "#cc3b3b" : "#647a1b",
              "&:hover": {
                backgroundColor: props.isInList ? "#cc3b3b" : "#647a1b",
              },
            }}
            onClick={handleChangeItem}
          >
            <Typography
              sx={{
                fontSize: 12,
                color: "white",
                fontWeight: "bold",
                mx: 2,
                mt: 0.25,
              }}
            >
              {props.isInList ? "REMOVER" : "ADICIONAR"}
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
