/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";

import {
  Box,
  Dialog,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from "@mui/material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import AddSchedulePaymentForm from "../forms/add/AddSchedulePaymentForm";
import EditStatusForm from "../forms/edit/EditStatusForm";
import StatusButton from "../components/small/buttons/StatusButton";

export default function FinanceIncomeTable({
  incoming,
  toast,
  searchValue,
  searchOption,
  refreshData,
  setRefreshData,
}) {
  const [selectedFinanceIncome, setSelectedFinanceIncome] = React.useState("");
  const [previousStatus, setPreviousStatus] = React.useState("");
  const [newStatus, setNewStatus] = React.useState("");
  const [openSchedulePayment, setOpenSchedulePayment] = React.useState(false);
  const [hoveredIncome, setHoveredIncome] = React.useState(null);

  const [openConfirmChangeStatus, setOpenConfirmChangeStatus] =
    React.useState(false);

  const handleOpenAddSchedulePayment = (income) => {
    setSelectedFinanceIncome(income);
    setOpenSchedulePayment(!openSchedulePayment);
  };

  const handleStatusChange = (newStatus) => {
    setPreviousStatus(selectedFinanceIncome.status);
    setNewStatus(newStatus);
    setOpenConfirmChangeStatus(!openConfirmChangeStatus);
  };

  const tableHeaderRow = [
    {
      id: "quote",
      label: "Orçamento",
    },
    {
      id: "type",
      label: "Tipo",
    },
    {
      id: "payment",
      label: "Pagamento",
    },
    {
      id: "department",
      label: "Departamento",
    },
    {
      id: "price",
      label: "Valor",
    },
    {
      id: "status",
      label: "Status",
    },
    {
      id: "actions",
      label: "Ações",
    },
  ];

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("quote");

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedRows = React.useMemo(() => {
    const compare = (a, b) => {
      const departmentA = a.department ? a.department.name : "";
      const departmentB = b.department ? b.department.name : "";

      if (order === "asc") {
        return departmentA.localeCompare(departmentB);
      } else {
        return departmentB.localeCompare(departmentA);
      }
    };

    if (orderBy === "position.name") {
      return [...incoming].sort(compare);
    }

    return [...incoming].sort((a, b) => {
      const isAsc = order === "asc";
      if (isAsc) {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    });
  }, [incoming, order, orderBy]);

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

  return (
    <>
      <Box sx={{ minWidth: "1050px" }}>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow
                sx={{
                  backgroundColor: "#ccc",
                }}
              >
                {tableHeaderRow.map((headCell) => (
                  <TableCell
                    align={headCell.label === "Orçamento" ? "" : "center"}
                    sx={{
                      fontSize: 14,
                      fontWeight: "bold",
                      pl: headCell.label === "Orçamento" ? "" : 5,
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
                .slice(startIndex, endIndex)
                .filter((user) => {
                  const userProperty = searchOption
                    .split(".")
                    .reduce((obj, key) => obj[key], user);
                  return (
                    userProperty &&
                    userProperty
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                  );
                })
                .map((income) => (
                  <>
                    <TableRow
                      key={income._id}
                      sx={{
                        "&:hover": { backgroundColor: "#eee " },
                      }}
                    >
                      <TableCell>
                        <Typography sx={{ fontSize: 14 }}>
                          {income.quote}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography sx={{ fontSize: 14 }}>
                          {income.type.charAt(0).toUpperCase() +
                            income.type.slice(1)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" >
                        <Typography
                          sx={{ fontSize: 14 }}
                          onMouseEnter={() => setHoveredIncome(income)}
                          onMouseLeave={() => setHoveredIncome(null)}
                        >
                          {income.payment
                            ? income.payment.paymentOption +
                              ` | ` +
                              income.payment.paymentMethod
                            : "Não há Agendamento"}
                        </Typography>
                        {hoveredIncome === income && (
                          <Paper
                            onMouseEnter={() => setHoveredIncome(income)}
                            onMouseLeave={() => setHoveredIncome(null)}
                            style={{
                              position: "absolute",
                              width: 250,
                              height: 200,
                              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                              bottom: "20%",
                              left: "14%",
                              zIndex: 999,
                              border: "2px solid #444",
                              borderRadius: 15,
                            }}
                          >
                            <Grid
                              container
                              direction="column"
                              alignItems="flex-start"
                              justifyContent="center"
                              sx={{ ml: 2 }}
                            >
                              <Grid item sx={{ mt: 1 }}>
                                <Typography>
                                  Orçamento: {income.quote}
                                </Typography>
                              </Grid>
                              <Grid item sx={{ mt: 1 }}>
                                <Typography>
                                  Valor: R${income.payment.finalPrice}
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Typography sx={{ mt: 1 }}>
                                  Método: {income.payment.paymentMethod}
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Typography sx={{ mt: 1 }}>
                                  Opção: {income.payment.paymentOption}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Paper>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Typography sx={{ fontSize: 14 }}>
                          {income.department}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography sx={{ fontSize: 14 }}>
                          R${income.price.toFixed(2)}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <StatusButton
                          status={income.status}
                          changedStatus={(newStatus) =>
                            handleStatusChange(newStatus)
                          }
                          onMouseEnter={() => setSelectedFinanceIncome(income)}
                        />
                      </TableCell>

                      <TableCell align="center" sx={{ py: 0 }}>
                        <Grid
                          container
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Tooltip
                            title={
                              income.payment ? (
                                <Typography sx={{ fontSize: 12 }}>
                                  Agendamento Realizado
                                </Typography>
                              ) : (
                                <Typography sx={{ fontSize: 12 }}>
                                  Agendar Pagamento
                                </Typography>
                              )
                            }
                          >
                            <span>
                              <IconButton disabled={income.payment}>
                                <CalendarMonthIcon
                                  cursor="pointer"
                                  onClick={() =>
                                    handleOpenAddSchedulePayment(income)
                                  }
                                />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  </>
                ))}
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
        {openSchedulePayment && (
          <Dialog
            fullWidth
            maxWidth="lg"
            open={openSchedulePayment}
            onClose={() => setOpenSchedulePayment(!openSchedulePayment)}
          >
            <AddSchedulePaymentForm
              openEdit={openSchedulePayment}
              selectedFinanceIncome={selectedFinanceIncome}
              previousMaterials={selectedFinanceIncome.materials}
              setOpenEdit={setOpenSchedulePayment}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              toast={toast}
            />
          </Dialog>
        )}
        {openConfirmChangeStatus && (
          <Dialog
            fullWidth
            maxWidth="sm"
            open={openConfirmChangeStatus}
            onClose={() => setOpenConfirmChangeStatus(!openConfirmChangeStatus)}
          >
            <EditStatusForm
              endpoint={"/finances/status"}
              selectedItem={selectedFinanceIncome}
              openEdit={openConfirmChangeStatus}
              setOpenEdit={setOpenConfirmChangeStatus}
              prevStatus={previousStatus}
              newData={newStatus}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              toast={toast}
            />
          </Dialog>
        )}
      </Box>
    </>
  );
}
