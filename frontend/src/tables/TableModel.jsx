/* eslint-disable react/prop-types */
import * as React from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  Box,
  Paper,
  Table,
  TableSortLabel,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TablePagination,
  Avatar,
} from "@mui/material";

import RowButton from "../buttons/RowButton";

import DataTableCell from "../components/tableCells/DataTableCell";

export default function TableModel(props) {
  const [idIndexList, setIdIndexList] = React.useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("number");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const ids = await api.get("/idIndexList");
        setIdIndexList(ids.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [props.items]);

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
    <Box sx={{ width: props.topBar ? "105%" : "100%", minHeight: "50vw" }}>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableBody>
            <TableRow>
              {props.page === "products" || props.page === "materials" ? (
                <>
                  <TableCell align="left" id="image">
                    📷
                  </TableCell>
                  <TableCell
                    align="left"
                    id="name"
                    sx={{
                      fontSize: 13,
                      fontWeight: "bold",
                    }}
                  >
                    Nome
                  </TableCell>
                  {props.items[props.itemIndex]?.fields
                    ? props.items[props.itemIndex].fields.map(
                        (headCell, cellIndex) => (
                          <TableCell
                            key={cellIndex}
                            align={cellIndex === 0 ? "" : "left"}
                            sx={{
                              fontSize: 13,
                              fontWeight: "bold",
                            }}
                            sortDirection={
                              orderBy === headCell.id ? order : false
                            }
                          >
                            <TableSortLabel
                              active={orderBy === headCell.id}
                              direction={
                                orderBy === headCell.id ? order : "asc"
                              }
                              onClick={() => handleRequestSort(headCell)}
                            >
                              {headCell.name}
                            </TableSortLabel>
                          </TableCell>
                        )
                      )
                    : ""}
                </>
              ) : (
                props.tableColumns[props.itemIndex].map(
                  (headCell, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      align={cellIndex === 0 ? "" : "left"}
                      sx={{
                        fontSize: 13,
                        fontWeight: "bold",
                      }}
                      sortDirection={orderBy === headCell.id ? order : false}
                    >
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : "asc"}
                        onClick={() => handleRequestSort(headCell.id)}
                      >
                        {headCell.label}
                      </TableSortLabel>
                    </TableCell>
                  )
                )
              )}
              <TableCell
                align="center"
                sx={{
                  fontSize: 13,
                  fontWeight: "bold",
                }}
              >
                Ações
              </TableCell>
            </TableRow>
            {props.page === "products" || props.page === "materials"
              ? props.items.length > 0 &&
                filteredRows
                  .slice(startIndex, endIndex)
                  .map((row, rowIndex) => (
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
                          item={row}
                          page={props.page}
                          tabIndex={props.tabIndex}
                          refreshData={props.refreshData}
                          setRefreshData={props.setRefreshData}
                          configCustomization={props.configCustomization}
                        />
                      </TableCell>
                    </TableRow>
                  ))
              : filteredRows
                  .filter((row) => {
                    if (props.page === "quotes") {
                      if (props.tabIndex === 0) return row.type === "job";
                      if (props.tabIndex === 1) return row.type === "sale";
                    }
                    return true;
                  })
                  .slice(startIndex, endIndex)
                  .map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {props.tableColumns[props.itemIndex].map(
                        (column, columnIndex) => (
                          <TableCell
                            key={columnIndex}
                            align={columnIndex === 0 ? "" : "left"}
                          >
                            <DataTableCell
                              item={row[column.id]}
                              idIndexList={idIndexList}
                            />
                          </TableCell>
                        )
                      )}

                      <TableCell align="center">
                        <RowButton
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
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredRows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={"por Página"}
          labelDisplayedRows={({ from, to, count }) => {
            return " " + from + " à " + to + " total " + count;
          }}
        />
      </TableContainer>
    </Box>
  );
}
