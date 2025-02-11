/* eslint-disable react/prop-types */
import React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
} from "@mui/material";

import TableHeader from "../../src/tables/TableHeader";
import ProductsTableHeader from "../../src/tables/ProductsTableHeader";
import ProductsTable from "../../src/tables/ProductsTable";
import StandardTable from "./StandardTable";
import { useAppData } from "../AppDataContext";

export default function TableModel(props) {
  const appData = useAppData();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("number");

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedRows = React.useMemo(() => {
    return [...props.items].sort((a, b) => {
      const isAsc = order === "asc";
      if (isAsc) {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    });
  }, [props.items, order, orderBy]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const filteredRows = React.useMemo(() => {
    if (props.page === "users" && props.tabIndex === 0) {
      return sortedRows.filter((row) => !row.isManager);
    } else if (props.page === "users" && props.tabIndex === 1) {
      return sortedRows.filter((row) => row.isManager);
    }
    return sortedRows;
  }, [sortedRows, props.page, props.tabIndex]);

  return (
    <Box sx={{ minHeight: "50vw" }}>
      <TableContainer component={Paper}>
        <Table size="small">
          {props.page === "products" ? (
            <ProductsTableHeader
              themeBGColor={props.themeBGColor}
              itemSample={props.items ? props.items[0] : null}
              order={order}
              orderBy={orderBy}
              handleRequestSort={handleRequestSort}
              multiple={props.multiple}
            />
          ) : (
            <TableHeader
              themeBGColor={props.themeBGColor}
              itemIndex={props.itemIndex}
              tableColumns={props.tableColumns}
              order={order}
              orderBy={orderBy}
              handleRequestSort={handleRequestSort}
              multiple={props.multiple}
            />
          )}

          <TableBody>
            {props.page === "products" ? (
              <ProductsTable
                items={props.items}
                mainColor={props.mainColor}
                filteredRows={filteredRows}
                startIndex={startIndex}
                endIndex={endIndex}
                page={props.page}
                userId={props.userId}
                tabIndex={props.tabIndex}
                refreshData={props.refreshData}
                setRefreshData={props.setRefreshData}
                configCustomization={props.configCustomization}
                multiple={props.multiple}
                selectedMultipleItems={props.selectedMultipleItems}
                setSelectedMultipleItems={props.setSelectedMultipleItems}
              />
            ) : (
              <StandardTable
                configData={props.configData}
                mainColor={props.mainColor}
                filteredRows={filteredRows}
                startIndex={startIndex}
                endIndex={endIndex}
                tableColumns={props.tableColumns}
                itemIndex={props.itemIndex}
                idIndexList={appData.idIndexList}
                page={props.page}
                tabIndex={props.tabIndex}
                userId={props.userId}
                refreshData={props.refreshData}
                setRefreshData={props.setRefreshData}
                configCustomization={props.configCustomization}
                multiple={props.multiple}
                selectedMultipleItems={props.selectedMultipleItems}
                setSelectedMultipleItems={props.setSelectedMultipleItems}
                requestsApproverManager={props.requestsApproverManager}
                stockApproverManager={props.stockApproverManager}
                requestsApproverAlternate={props.requestsApproverAlternate}
                stockApproverAlternate={props.stockApproverAlternate}
              />
            )}
          </TableBody>

          <TablePagination
            count={filteredRows.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={"por Página"}
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count}`
            }
          />
        </Table>
      </TableContainer>
    </Box>
  );
}
