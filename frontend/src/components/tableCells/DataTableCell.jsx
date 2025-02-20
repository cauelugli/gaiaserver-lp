/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";

import { Avatar, Grid2, Paper, Tooltip, Typography } from "@mui/material";

import { icons } from "../../icons";
import {
  isDate,
  isId,
} from "../../../../controllers/functions/overallFunctions";
import dayjs from "dayjs";

const DataTableCell = ({
  item,
  isRequestsApproverManager,
  isStockApproverManager,
  isRequestsApproverAlternate,
  isStockApproverAlternate,
  idIndexList,
  column,
}) => {
  const getNameById = (id) => {
    const found = idIndexList.find((obj) => obj.id === id);
    if (found && found.image) {
      return found ? (
        <Grid2
          container
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
        >
          <Tooltip title={found.name}>
            <Avatar
              alt={found.name}
              src={`http://localhost:3000/static${found.image}`}
              sx={{
                width: 30,
                height: 30,
                mr: 0.5,
              }}
            />
          </Tooltip>
          <Typography sx={{ fontSize: 14 }}>{found.name}</Typography>
        </Grid2>
      ) : (
        "-"
      );
    } else if (found) {
      return found.name || found;
    }
  };

  const departmentTypes = {
    Vendas: <icons.SellIcon />,
    Serviços: <icons.BuildIcon />,
    Interno: <icons.LanIcon />,
  };

  return (
    <>
      {item === null ? (
        ""
      ) : item && typeof item === "string" && item.startsWith("/images") ? (
        <Grid2
          sx={{
            maxWidth: 60,
          }}
        >
          <Grid2
            container
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
          >
            <Avatar
              alt="Imagem"
              src={`http://localhost:3000/static${item}`}
              sx={{
                width: 30,
                height: 30,
              }}
            />
            {isRequestsApproverManager && (
              <Tooltip title="Gerente Aprovador de Solicitações">
                <icons.StarIcon
                  sx={{
                    width: 14,
                    height: 14,
                  }}
                />
              </Tooltip>
            )}
            {isStockApproverManager && (
              <Tooltip title="Gerente Aprovador de Estoque">
                <icons.StarIcon
                  sx={{
                    width: 14,
                    height: 14,
                  }}
                />
              </Tooltip>
            )}
            {isRequestsApproverAlternate && (
              <Tooltip title="Suplente Aprovador de Solicitações">
                <icons.StarIcon
                  sx={{
                    width: 14,
                    height: 14,
                  }}
                />
              </Tooltip>
            )}
            {isStockApproverAlternate && (
              <Tooltip title="Suplente Aprovador de Estoque">
                <icons.StarIcon
                  sx={{
                    width: 14,
                    height: 14,
                  }}
                />
              </Tooltip>
            )}
          </Grid2>
        </Grid2>
      ) : Array.isArray(item) ? (
        <Grid2 container direction="row" alignItems="center">
          {item.map((obj, index) => (
            <Grid2 item key={index} sx={{ mr: 1 }}>
              <Tooltip
                title={
                  obj.count ? (
                    <Grid2
                      container
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography
                        sx={{ fontSize: 13, color: "white" }}
                      >{`${obj.count}x ${obj.name}`}</Typography>
                      <Typography sx={{ color: "white" }}>
                        {`R$${(obj.sellValue * obj.count).toFixed(2)}`}
                      </Typography>
                    </Grid2>
                  ) : (
                    idIndexList.find((user) => user.id === obj)?.name
                  )
                }
              >
                <Grid2
                  container
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid2 item>
                    {obj.products ? (
                      <icons.BuildIcon />
                    ) : (
                      <Avatar
                        alt={idIndexList.find((user) => user.id === obj)?.name}
                        src={
                          obj.images
                            ? `http://localhost:3000/static${obj.images[0]}`
                            : `http://localhost:3000/static${
                                idIndexList.find((user) => user.id === obj)
                                  ?.image
                              }`
                        }
                        sx={{
                          width: 30,
                          height: 30,
                          mr: 0.5,
                        }}
                      />
                    )}
                  </Grid2>
                </Grid2>
              </Tooltip>
            </Grid2>
          ))}
        </Grid2>
      ) : typeof item === "boolean" ? (
        item ? (
          "Sim"
        ) : (
          "Não"
        )
      ) : typeof item === "object" ? (
        item.name
      ) : typeof item === "number" ? (
        <>
          {column.label.startsWith("Valor")
            ? `R$${item.toFixed(2).replace(".", ",")}`
            : item}
        </>
      ) : typeof item === "string" && item.startsWith("#") ? (
        <Paper
          elevation={0}
          sx={{
            mr: 1,
            width: 16,
            height: 16,
            borderRadius: 50,
            border: "0.5px solid white",
            backgroundColor: item,
          }}
        />
      ) : isId(item) ? (
        <>{getNameById(item)}</>
      ) : isDate(item) ? (
        <>{dayjs(item).format("DD/MM/YY HH:MM")}</>
      ) : column.id === "type" ? (
        <Tooltip title={item}>{departmentTypes[item]}</Tooltip>
      ) : (
        <Grid2>{item}</Grid2>
      )}
    </>
  );
};

export default DataTableCell;
