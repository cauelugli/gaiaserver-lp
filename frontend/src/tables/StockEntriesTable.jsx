/* eslint-disable react/prop-types */
import * as React from "react";
import axios from "axios";

import {
  Avatar,
  Box,
  Grid,
  Paper,
  Table,
  TableSortLabel,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function StockEntriesTable({ searchValue, searchOption }) {
  const [stockEntries, setStockEntries] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const stockEntries = await api.get("/stock");
        setStockEntries(stockEntries.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const tableHeaderRow = [
    {
      id: "number",
      label: "#",
    },
    {
      id: "items",
      label: "Itens",
    },
    {
      id: "quoteValue",
      label: "Valor dos Itens",
    },
    {
      id: "createdBy",
      label: "Criado por",
    },
    {
      id: "createdAt",
      label: "Adicionado em",
    },
  ];

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("number");

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedRows = React.useMemo(() => {
    return [...stockEntries].sort((a, b) => {
      const isAsc = order === "asc";
      if (isAsc) {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    });
  }, [stockEntries, order, orderBy]);

  return (
    <>
      <Box sx={{ minWidth: "1050px" }}>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow sx={{ backgroundColor: "#ccc" }}>
                {tableHeaderRow.map((headCell) => (
                  <TableCell
                    align={headCell.label === "#" ? "" : "center"}
                    sx={{
                      fontSize: 16,
                      fontWeight: "bold",
                      pl: headCell.label === "#" ? "" : 5,
                    }}
                    key={headCell.id}
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
                ))}
              </TableRow>
              {sortedRows
                .filter((entry) => {
                  const userProperty = searchOption
                    .split(".")
                    .reduce((obj, key) => obj[key], entry);
                  const lowerCaseUserProperty = userProperty
                    .toString()
                    .toLowerCase();
                  const lowerCaseSearchValue = searchValue
                    .toString()
                    .toLowerCase();
                  return (
                    !searchValue ||
                    lowerCaseUserProperty.includes(lowerCaseSearchValue)
                  );
                })

                .map((entry) => (
                  <>
                    <TableRow key={entry._id}>
                      <TableCell align="left">
                        <Typography>{entry.number}</Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Grid container direction="column">
                          {entry.items.map((item) => (
                            <Grid
                              key={item._id}
                              container
                              direction="row"
                              alignItems="center"
                              justifyContent="flex-start"
                            >
                              <Grid item sx={{ m: 0.5 }}>
                                <Avatar
                                  src={`http://localhost:3000/static/${item.item.image}`}
                                  alt={item.item.name[0]}
                                  cursor="pointer"
                                  sx={{
                                    width: 26,
                                    height: 26,
                                  }}
                                />
                              </Grid>
                              <Grid item>
                                <Typography>
                                  {item.item.name} x{item.quantity} = R$
                                  {item.buyValue * item.quantity}
                                </Typography>
                              </Grid>
                            </Grid>
                          ))}
                        </Grid>
                      </TableCell>
                      <TableCell align="center">
                        <Typography>R${entry.quoteValue.toFixed(2)}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography>{entry.createdBy}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography>
                          {dayjs(entry.createdAt).format("DD/MM/YYYY")}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
