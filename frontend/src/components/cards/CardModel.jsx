/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";

import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  Dialog,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";

export default function CardModel({
  userId,
  userName,
  item,
  type,
  refreshData,
  setRefreshData,
  configData,
}) {
  const [openEdit, setOpenEdit] = React.useState(false);

  return (
    <Card elevation={3}>
      <CardContent>
        <Grid container direction="column">
          {type === "entry" ? (
            <>
              <Typography variant="h6" sx={{ fontWeight: "bold", mt: 0.5 }}>
                Entrada de Estoque # {item.number}
              </Typography>

              <Grid
                container
                direction="row"
                alignItems="center"
                sx={{ my: 1 }}
              >
                <>
                  {item.items.map((item,index) => (
                    <Grid
                      key={index}
                      direction="column"
                      alignItems="center"
                      sx={{ mr: 1 }}
                    >
                      <Tooltip title={item.item.name}>
                        <Avatar
                          alt="Imagem do Produto"
                          src={`http://localhost:3000/static/${item.item.image}`}
                          sx={{ width: 30, height: 30, mx: "auto" }}
                        />
                        <Typography sx={{ fontSize: 11 }}>
                          x{item.quantity}
                        </Typography>
                      </Tooltip>
                    </Grid>
                  ))}
                </>
              </Grid>

              <Typography variant="body2" sx={{ mt: 1, fontSize: 13 }}>
                Tipo: {item.type}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, fontSize: 13 }}>
                Criado por: {item.createdBy}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, fontSize: 13 }}>
                Valor dos Itens: R${item.quoteValue.toFixed(2)}
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
              <Typography variant="h6" sx={{ fontWeight: "bold", mt: 0.5 }}>
                {item.name}
              </Typography>
              <Avatar
                alt="Imagem do Produto"
                src={`http://localhost:3000/static/${item.image}`}
                sx={{ width: 56, height: 56, mx: "auto" }}
              />
              {type === "product" && (
                <Typography variant="body2" sx={{ mt: 1, fontSize: 13 }}>
                  Marca: {item.brand}
                </Typography>
              )}
              {type === "product" && (
                <Typography variant="body2" sx={{ mt: 1, fontSize: 13 }}>
                  Tipo: {item.type}
                </Typography>
              )}
              {type === "product" && (
                <Typography variant="body2" sx={{ mt: 1, fontSize: 13 }}>
                  Modelo: {item.model}
                </Typography>
              )}
              {type === "product" && (
                <Typography variant="body2" sx={{ mt: 1, fontSize: 13 }}>
                  Tamanho: {item.size}
                </Typography>
              )}
              <Typography variant="body2" sx={{ mt: 1, fontSize: 13 }}>
                Estoque: {item.quantity}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, fontSize: 13 }}>
                Valor de Compra
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, fontSize: 13 }}>
                Valor de Venda
              </Typography>
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}
