/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

import { Avatar, Button, Grid, Paper, Tooltip } from "@mui/material";

import { icons } from "../../icons"

function isId(str) {
  return /^[a-f0-9]{24}$/i.test(str);
}

const DataTableCell = ({ item, idIndexList, column }) => {
  // Função para encontrar o nome correspondente ao id
  const getNameById = (id) => {
    const found = idIndexList.find((obj) => obj.id === id);
    return found ? found.name : id;
  };

  return (
    <>
      {item === null ? (
        ""
      ) : item && typeof item === "string" && item.startsWith("/images") ? (
        <Avatar
          alt="Imagem do Produto"
          src={`http://localhost:3000/static${item}`}
          sx={{ width: 30, height: 30 }}
        />
      ) : Array.isArray(item) ? (
        <Grid container direction="row" alignItems="center">
          {item.map((obj, index) => (
            <Grid item key={index} sx={{ mr: 1 }}>
              <Tooltip title={obj.name}>
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
                        alt="Imagem do Produto"
                        src={
                          obj.images
                            ? `http://localhost:3000/static${obj.images[0]}`
                            : `http://localhost:3000/static${obj.image}`
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
      ) : typeof item === "object" ? (
        item.name
      ) : typeof item === "number" ? (
        <>{column.label === "Valor" ? `R$${item.toFixed(2)}` : item}</>
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
        item
      )}
    </>
  );
};

export default DataTableCell;
