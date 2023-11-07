/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";
import dayjs from "dayjs";

import {
  Dialog,
  Box,
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Grid,
  Avatar,
  TableSortLabel,
  IconButton,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

export default function QuoteTable({ searchValue, searchOption, quotes }) {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [selectedQuote, setSelectedQuote] = React.useState([]);

  const handleOpenDetail = (sale) => {
    setOpenDetail(!openDetail);
    setSelectedQuote(sale);
  };

  const handleOpenEdit = (sale) => {
    setOpenEdit(!openEdit);
    setSelectedQuote(sale);
  };

  const handleConfirmDelete = (sale) => {
    setSelectedQuote(sale);
    setOpenDelete(!openDelete);
  };

  const tableHeaderRow = [
    {
      id: "number",
      label: "#",
    },
    {
      id: "materials",
      label: "Itens",
    },
    {
      id: "customer.name",
      label: "Cliente",
    },
    {
      id: "user.name",
      label: "Colaborador",
    },
    {
      id: "value",
      label: "Valor",
    },
    {
      id: "department",
      label: "Departamento",
    },
    {
      id: "actions",
      label: "Ações",
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
    const compare = (a, b) => {
      const sellerA = a.seller ? a.seller.name : "";
      const sellerB = b.seller ? b.seller.name : "";

      if (order === "asc") {
        return sellerA.localeCompare(sellerB);
      } else {
        return sellerB.localeCompare(sellerA);
      }
    };

    if (orderBy === "user.name") {
      return [...quotes].sort(compare);
    }

    return [...quotes].sort((a, b) => {
      const isAsc = order === "asc";
      if (isAsc) {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    });
  }, [quotes, order, orderBy]);

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: "100%" }}>
          <TableBody>
            <TableRow
              sx={{
                backgroundColor: "#ccc",
              }}
            >
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
              // .filter((user) => {
              //   const userProperty = searchOption
              //     .split(".")
              //     .reduce((obj, key) => obj[key], user);
              //   return (
              //     userProperty &&
              //     userProperty.toLowerCase().includes(searchValue.toLowerCase())
              //   );
              // })
              .map((quote) => (
                <>
                  <TableRow
                    key={quote._id}
                    sx={{
                      backgroundColor:
                        selectedQuote._id === quote._id && openDetail
                          ? "#eee"
                          : "none",
                      "&:hover": { backgroundColor: "#eee " },
                    }}
                  >
                    <TableCell align="left">{quote.number}</TableCell>
                    <TableCell align="center">
                      <Grid container direction="row" justifyContent="center">
                        {quote.materials.slice(0, 3).map((item) => (
                          <Grid
                            direction="column"
                            key={item.id}
                            alignItems="center"
                            sx={{ mr: 1 }}
                          >
                            <Grid item>
                              <Avatar
                                alt="Imagem do Produto"
                                src={`http://localhost:3000/static/${item.image}`}
                                sx={{ width: 32, height: 32, mx: "auto" }}
                              />
                            </Grid>
                            <Grid item>
                              <Typography sx={{ fontSize: 12 }}>
                                x{item.quantity}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography sx={{ fontSize: 12, color: "#777" }}>
                                {item.name}
                              </Typography>
                            </Grid>
                          </Grid>
                        ))}
                        {quote.materials.length > 3 && (
                          <Typography
                            sx={{
                              marginY: "auto",
                              fontSize: 24,
                              color: "#444",
                            }}
                          >
                            +{quote.materials.length - 3}
                          </Typography>
                        )}
                      </Grid>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ mt: 1, fontSize: 14 }}>
                        {quote.customer}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">{quote.user}</TableCell>
                    <TableCell align="center">
                      R${quote.value.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">{quote.department}</TableCell>
                    <TableCell align="center" sx={{ py: 0 }}>
                      <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <IconButton>
                          <VisibilityIcon
                            cursor="pointer"
                            // onClick={() => handleOpenView(quote)}
                            sx={{ color: "#333" }}
                          />
                        </IconButton>
                        <IconButton sx={{ mx: -1 }}></IconButton>
                        <IconButton>
                          <PictureAsPdfIcon
                            cursor="pointer"
                            // onClick={() => handleOpenPDF(quote)}
                            sx={{ color: "#444" }}
                          />
                        </IconButton>
                      </Grid>
                    </TableCell>
                  </TableRow>
                </>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
