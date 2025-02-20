/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useAppData } from "../../../src/AppDataContext";

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
import { isDate } from "../../../../controllers/functions/overallFunctions";
import RowButton from "../small/buttons/RowButton";

export default function CardModel({
  userId,
  // userName,
  // configData,
  item,
  refreshData,
  setRefreshData,
  label,
  cardSize,
  page,
  tabIndex,
  requestsApproverManager,
  stockApproverManager,
  mainColor,
}) {
  // const appData = useAppData();

  const renderTypographies = () => {
    const labelOptions = options[label] || [];
    return labelOptions.map(({ label, value }, index) => (
      <Typography
        key={index}
        variant="body2"
        sx={{ mt: 1, fontSize: 11 + cardSize }}
      >
        <strong>{label}:</strong> {label.startsWith("Valor") ? "R$" : ""}
        {Array.isArray(item[value]) ? (
          <Grid2 container direction="row" sx={{ m: 1 }}>
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
          </Grid2>
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
  const usesNumber = ["Sale", "StockEntry"];
  const usesProduct = ["Sale", "Stock", "Product", "StockEntry"];
  const usesColor = ["Department", "Service"];
  const usesMembers = ["Group", "Position", "Role"];

  return (
    <Card elevation={3}>
      <CardContent>
        <Grid2 container direction="column">
          {usesAvatar.includes(label) && (
            <Grid2
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Avatar
                alt="Imagem"
                src={`http://localhost:3000/static/${item.image}`}
                sx={{
                  width: 80 + cardSize * 15,
                  height: 80 + cardSize * 15,
                  mx: "auto",
                }}
                variant="square"
              />
              <Typography variant="h5" sx={{ mt: 1, fontWeight: "bold" }}>
                {item.name}
              </Typography>
            </Grid2>
          )}
          {usesTitle.includes(label) && (
            <Grid2
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {item.title || item.name}
              </Typography>
            </Grid2>
          )}
          {usesNumber.includes(label) && (
            <Grid2
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {label === "Sale"
                  ? "Venda"
                  : label === "StockEntry"
                  ? "Entrada"
                  : ""}{" "}
                #{item.number}
              </Typography>
            </Grid2>
          )}
          {item && usesProduct.includes(label) && (
            <Grid2
              container
              direction="row"
              spacing={2}
              justifyContent="center"
              sx={{ mb: 1 }}
            >
              {label === "Sale" ? (
                item?.products?.map((item, index) => (
                  <Grid2 item key={index}>
                    <Avatar
                      alt={`Image ${index}`}
                      src={`http://localhost:3000/static/${
                        item.images[0] || ""
                      }`}
                      sx={{
                        width: 50 + cardSize * 15,
                        height: 50 + cardSize * 15,
                      }}
                    />
                  </Grid2>
                ))
              ) : item.images ? (
                <Avatar
                  src={`http://localhost:3000/static/${item.images[0] || ""}`}
                  sx={{ width: 50 + cardSize * 15, height: 50 + cardSize * 15 }}
                />
              ) : (
                ""
              )}
            </Grid2>
          )}
          {usesColor.includes(label) && (
            <Grid2
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Paper
                sx={{
                  width: 44 + cardSize * 15,
                  height: 44 + cardSize * 15,
                  mx: "auto",
                  borderRadius: 20,
                  backgroundColor: item.color,
                }}
              />
              <Typography variant="h5" sx={{ mt: 1, fontWeight: "bold" }}>
                {item.name}
              </Typography>
            </Grid2>
          )}
          {usesMembers.includes(label) && (
            <Grid2
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {item.name}
              </Typography>
            </Grid2>
          )}
          {renderTypographies()}
          <RowButton
            userId={userId}
            userIsRequestsApproverManager={userId === requestsApproverManager}
            userIsStockApproverManager={userId === stockApproverManager}
            mainColor={mainColor}
            item={item}
            page={page}
            tabIndex={tabIndex}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            fromCard={true}
            // multiple={props.multiple} maybe 'multipleFromCard', cause styling will be different
          />
        </Grid2>
      </CardContent>
    </Card>
  );
}
