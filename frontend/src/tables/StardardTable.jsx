/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

import { TableRow, TableCell } from "@mui/material";

import RowButton from "../buttons/RowButton";
import DataTableCell from "../components/tableCells/DataTableCell";

function StandardTable({
  filteredRows,
  startIndex,
  endIndex,
  tableColumns,
  itemIndex,
  idIndexList,
  page,
  tabIndex,
  userId,
  refreshData,
  setRefreshData,
  configCustomization,
}) {
  return (
    <>
      {filteredRows.slice(startIndex, endIndex).map((row, rowIndex) => (
        <TableRow key={rowIndex}>
          {tableColumns[itemIndex].map((column, columnIndex) => (
            <TableCell
              key={columnIndex}
              align={columnIndex === 0 ? "" : "left"}
            >
              <DataTableCell item={row[column.id]} idIndexList={idIndexList} />
            </TableCell>
          ))}
          <TableCell align="center">
            <RowButton
              userId={userId}
              item={row}
              page={page}
              tabIndex={tabIndex}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              configCustomization={configCustomization}
            />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default StandardTable;
