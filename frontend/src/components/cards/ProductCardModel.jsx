/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";
import toast from "react-hot-toast";
import dayjs from "dayjs";

import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  Grid2,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";

import { options } from "../../options/cardOptions";
import { useAppData } from "../../AppDataContext";
import RowButton from "../small/buttons/RowButton";

export default function ProductCardModel({
  userId,
  userName,
  configData,
  item,
  refreshData,
  setRefreshData,
  cardSize,
}) {
  const appData = useAppData();
  const renderTypographies = () => {
    return item?.fields?.map(({ name, value }, index) => (
      <Typography
        key={index}
        variant="body2"
        sx={{ mt: 1, fontSize: 11 + cardSize }}
      >
        <strong>{name}:</strong> {value || "N/A"}
      </Typography>
    ));
  };

  return (
    <Card elevation={3}>
      {item ? (
        <CardContent>
          <Grid2 container direction="column">
            <Grid2
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {item?.name || "N/A"}
              </Typography>
            </Grid2>
            <Grid2 container direction="row" justifyContent="center">
              <Avatar
                alt=""
                src={`http://localhost:8080/static/${item?.images?.[0] || ""}`}
                sx={{
                  width: 40 + cardSize * 15,
                  height: 40 + cardSize * 15,
                  mt: 2,
                }}
              />
            </Grid2>
            {renderTypographies()}
            <Typography variant="body2" sx={{ mt: 1, fontSize: 11 + cardSize }}>
              <strong>Valor de Compra:</strong> R$
              {item?.buyValue?.toFixed(2) || "N/A"}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, fontSize: 11 + cardSize }}>
              <strong>Valor de Venda:</strong> R$
              {item?.sellValue?.toFixed(2) || "N/A"}
            </Typography>{" "}
            <Typography variant="body2" sx={{ mt: 1, fontSize: 11 + cardSize }}>
              <strong>Em estoque:</strong> {item?.stockQuantity || "N/A"}
            </Typography>{" "}
            <RowButton
              userId={userId}
              item={item}
              // mainColor={mainColor}
              // page={page}
              // tabIndex={tabIndex}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              fromCard={true}
              // multiple={props.multiple} maybe 'multipleFromCard', cause styling will be different
            />
          </Grid2>
        </CardContent>
      ) : (
        ""
      )}
    </Card>
  );
}
