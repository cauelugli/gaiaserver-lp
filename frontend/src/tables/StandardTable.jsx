/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { useAppData } from "../AppDataContext";

import { TableRow, TableCell, Checkbox } from "@mui/material";

import RowButton from "../components/small/buttons/RowButton";
import DataTableCell from "../components/tableCells/DataTableCell";

function StandardTable(props) {
  const appData = useAppData();
  const { selectedMultipleItems, setSelectedMultipleItems } = props;

  const handleCheckboxChange = (item) => {
    setSelectedMultipleItems((prevSelectedItems) => {
      const isSelected = prevSelectedItems.some(
        (selectedItem) => selectedItem._id === item._id
      );
      if (isSelected) {
        return prevSelectedItems.filter(
          (selectedItem) => selectedItem._id !== item._id
        );
      } else {
        return [
          ...prevSelectedItems,
          { _id: item._id, name: item.name || item.title || item.number },
        ];
      }
    });
  };

  return (
    <>
      {props.filteredRows
        .slice(props.startIndex, props.endIndex)
        .map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {props.tableColumns[props.itemIndex].map((column, columnIndex) => (
              <TableCell key={columnIndex} align="left">
                <DataTableCell
                  mainColor={props.mainColor}
                  item={row[column.id]}
                  idIndexList={props.idIndexList}
                  column={column}
                />
              </TableCell>
            ))}
            <TableCell align="right">
              <RowButton
                userId={props.userId}
                mainColor={props.mainColor}
                item={row}
                page={props.page}
                tabIndex={props.tabIndex}
                refreshData={props.refreshData}
                setRefreshData={props.setRefreshData}
                multiple={props.multiple}
              />
            </TableCell>
            {props.multiple && (
              <TableCell id="multiple" sx={{ p: 0, m: 0, width: 30 }}>
                <Checkbox
                  sx={{ p: -1, m: -1 }}
                  size="small"
                  checked={selectedMultipleItems.some(
                    (selectedItem) => selectedItem._id === row._id
                  )}
                  onChange={() => handleCheckboxChange(row)}
                />
              </TableCell>
            )}
          </TableRow>
        ))}
    </>
  );
}

export default StandardTable;
