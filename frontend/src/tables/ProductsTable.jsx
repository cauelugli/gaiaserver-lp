/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { useAppData } from "../AppDataContext";

import { TableRow, TableCell, Avatar, Checkbox } from "@mui/material";

import RowButton from "../components/small/buttons/RowButton";

function ProductsTable(props) {
  const appData = useAppData();
  return (
    <>
      {props.items.length > 0 &&
        props.filteredRows
          .slice(props.startIndex, props.endIndex)
          .map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell align="left">
                <Avatar
                  alt="Imagem do Produto"
                  src={`http://localhost:8080/static${
                    row.images ? row.images[0] : undefined
                  }`}
                  sx={{ width: 30, height: 30 }}
                />
              </TableCell>
              <TableCell align="left">{row.name}</TableCell>
              {row.fields?.map((field, fieldIndex) => (
                <TableCell key={fieldIndex}>{field.value}</TableCell>
              ))}
              <TableCell align="right">R${row.buyValue?.toFixed(2)}</TableCell>
              <TableCell align="right">R${row.sellValue?.toFixed(2)}</TableCell>
              <TableCell align="right">{row.stockQuantity}</TableCell>
              <TableCell align="center">
                <RowButton
                  userId={props.userId}
                  mainColor={props.mainColor}
                  item={row}
                  page={props.page}
                  tabIndex={props.tabIndex}
                  refreshData={props.refreshData}
                  setRefreshData={props.setRefreshData}
                  configCustomization={props.configCustomization}
                  multiple={props.multiple}
                />
              </TableCell>
              {props.multiple && (
                <TableCell align="center" id="multiple" sx={{ p: 0, m: 0 }}>
                  <Checkbox size="small" sx={{ p: -1, m: -1 }} />
                </TableCell>
              )}
            </TableRow>
          ))}
    </>
  );
}

export default ProductsTable;
