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
        sx={{
          height: 100,
          width: "100%",
          objectFit: "contain",
        }}
        image={`http://localhost:3000/static/${customer.image}`}
        component="img"
      />
      <CardContent>
        <Typography gutterBottom variant="h6">
          {customer.name}
        </Typography>
        <Typography gutterBottom variant="body1">
          {customer.phone}
        </Typography>
        <Typography variant="body2">
          {customer.mainContactName} ({customer.mainContactPosition})
        </Typography>
        <Typography variant="body2">{customer.mainContactEmail}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}
