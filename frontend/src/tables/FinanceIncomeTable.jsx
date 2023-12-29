/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";
import dayjs from "dayjs";

import {
  Box,
  Checkbox,
  CircularProgress,
  Dialog,
  FormHelperText,
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

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckIcon from "@mui/icons-material/Check";
import PaymentsIcon from "@mui/icons-material/Payments";

import AddPaymentScheduleForm from "../forms/add/AddPaymentScheduleForm";
import CashPaymentForm from "../forms/add/CashPaymentForm";
import EditStatusForm from "../forms/edit/EditStatusForm";
import AddParcelPaymentForm from "../forms/add/AddParcelPaymentForm";

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
  const [hoveredIncome, setHoveredIncome] = React.useState(null);
  const [openSchedulePayment, setOpenSchedulePayment] = React.useState(false);
  const [openCashPayment, setOpenCashPayment] = React.useState(false);
  const [openAddParcelPayment, setOpenAddParcelPayment] = React.useState(false);
  const [openAddFullPayment, setOpenAddFullPayment] = React.useState(false);

  const [openConfirmChangeStatus, setOpenConfirmChangeStatus] =
    React.useState(false);

  const handleOpenAddSchedulePayment = (income) => {
    setSelectedFinanceIncome(income);
    setOpenSchedulePayment(!openSchedulePayment);
  };

  const handleOpenAddCashPayment = (income) => {
    setSelectedFinanceIncome(income);
    setOpenCashPayment(!openCashPayment);
  };

  const handleOpenAddParcelPayment = (income) => {
    setSelectedFinanceIncome(income);
    setOpenAddParcelPayment(!openAddParcelPayment);
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
      id: "createdAt",
      label: "Criado em",
    },
    {
      id: "actions",
      label: "Ações",
    },
  ];

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("status");

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

  const [showCompletedIncomes, setshowCompletedIncomes] = React.useState(false);
  const handleChangeshowCompletedIncomes = () => {
    setshowCompletedIncomes(!showCompletedIncomes);
  };

  return (
    <>
    <Box sx={{ minWidth: "1250px" }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: -5.5 }}>
          <Checkbox
            checked={showCompletedIncomes}
            onChange={handleChangeshowCompletedIncomes}
          />
          <Typography sx={{ fontSize: 13, mt: 1.5, ml: -1 }}>
            Mostrar Pagos
          </Typography>
        </Box>{" "}
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
                      fontSize: 13,
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
                .filter((income) => {
                  if (!income) return false;
                  const userProperty = searchOption
                    .split(".")
                    .reduce((obj, key) => obj[key], income);
                  // Verifica se a condição para aplicar o filtro é atendida
                  const shouldShowincome =
                    userProperty &&
                    userProperty
                      .toLowerCase()
                      .includes(searchValue.toLowerCase());

                  // Se a opção para mostrar incomes concluídos estiver desmarcada, oculta os incomes concluídos
                  return (
                    shouldShowincome &&
                    (showCompletedIncomes || income.status !== "Pago")
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
                        <Typography sx={{ fontSize: 13 }}>
                          {income.quote}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography sx={{ fontSize: 13 }}>
                          {income.type.charAt(0).toUpperCase() +
                            income.type.slice(1)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          sx={{ fontSize: 13 }}
                          onMouseEnter={() => setHoveredIncome(income)}
                          onMouseLeave={() => setHoveredIncome(null)}
                        >
                          {income.payment && income.payment.cash ? (
                            <Tooltip
                              title={
                                <Typography sx={{ fontSize: 12 }}>
                                  Pago em {income.paidAt}
                                </Typography>
                              }
                            >
                              A vista | {income.payment.method}
                            </Tooltip>
                          ) : income.payment ? (
                            income.payment.paymentOption +
                            ` | ` +
                            income.payment.paymentMethod
                          ) : (
                            "Não Realizado"
                          )}
                        </Typography>
                        {income.payment &&
                          income.payment.paymentOption === "Parcelado" &&
                          hoveredIncome === income && (
                            <Paper
                              onMouseEnter={() => setHoveredIncome(income)}
                              onMouseLeave={() => setHoveredIncome(null)}
                              style={{
                                position: "absolute",
                                width: 420,
                                height: "auto",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                bottom: "25%",
                                left: "14%",
                                zIndex: 999,
                                border: "2px solid #444",
                                borderRadius: 15,
                              }}
                            >
                              <Grid
                                container
                                direction="row"
                                alignItems="center"
                                justifyContent="flex-start"
                                sx={{ my: "2%", ml: "2%" }}
                              >
                                <Grid item>
                                  <Typography sx={{ fontSize: 13 }}>
                                    <strong>Orçamento:</strong> {income.quote}
                                  </Typography>
                                  <Typography sx={{ fontSize: 13, mt: 2 }}>
                                    <strong>Método:</strong>{" "}
                                    {income.payment.paymentMethod}
                                  </Typography>
                                  <Typography sx={{ fontSize: 13, mt: 2 }}>
                                    <strong>Opção:</strong>{" "}
                                    {income.payment.paymentOption}
                                  </Typography>
                                  <Typography sx={{ fontSize: 13, mt: 2 }}>
                                    <strong>Valor:</strong> R$
                                    {income.payment.finalPrice}
                                  </Typography>
                                  {income.payment.hasParcelMonthlyFee && (
                                    <FormHelperText
                                      sx={{ fontSize: 11, my: -0.5, ml: 2 }}
                                    >
                                      (Juros Mensais de{" "}
                                      <strong>
                                        {income.payment.parcelMonthlyFee}%
                                      </strong>
                                      )
                                    </FormHelperText>
                                  )}
                                </Grid>
                                <Grid
                                  item
                                  direction="column"
                                  alignItems="center"
                                  justifyContent="center"
                                  sx={{ width: "55%" }}
                                >
                                  <Box
                                    sx={{
                                      mt: 1,
                                      position: "relative",
                                      display: "inline-flex",
                                    }}
                                  >
                                    <CircularProgress
                                      variant="determinate"
                                      size={80}
                                      color={
                                        income.status === "Pago"
                                          ? "success"
                                          : "primary"
                                      }
                                      value={(
                                        (Object.values(
                                          income.payment.paymentDates
                                        )
                                          .map((item) =>
                                            item.status === "Pago" ? 1 : 0
                                          )
                                          .reduce(
                                            (acc, curr) => acc + curr,
                                            0
                                          ) /
                                          income.payment.parcelQuantity) *
                                        100
                                      ).toFixed(2)}
                                    />
                                    <Box
                                      sx={{
                                        top: 0,
                                        left: 0,
                                        bottom: 0,
                                        right: 0,
                                        position: "absolute",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <Typography>
                                        {Object.values(
                                          income.payment.paymentDates
                                        )
                                          .map((item) =>
                                            item.status === "Pago" ? 1 : 0
                                          )
                                          .reduce(
                                            (acc, curr) => acc + curr,
                                            0
                                          )}{" "}
                                        / {income.payment.parcelQuantity}
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <Grid
                                    container
                                    direction="column"
                                    spacing={0.5}
                                    columns={2}
                                  >
                                    <Grid item xl={4}>
                                      {Object.values(
                                        income.payment.paymentDates
                                      ).map((item, index) => (
                                        <Typography
                                          key={index}
                                          sx={{
                                            fontSize: 11,
                                            color:
                                              item.status === "Pago"
                                                ? "darkgreen"
                                                : "#777",
                                          }}
                                        >
                                          R${item.parcelValue}
                                          {" - "}
                                          {item.date}{" "}
                                          {item.status === "Pago" ? (
                                            <CheckIcon sx={{ fontSize: 12 }} />
                                          ) : (
                                            <AccessTimeIcon
                                              sx={{
                                                fontSize: 12,
                                                mb: -0.25,
                                                ml: 0.5,
                                              }}
                                            />
                                          )}
                                        </Typography>
                                      ))}
                                    </Grid>
                                    {income.status === "Pago" && (
                                      <Typography
                                        sx={{
                                          my: 1,
                                          fontSize: 12,
                                          color: "#777",
                                        }}
                                      >
                                        Pago em: {income.paidAt}
                                      </Typography>
                                    )}
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Paper>
                          )}
                      </TableCell>
                      <TableCell align="center">
                        <Typography sx={{ fontSize: 13 }}>
                          {income.department}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography sx={{ fontSize: 13 }}>
                          R${income.price}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography sx={{ fontSize: 13 }}>
                          {!income.payment
                            ? "Aguardando Agendamento"
                            : income.status}
                        </Typography>
                      </TableCell>

                    <TableCell align="center">
                      <Typography sx={{ fontSize: 13 }}>
                        {dayjs(income.createdAt).format("DD/MM/YYYY")}
                      </Typography>
                    </TableCell>

                      <TableCell align="center" sx={{ py: 0 }}>
                        {!income.payment &&
                          income.status === "Aguardando Agendamento" && (
                            <Grid
                              container
                              direction="row"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Tooltip
                                title={
                                  <Typography sx={{ fontSize: 12 }}>
                                    Agendar Pagamento
                                  </Typography>
                                }
                              >
                                <span>
                                  <IconButton>
                                    <CalendarMonthIcon
                                      cursor="pointer"
                                      onClick={() =>
                                        handleOpenAddSchedulePayment(income)
                                      }
                                    />
                                  </IconButton>
                                </span>
                              </Tooltip>
                              <Tooltip
                                title={
                                  <Typography sx={{ fontSize: 12 }}>
                                    Receber a Vista
                                  </Typography>
                                }
                              >
                                <span>
                                  <IconButton>
                                    <AttachMoneyIcon
                                      cursor="pointer"
                                      onClick={() =>
                                        handleOpenAddCashPayment(income)
                                      }
                                    />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </Grid>
                          )}
                        {income.payment &&
                          income.payment.paymentDates &&
                          income.status !== "Pago" && (
                            <Tooltip
                              title={
                                <Typography sx={{ fontSize: 12 }}>
                                  Receber Parcela
                                </Typography>
                              }
                            >
                              <span>
                                <IconButton>
                                  <PaymentsIcon
                                    cursor="pointer"
                                    onClick={() =>
                                      handleOpenAddParcelPayment(income)
                                    }
                                  />
                                </IconButton>
                              </span>
                            </Tooltip>
                          )}
                        {income.status !== "Pago" &&
                          income.payment &&
                          !income.payment.paymentDates && (
                            <Tooltip
                              title={
                                <Typography sx={{ fontSize: 12 }}>
                                  Receber a Vista
                                </Typography>
                              }
                            >
                              <span>
                                <IconButton>
                                  <AttachMoneyIcon
                                    cursor="pointer"
                                    onClick={() =>
                                      handleOpenAddCashPayment(income)
                                    }
                                  />
                                </IconButton>
                              </span>
                            </Tooltip>
                          )}
                        {income.status === "Pago" && (
                          <Tooltip
                            title={
                              <Typography sx={{ fontSize: 12 }}>
                                Pagamento Recebido
                              </Typography>
                            }
                          >
                            <span>
                              <IconButton>
                                <AttachMoneyIcon
                                  disabled
                                  sx={{ color: "darkgreen" }}
                                />
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}
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
        {openAddParcelPayment && (
          <Dialog
            fullWidth
            maxWidth="lg"
            open={openAddParcelPayment}
            onClose={() => setOpenAddParcelPayment(!openAddParcelPayment)}
          >
            <AddParcelPaymentForm
              selectedFinanceIncome={selectedFinanceIncome}
              openEdit={openAddParcelPayment}
              setOpenEdit={setOpenAddParcelPayment}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              toast={toast}
            />
          </Dialog>
        )}
        {openCashPayment && (
          <Dialog
            fullWidth
            maxWidth="md"
            open={openCashPayment}
            onClose={() => setOpenCashPayment(!openCashPayment)}
          >
            <CashPaymentForm
              selectedFinanceIncome={selectedFinanceIncome}
              openEdit={openCashPayment}
              setOpenEdit={setOpenCashPayment}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              toast={toast}
            />
          </Dialog>
        )}
        {openSchedulePayment && (
          <Dialog
            fullWidth
            maxWidth="lg"
            open={openSchedulePayment}
            onClose={() => setOpenSchedulePayment(!openSchedulePayment)}
          >
            <AddPaymentScheduleForm
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
