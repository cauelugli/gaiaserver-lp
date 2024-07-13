/* eslint-disable react/prop-types */
import React from "react";

import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { Avatar, Grid, Paper, Typography } from "@mui/material";

export default function BadgedIcon(props) {
  const [count, setCount] = React.useState(0);

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    props.handleProductChange(props.item, newCount);
  };

  const handleDecrement = () => {
    const newCount = count - 1;
    setCount(newCount);
    props.handleProductChange(props.item, newCount);
  };

  return (
    <Paper elevation={3}>
      <Grid
        sx={{
          px: 4,
          py: 3,
          "&:hover": {
            backgroundColor: "#ccc",
          },
        }}
      >
        <div
          style={{
            position: "relative",
            display: "inline-block",
          }}
        >
          <Grid item>
            <Avatar
              alt="Imagem do Colaborador"
              src={`http://localhost:3000/static/${props.item.images[0]}`}
              sx={{ width: 64, height: 64 }}
            />
          </Grid>
          <Grid item sx={{ mt: 3 }}>
            <Grid container direction="row" justifyContent="space-around">
              <Badge
                badgeContent={
                  <IconButton
                    size="small"
                    onClick={handleDecrement}
                    aria-label="decrease"
                    disabled={count === 0}
                  >
                    <RemoveIcon fontSize="inherit" />
                  </IconButton>
                }
                overlap="circular"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              />
              <Badge
                badgeContent={
                  <Typography
                    sx={{ fontWeight: "bold", fontSize: 16, color: "#333" }}
                  >
                    {count}
                  </Typography>
                }
                overlap="circular"
              />
              <Badge
                badgeContent={
                  <IconButton
                    size="small"
                    onClick={handleIncrement}
                    aria-label="increase"
                  >
                    <AddIcon fontSize="inherit" />
                  </IconButton>
                }
                overlap="circular"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              />
            </Grid>
          </Grid>
        </div>
      </Grid>{" "}
    </Paper>
  );
}
