/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { TableRow, TableCell, TableSortLabel, Checkbox } from "@mui/material";

function TableHeader(props) {
  return (
    <TableRow
      sx={{
        "&:hover": {
          backgroundColor: props.themeBGColor,
        },
      }}
    >
      {props.tableColumns[props.itemIndex].map((headCell, cellIndex) => (
        <TableCell
          key={cellIndex}
          align={cellIndex === 0 ? "" : "left"}
          sx={{
            fontSize: 13,
            fontWeight: "bold",
            width:
              cellIndex === 0
                ? 50
                : cellIndex === 1 && headCell.id === "type"
                ? 50
                : "auto",
          }}
          sortDirection={props.orderBy === headCell.id ? props.order : false}
        >
          <TableSortLabel
            active={props.orderBy === headCell.id}
            direction={props.orderBy === headCell.id ? props.order : "asc"}
            onClick={() => props.handleRequestSort(headCell.id)}
          >
            {headCell.label}
          </TableSortLabel>
        </TableCell>
      ))}
      <TableCell align="right" sx={{ fontSize: 13, fontWeight: "bold" }}>
        Ações
      </TableCell>
      {props.multiple && (
        <TableCell id="multiple" sx={{ p: 0, m: 0 }}>
          <Checkbox
            size="small"
            checked={true}
            disabled
            sx={{ p: -1, m: -1 }}
          />
        </TableCell>
      )}
    </TableRow>
  );
}

export default TableHeader;
