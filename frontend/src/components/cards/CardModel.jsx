/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";

import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  Grid,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";

import { options } from "../../options/cardOptions";
import { isDate } from "../../../../controllers/functions/overallFunctions";

export default function CardModel({
  userId,
  userName,
  configData,
  item,
  refreshData,
  setRefreshData,
  label,
}) {
  const renderTypographies = () => {
    const labelOptions = options[label] || [];
    return labelOptions.map(({ label, value }, index) => (
      <Typography key={index} variant="body2" sx={{ mt: 1, fontSize: 13 }}>
        <strong>{label}:</strong> {label.startsWith("Valor") ? "R$" : ""}
        {Array.isArray(item[value]) ? (
          <Grid container direction="row" sx={{ m: 1 }}>
            {item[value].map((subItem, index) => (
              <>
                <Tooltip key={index} title={subItem.name || "N/A"}>
                  <Avatar
                    src={`http://localhost:3000/static/${
                      subItem.images?.[0] || ""
                    }`}
                    sx={{ width: 30, height: 30, mr: 1 }}
                  />
                </Tooltip>
              </>
            ))}
          </Grid>
        ) : label.startsWith("Valor") && typeof item[value] === "number" ? (
          item[value].toFixed(2)
        ) : isDate(item[value]) ? (
          <>{dayjs(item[value]).format("DD/MM/YYYY hh:MM")}</>
        ) : typeof item[value] === "boolean" ? (
          item[value] ? (
            "Sim"
          ) : (
            "Não"
          )
        ) : (
          item[value] || "N/A"
        )}
      </Typography>
    ));
  };

  const usesAvatar = ["Client", "Customer", "User", "Operator"];
  const usesTitle = ["Job", "ServicePlan"];
  const usesNumber = ["Sale", "Quote", "StockEntry"];
  const usesProduct = ["Sale", "Stock", "Product", "StockEntry"];
  const usesColor = ["Department", "Service"];
  const usesMembers = ["Group", "Position", "Role"];

  return (
    <Card elevation={3}>
      <CardContent>
        <Grid container direction="column">
          {usesAvatar.includes(label) && (
            <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Avatar
                alt="Imagem"
                src={`http://localhost:3000/static/${item.image}`}
                sx={{ width: 100, height: 100, mx: "auto" }}
                variant="square"
              />
              <Typography variant="h5" sx={{ mt: 1, fontWeight: "bold" }}>
                {item.name}
              </Typography>
            </Grid>
          )}
          {usesTitle.includes(label) && (
            <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {item.title || item.name}
              </Typography>
            </Grid>
          )}
          {usesNumber.includes(label) && (
            <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {label === "Sale"
                  ? "Venda"
                  : label === "Quote"
                  ? "Orçamento"
                  : label === "StockEntry"
                  ? "Entrada"
                  : ""}{" "}
                #{item.number}
              </Typography>
            </Grid>
          )}
          {item && usesProduct.includes(label) && (
            <Grid
              container
              direction="row"
              spacing={2}
              justifyContent="center"
              sx={{ mb: 1 }}
            >
              {label === "Sale" ? (
                item?.products?.map((item, index) => (
                  <Grid item key={index}>
                    <Avatar
                      alt={`Image ${index}`}
                      src={`http://localhost:3000/static/${
                        item.images[0] || ""
                      }`}
                      sx={{ width: 50, height: 50 }}
                    />
                  </Grid>
                ))
              ) : item.images ? (
                <Avatar
                  src={`http://localhost:3000/static/${item.images[0] || ""}`}
                  sx={{ width: 50, height: 50 }}
                />
              ) : (
                ""
              )}
            </Grid>
          )}
          {usesColor.includes(label) && (
            <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Paper
                sx={{
                  width: 64,
                  height: 64,
                  mx: "auto",
                  borderRadius: 20,
                  backgroundColor: item.color,
                }}
              />
              <Typography variant="h5" sx={{ mt: 1, fontWeight: "bold" }}>
                {item.name}
              </Typography>
            </Grid>
          )}
          {usesMembers.includes(label) && (
            <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {item.name}
              </Typography>
            </Grid>
          )}
          {renderTypographies()}
        </Grid>
      </CardContent>
    </Card>
  );
}
