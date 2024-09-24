/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { TableRow, TableCell, TableSortLabel } from "@mui/material";

function ProductsTableHeader(props) {
  return (
    <TableRow>
      <TableCell align="left" id="image">
        📷
      </TableCell>
      <TableCell
        align="left"
        id="name"
        sx={{ fontSize: 13, fontWeight: "bold" }}
      >
        Nome
      </TableCell>
      {props.itemSample &&
        props.itemSample.fields.map((headCell, cellIndex) => (
          <TableCell
            key={cellIndex}
            align={cellIndex === 0 ? "" : "left"}
            sx={{ fontSize: 13, fontWeight: "bold" }}
            sortDirection={props.orderBy === headCell.id ? props.order : false}
          >
            <TableSortLabel
              active={props.orderBy === headCell.id}
              direction={props.orderBy === headCell.id ? props.order : "asc"}
              onClick={() => props.handleRequestSort(headCell)}
            >
              {headCell.name}
            </TableSortLabel>
          </TableCell>
        ))}

      <TableCell align="center" sx={{ fontSize: 13, fontWeight: "bold" }}>
        Ações
      </TableCell>
    </TableRow>
  );
}

export default ProductsTableHeader;
