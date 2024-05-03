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
  Typography,
} from "@mui/material";

export default function CustomerCard({ customer, type }) {
  return (
    <Card elevation={3}>
      {type === "client" ? (
        <Avatar
          sx={{
            width: 100,
            height: 100,
            margin: "auto",
            mt: 2,
          }}
          src={
            customer.image
              ? `http://localhost:3000/static/${customer.image}`
              : `http://localhost:3000/static/images/default_userPicture.png`
          }
        />
      ) : (
        <CardMedia
          sx={{
            height: 100,
            width: "100%",
            objectFit: "contain",
          }}
          image={
            customer.image
              ? `http://localhost:3000/static/${customer.image}`
              : `http://localhost:3000/static/images/default_userPicture.png`
          }
          component="img"
        />
      )}

      <CardContent>
        <Typography gutterBottom variant="h6">
          {customer.name}
        </Typography>
        <Typography gutterBottom variant="body1">
          {customer.phone}
        </Typography>
        {type === "customer" ? (
          <>
            <Typography variant="body2">
              {customer.mainContactName} ({customer.mainContactPosition})
            </Typography>
            <Typography variant="body2">{customer.mainContactEmail}</Typography>
          </>
        ) : (
          <>
            <Typography variant="body2">{customer.email}</Typography>
          </>
        )}
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}
