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
  Tooltip,
  Typography,
} from "@mui/material";

export default function FinanceCard({ item, type }) {
  console.log("item", item);
  return (
    <Card elevation={3}>
      <CardContent>
        <Grid container direction="column">
          <Grid item>
            <Typography variant="h6" sx={{ fontWeight: "bold", my: 0.5 }}>
              {type === "income" ? `Orçamento #${item.quote}` : `${item.type}`}
            </Typography>
          </Grid>

          <Grid item>
            {type === "income" ? (
              <>
                <Typography variant="body2" sx={{ fontSize: 13 }}>
                  Tipo: {item.type}
                </Typography>
                {item.items.length !== 0 && (
                  <Grid sx={{ my: 2 }}>
                    <Typography variant="body2" sx={{ fontSize: 13 }}>
                      Itens:
                    </Typography>
                    <Grid container direction="row" alignItems="center">
                      <>
                        {item.items.map((item, index) => (
                          <Grid
                            key={index}
                            direction="column"
                            alignItems="center"
                            sx={{ mr: 2 }}
                          >
                            <Tooltip title={`x${item.quantity} ${item.name}`}>
                              <Avatar
                                alt="Imagem do Produto"
                                src={`http://localhost:3000/static/${item.image}`}
                                sx={{ width: 34, height: 34, mx: "auto" }}
                              />
                            </Tooltip>
                          </Grid>
                        ))}
                      </>
                    </Grid>
                  </Grid>
                )}
                <Typography variant="body2" sx={{ mt: 1, fontSize: 13 }}>
                  Departamento: {item.department}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontSize: 13 }}>
                  Valor Total: R$
                  {item.finalPrice
                    ? item.finalPrice.toFixed(2)
                    : item.price.toFixed(2)}
                </Typography>

                <Typography variant="body2" sx={{ mt: 1, fontSize: 13 }}>
                  Status: {item.status}
                </Typography>

                <Typography variant="body2" sx={{ mt: 1, fontSize: 13 }}>
                  Criado em: {dayjs(item.createdAt).format("DD/MM/YY")}
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="body2" sx={{ fontSize: 13 }}>
                  Tipo: {item.type}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontSize: 13 }}>
                  Departamento: {item.department}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontSize: 13 }}>
                  Valor Total: R$
                  {item.finalPrice
                    ? item.finalPrice.toFixed(2)
                    : item.price.toFixed(2)}
                </Typography>

                <Typography variant="body2" sx={{ mt: 1, fontSize: 13 }}>
                  Status: {item.status}
                </Typography>

                <Typography variant="body2" sx={{ mt: 1, fontSize: 13 }}>
                  Criado em: {dayjs(item.createdAt).format("DD/MM/YY")}
                </Typography>
              </>
            )}
          </Grid>
        </Grid>
      </CardContent>
      <CardActions sx={{ mt: -3 }}>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}
