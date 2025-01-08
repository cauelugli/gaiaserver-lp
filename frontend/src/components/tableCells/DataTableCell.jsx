/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";

import {
  Avatar,
  Grid,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";

import { icons } from "../../icons";
import { isId } from "../../../../controllers/functions/overallFunctions";

const DataTableCell = ({
  item,
  isRequestsApproverManager,
  idIndexList,
  column,
}) => {
  const getNameById = (id) => {
    const found = idIndexList.find((obj) => obj.id === id);
    if (found && found.image) {
      return found ? (
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          sx={{ maxWidth: 200 }}
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
        </Grid>
      ) : (
        "-"
      );
    } else if (found) {
      return found.name || found;
    }
  };

  return (
    <>
      {item === null ? (
        ""
      ) : item && typeof item === "string" && item.startsWith("/images") ? (
        <Grid
          sx={{
            width: 50,
          }}
        >
          {isRequestsApproverManager ? (
            <Grid
              container
              direction="row"
              alignItems="center"
              justifyContent="space-evenly"
            >
              <Avatar
                alt="Imagem"
                src={`http://localhost:3000/static${item}`}
                sx={{
                  width: 30,
                  height: 30,
                }}
              />
              <Tooltip title="Gerente Aprovador de Solicitações">
                <icons.StarIcon
                  sx={{
                    width: 16,
                    height: 16,
                  }}
                />
              </Tooltip>
            </Grid>
          ) : (
            <Avatar
              alt="Imagem"
              src={`http://localhost:3000/static${item}`}
              sx={{
                width: 30,
                height: 30,
              }}
            />
          )}
        </Grid>
      ) : Array.isArray(item) ? (
        <Grid container direction="row" alignItems="center">
          {item.map((obj, index) => (
            <Grid item key={index} sx={{ mr: 1 }}>
              <Tooltip
                title={
                  obj.count ? (
                    <Grid
                      container
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography sx={{fontSize:13}}>{`${obj.count}x ${obj.name}`}</Typography>
                      <Typography>
                        {`R$${(obj.sellValue * obj.count).toFixed(2)}`}
                      </Typography>
                    </Grid>
                  ) : (
                    idIndexList.find((user) => user.id === obj)?.name
                  )
                }
              >
                <Grid
                  container
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item>
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
                  </Grid>
                </Grid>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
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
      ) : (
        <Grid sx={{ maxWidth: 200 }}>{item}</Grid>
      )}
    </>
  );
};

export default DataTableCell;
