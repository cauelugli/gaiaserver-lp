/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";

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
  TablePagination,
  Button,
} from "@mui/material";

import RequestApproval from "../components/small/buttons/RequestApproval";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function StockEntriesTable({
  stockEntries,
  userName,
  userRole,
  userDepartment,
  refreshData,
  setRefreshData,
  configData,
  topBar,
}) {
  

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
      id: "status",
      label: "Status",
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

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const handleApproveReprove = async (entry, status) => {
    try {
      const res = await api.put("/stock/managerApproval", {
        entry,
        entryId: entry._id,
        userName,
        type: entry.type,
        status: status,
      });
      if (res.data) {
        toast.success("Solicitação Respondida!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        setRefreshData(!refreshData);
      }
    } catch (err) {
      console.log("err", err);
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
    }
  };

  return (
    <Box sx={{ width: topBar ? "105%" : "100%", minHeight: "50vw" }}>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              {tableHeaderRow.map((headCell) => (
                <TableCell
                  align={headCell.label === "#" ? "" : "center"}
                  sx={{
                    fontSize: 13,
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
              .map((entry) => (
                <>
                  <TableRow key={entry._id}>
                    <TableCell align="left">
                      <Typography sx={{ fontSize: 13 }}>
                        {entry.number}
                      </Typography>
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
                              <Typography sx={{ fontSize: 13 }}>
                                {item.item.name} x{item.quantity} = R$
                                {(item.buyValue * item.quantity).toFixed(2)}
                              </Typography>
                            </Grid>
                          </Grid>
                        ))}
                      </Grid>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: 13 }}>
                        R${entry.quoteValue.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: 13 }}>
                        {entry.createdBy}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Grid
                        container
                        direction="row"
                        alignContent="center"
                        justifyContent="center"
                      >
                        <Typography sx={{ fontSize: 13, my: "auto" }}>
                          {entry.status === "Aprovação Solicitada" &&
                          userRole.name === "Gerente" &&
                          userDepartment.name ===
                            configData.stockentriesDispatcherDepartment.name ? (
                            <Grid container direction="row">
                              <Button
                                onClick={() =>
                                  handleApproveReprove(entry, "Aprovado")
                                }
                                size="small"
                                variant="contained"
                                color="success"
                              >
                                Aprovar
                              </Button>
                              <Button
                                onClick={() =>
                                  handleApproveReprove(entry, "Reprovado")
                                }
                                size="small"
                                variant="contained"
                                color="error"
                                sx={{ ml: 1 }}
                              >
                                Reprovar
                              </Button>
                            </Grid>
                          ) : (
                            <Typography
                              sx={{
                                fontSize: 13,
                                color: entry.status === "Contestado" && "red",
                              }}
                            >
                              {entry.status}
                            </Typography>
                          )}
                        </Typography>
                        {entry.status === "Aberto" &&
                          configData.stockEntriesNeedApproval && (
                            <RequestApproval
                              userName={userName}
                              entry={entry}
                              refreshData={refreshData}
                              setRefreshData={setRefreshData}
                              dispatcherManager={
                                configData.stockentriesDispatcherDepartment
                                  .manager
                              }
                            />
                          )}
                      </Grid>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: 13 }}>
                        {dayjs(entry.createdAt).format("DD/MM/YYYY")}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </>
              ))
              .slice(startIndex, endIndex)}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={sortedRows.length}
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
