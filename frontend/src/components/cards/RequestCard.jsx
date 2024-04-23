/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";
import dayjs from "dayjs";

import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

export default function RequestCard({ request, type }) {
  return (
    <Card sx={{ width: 290, height: 300 }} elevation={3}>
      <CardContent>
        <Typography gutterBottom variant="h6" sx={{ fontWeight: "bold" }}>
          {type === "job" ? request.title : `Venda #${request.quoteNumber}`}
        </Typography>
        <Typography variant="body1">
          Cliente: {request.customer.name}
        </Typography>
        <Grid container direction="row" alignItems="center" sx={{ mt: 1 }}>
          <Paper
            elevation={0}
            sx={{
              mr: 0.5,
              mb: 0.5,
              width: 9,
              height: 9,
              borderRadius: 50,
              backgroundColor: request.department.color,
            }}
          />
          <Typography variant="body2" sx={{ fontSize: 12 }}>
            {request.department.name}{" "}
            {type === "job" && ` - ${request.service.name}`}
          </Typography>
        </Grid>
        {type === "job" ? (
          <>
            <Grid sx={{ mt: 2 }}>
              <Grid container direction="row" alignItems="center">
                <Avatar
                  alt="Imagem do Colaborador"
                  src={`http://localhost:3000/static/${request.worker.image}`}
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
                <Typography variant="body2">{request.worker.name}</Typography>
              </Grid>
              <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
                Agendado para:{" "}
                {request.selectedSchedule
                  ? request.selectedSchedule
                  : dayjs(request.scheduledTo).format("DD/MM/YY")}
              </Typography>
              <Typography variant="body2">Status: {request.status}</Typography>
            </Grid>
          </>
        ) : (
          <>
            <Grid sx={{ mt: 1 }}>
              <Grid container direction="row" alignItems="center">
                <>
                  {request.items.map((item) => (
                    <Grid key={item.id} direction="column" alignItems="center">
                      <Avatar
                        alt="Imagem do Produto"
                        src={`http://localhost:3000/static/${item.image}`}
                        sx={{ width: 34, height: 34, mx: "auto" }}
                      />
                      <Typography sx={{ fontSize: 11 }}>
                        x{item.quantity} {item.name}
                      </Typography>
                    </Grid>
                  ))}
                </>
              </Grid>
              <Grid
                container
                direction="row"
                alignItems="center"
                sx={{ mt: 1 }}
              >
                <Avatar
                  alt="Imagem do Colaborador"
                  src={`http://localhost:3000/static/${request.seller.image}`}
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
                <Typography variant="body2">{request.seller.name}</Typography>
              </Grid>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Status: {request.status}
              </Typography>
              <Typography variant="body2" sx={{ mb: -1.5 }}>
                Valor da Venda: R${request.price.toFixed(2)}
              </Typography>
            </Grid>
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
