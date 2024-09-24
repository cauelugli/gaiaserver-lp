/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

import { TableRow, TableCell, Avatar } from "@mui/material";

import RowButton from "../buttons/RowButton";

function ProductsTable(props) {
  return (
    <>
      {props.items.length > 0 &&
        props.filteredRows.slice(props.startIndex, props.endIndex).map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            <TableCell align="left">
              <Avatar
                alt="Imagem do Produto"
                src={`http://localhost:3000/static${
                  row.images ? row.images[0] : undefined
                }`}
                sx={{ width: 30, height: 30 }}
              />
            </TableCell>
            <TableCell align="left">{row.name}</TableCell>
            {row.fields?.map((field, fieldIndex) => (
              <TableCell key={fieldIndex}>{field.value}</TableCell>
            ))}
            <TableCell align="center">
              <RowButton
                userId={props.userId}
                item={row}
                page={props.page}
                tabIndex={props.tabIndex}
                refreshData={props.refreshData}
                setRefreshData={props.setRefreshData}
                configCustomization={props.configCustomization}
              />
            </TableCell>
          </TableRow>
        ))}
    </>
  );
}

export default ProductsTable;
