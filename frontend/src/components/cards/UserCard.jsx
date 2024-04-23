/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

export default function UserCard({ user, type }) {
  return (
    <Card sx={{ width: 290 }}>
      <CardMedia
        sx={{
          height: 100,
          width: "100%",
          objectFit: "contain",
        }}
        image={`http://localhost:3000/static/${user.image}`}
        component="img"
      />
      <CardContent>
        <Typography gutterBottom variant="h6">
          {user.name}
        </Typography>
        <Typography gutterBottom variant="body1">
          {user.phone}
        </Typography>
        <Typography variant="body2">{user.email}</Typography>
        <Grid container direction="row" alignItems="center" sx={{ mt: 1 }}>
          <Paper
            elevation={0}
            sx={{
              mr: 0.5,
              mb: 0.5,
              width: 9,
              height: 9,
              borderRadius: 50,
              backgroundColor: user.department.color,
            }}
          />
          <Typography variant="body2">
            {user.department.name}
          </Typography>
        </Grid>
        <Typography variant="body2">{user.position.name}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}
