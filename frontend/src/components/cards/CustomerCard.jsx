/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

export default function CustomerCard({ customer }) {
  return (
    <Card sx={{ width: 290 }}>
      <CardMedia
        sx={{ height: 100 }}
        image={`http://localhost:3000/static/${customer.image}`}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {customer.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Something Something
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}
