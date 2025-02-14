/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { TableRow, TableCell, TableSortLabel, Checkbox } from "@mui/material";

function ProductsTableHeader(props) {
  return (
    <TableRow
      sx={{
        "&:hover": {
          backgroundColor: props.themeBGColor,
        },
      }}
    >
      <TableCell align="left" id="image" sx={{ width: 40 }}>
        📷
      </TableCell>
      <TableCell
        align="left"
        id="name"
        sx={{
          fontSize: 13,
          fontWeight: "bold",
          width: 250,
        }}
      >
        Nome
      </TableCell>
      {props && props.itemSample && props.itemSample.fields
        ? props.itemSample.fields.map((headCell, cellIndex) => (
            <TableCell
              key={cellIndex}
              align={cellIndex === 0 ? "" : "left"}
              sx={{ fontSize: 13, fontWeight: "bold" }}
              sortDirection={
                props.orderBy === headCell.id ? props.order : false
              }
            >
              <TableSortLabel
                active={props.orderBy === headCell.id}
                direction={props.orderBy === headCell.id ? props.order : "asc"}
                onClick={() => props.handleRequestSort(headCell)}
              >
                {headCell.name}
              </TableSortLabel>
            </TableCell>
          ))
        : ""}
      <TableCell
        align="right"
        id="buyValue"
        sx={{ fontSize: 13, fontWeight: "bold", width: 120 }}
      >
        Valor de Compra
      </TableCell>
      <TableCell
        align="right"
        id="sellValue"
        sx={{ fontSize: 13, fontWeight: "bold", width: 120 }}
      >
        Valor de Venda
      </TableCell>
      <TableCell
        align="right"
        id="sellValue"
        sx={{ fontSize: 13, fontWeight: "bold", width: 80 }}
      >
        Em Estoque
      </TableCell>
      <TableCell
        align="center"
        sx={{ fontSize: 13, fontWeight: "bold", width: 80 }}
      >
        Ações
      </TableCell>
      {props.multiple && (
        <TableCell align="center" id="multiple" sx={{ p: 0, m: 0 }}>
          <Checkbox size="small" sx={{ p: -1, m: -1 }} />
        </TableCell>
      )}
    </TableRow>
  );
}

export default ProductsTableHeader;
