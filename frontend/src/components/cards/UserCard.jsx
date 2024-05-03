/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";

import {
  Avatar,
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
    <Card sx={{ maxWidth: 290 }} elevation={3}>
      <Avatar
        sx={{
          width: 100, 
          height: 100,
          margin: "auto",
          mt: 2, 
        }}
        src={
          user.image
            ? `http://localhost:3000/static/${user.image}`
            : `http://localhost:3000/static/images/default_userPicture.png`
        }
        alt={user.name}
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
          <Typography variant="body2">{user.department.name}</Typography>
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
