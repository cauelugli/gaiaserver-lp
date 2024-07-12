/* eslint-disable react/prop-types */
import React from "react";

import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { Avatar, Grid, Typography } from "@mui/material";

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
    <div style={{ position: "relative", display: "inline-block" }}>
      <Grid item>
        <Avatar
          alt="Imagem do Colaborador"
          src={`http://localhost:3000/static/${props.item.images[0]}`}
          sx={{ width: 38, height: 38, mb: 1 }}
        />
      </Grid>
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
        style={{ position: "absolute", bottom: -7, left: -10 }}
      />
      <Badge
        badgeContent={<Typography sx={{ fontSize: 16 }}>{count}</Typography>}
        overlap="circular"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        style={{
          position: "absolute",
          bottom: 0,
          left: "20%",
        }}
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
        style={{ position: "absolute", bottom: -7, right: -10 }}
      />
    </div>
  );
}
