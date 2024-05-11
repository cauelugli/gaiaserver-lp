/* eslint-disable react/prop-types */
import * as React from "react";
import dayjs from "dayjs";

import {
  Box,
  Checkbox,
  Dialog,
  Grid,
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

import AddPaymentScheduleForm from "../forms/add/AddPaymentScheduleForm";
import CashPaymentForm from "../forms/add/CashPaymentForm";
import AddParcelPaymentForm from "../forms/add/AddParcelPaymentForm";
import ChallengeApproval from "../forms/misc/ChallengeApproval";
import FinanceOutcomeTableActions from "../components/small/buttons/tableActionButtons/FinanceOutcomeTableActions";

export default function FinanceOutcomeTable({
  outcoming,
  toast,
  searchValue,
  searchOption,
  refreshData,
  setRefreshData,
  configCustomization,
  topBar,
  userId,
}) {
  const [selectedFinanceoutcome, setSelectedFinanceoutcome] =
    React.useState("");
  const [hoveredoutcome, setHoveredoutcome] = React.useState(null);
  const [openChallengeApproval, setOpenChallengeApproval] =
    React.useState(false);
  const [openSchedulePayment, setOpenSchedulePayment] = React.useState(false);
  const [openCashPayment, setOpenCashPayment] = React.useState(false);
  const [openAddParcelPayment, setOpenAddParcelPayment] = React.useState(false);

  const handleChallengeApproval = (outcome) => {
    setSelectedFinanceoutcome(outcome);
    setOpenChallengeApproval(!openChallengeApproval);
  };

  const handleOpenAddSchedulePayment = (outcome) => {
    setSelectedFinanceoutcome(outcome);
    setOpenSchedulePayment(!openSchedulePayment);
  };

  const handleOpenAddCashPayment = (outcome) => {
    setSelectedFinanceoutcome(outcome);
    setOpenCashPayment(!openCashPayment);
  };

  const handleOpenAddParcelPayment = (outcome) => {
    setSelectedFinanceoutcome(outcome);
    setOpenAddParcelPayment(!openAddParcelPayment);
  };

  const tableHeaderRow = [
    {
      id: "type",
      label: "Tipo",
    },
    {
      id: "payment",
      label: "Pagamento",
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
      return [...outcoming].sort(compare);
    }

    return [...outcoming].sort((a, b) => {
      const isAsc = order === "asc";
      if (isAsc) {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    });
  }, [outcoming, order, orderBy]);

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

  const [showCompletedOutcomes, setshowCompletedOutcomes] =
    React.useState(false);

  const filteredValidCount = sortedRows.filter(
    (row) => row.status !== "Pago" && row.status !== "Aprovado"
  ).length;
  const filteredArchivedCount = sortedRows.filter(
    (row) => row.status === "Pago"
  ).length;

  return (
    <>
      <Box sx={{ width: topBar ? "105%" : "100%", minHeight: "50vw" }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: -5.5 }}>
          <Checkbox
            checked={showCompletedOutcomes}
            onChange={() => setshowCompletedOutcomes(!showCompletedOutcomes)}
          />
          <Typography sx={{ fontSize: 13, mt: 1.5, ml: -1 }}>
            Mostrar Pagos
          </Typography>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                {tableHeaderRow.map((headCell) => (
                  <TableCell
                    align={headCell.label === "Tipo" ? "" : "center"}
                    sx={{
                      fontSize: 13,
                      fontWeight: "bold",
                      pl: headCell.label === "Tipo" ? "" : 5,
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
                .filter((outcome) => {
                  if (!outcome) return false;
                  const itemProperty = searchOption
                    .split(".")
                    .reduce((obj, key) => obj[key], outcome);
                  const shouldShowoutcome =
                    itemProperty &&
                    itemProperty
                      .toLowerCase()
                      .includes(searchValue.toLowerCase());

                  return (
                    shouldShowoutcome &&
                    (showCompletedOutcomes || outcome.status !== "Pago")
                  );
                })
                .map((outcome) => (
                  <TableRow key={outcome._id}>
                    <TableCell>
                      <Typography sx={{ fontSize: 13 }}>
                        {outcome.type ? outcome.type : "Não Informado"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        sx={{ fontSize: 13 }}
                        onMouseEnter={() => setHoveredoutcome(outcome)}
                        onMouseLeave={() => setHoveredoutcome(null)}
                      >
                        {outcome.payment && outcome.payment.cash ? (
                          <Tooltip
                            title={
                              <Typography sx={{ fontSize: 12 }}>
                                Pago em {outcome.paidAt}
                              </Typography>
                            }
                          >
                            A vista | {outcome.payment.method}
                          </Tooltip>
                        ) : outcome.payment ? (
                          outcome.payment.paymentOption +
                          ` | ` +
                          outcome.payment.paymentMethod
                        ) : (
                          "Não Realizado"
                        )}
                      </Typography>
                      {outcome.payment &&
                        outcome.payment.paymentOption === "Parcelado" &&
                        hoveredoutcome === outcome && (
                          <Paper
                            onMouseEnter={() => setHoveredoutcome(outcome)}
                            onMouseLeave={() => setHoveredoutcome(null)}
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
                              Bla bla bla
                              {/* <Grid item>
                                <Typography sx={{ fontSize: 13 }}>
                                  <strong>Orçamento:</strong> {outcome.quote}
                                </Typography>
                                <Typography sx={{ fontSize: 13, mt: 2 }}>
                                  <strong>Método:</strong>{" "}
                                  {outcome.payment.paymentMethod}
                                </Typography>
                                <Typography sx={{ fontSize: 13, mt: 2 }}>
                                  <strong>Opção:</strong>{" "}
                                  {outcome.payment.paymentOption}
                                </Typography>
                                <Typography sx={{ fontSize: 13, mt: 2 }}>
                                  <strong>Valor:</strong> R$
                                  {outcome.payment.finalPrice}
                                </Typography>
                                {outcome.payment.hasParcelMonthlyFee && (
                                  <FormHelperText
                                    sx={{ fontSize: 11, my: -0.5, ml: 2 }}
                                  >
                                    (Juros Mensais de{" "}
                                    <strong>
                                      {outcome.payment.parcelMonthlyFee}%
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
                                      outcome.status === "Pago"
                                        ? "success"
                                        : "primary"
                                    }
                                    value={(
                                      (Object.values(
                                        outcome.payment.paymentDates
                                      )
                                        .map((item) =>
                                          item.status === "Pago" ? 1 : 0
                                        )
                                        .reduce((acc, curr) => acc + curr, 0) /
                                        outcome.payment.parcelQuantity) *
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
                                        outcome.payment.paymentDates
                                      )
                                        .map((item) =>
                                          item.status === "Pago" ? 1 : 0
                                        )
                                        .reduce(
                                          (acc, curr) => acc + curr,
                                          0
                                        )}{" "}
                                      / {outcome.payment.parcelQuantity}
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
                                      outcome.payment.paymentDates
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
                                  {outcome.status === "Pago" && (
                                    <Typography
                                      sx={{
                                        my: 1,
                                        fontSize: 12,
                                        color: "#777",
                                      }}
                                    >
                                      Pago em: {outcome.paidAt}
                                    </Typography>
                                  )}
                                </Grid>
                              </Grid> */}
                            </Grid>
                          </Paper>
                        )}
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: 13 }}>
                        R${outcome.price.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: 13 }}>
                        {outcome.status}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: 13 }}>
                        {dayjs(outcome.createdAt).format("DD/MM/YYYY")}
                      </Typography>
                    </TableCell>

                    <TableCell
                      align="center"
                      onClick={() => setSelectedFinanceoutcome(outcome)}
                    >
                      {outcome.status !== "Pago" ? (
                        <FinanceOutcomeTableActions
                          outcome={outcome}
                          handleOpenAddSchedulePayment={
                            handleOpenAddSchedulePayment
                          }
                          handleOpenAddCashPayment={handleOpenAddCashPayment}
                          handleOpenAddParcelPayment={
                            handleOpenAddParcelPayment
                          }
                          handleChallengeApproval={handleChallengeApproval}
                        />
                      ) : (
                        <Typography sx={{ fontSize: 13, color: "darkgrey" }}>
                          Não há Ações
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
                .slice(startIndex, endIndex)}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={
              filteredValidCount +
              (showCompletedOutcomes && filteredArchivedCount)
            }
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
              userId={userId}
              selectedFinanceIncome={selectedFinanceoutcome}
              setOpenEdit={setOpenAddParcelPayment}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              toast={toast}
              configCustomization={configCustomization}
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
              userId={userId}
              selectedFinanceIncome={selectedFinanceoutcome}
              setOpenEdit={setOpenCashPayment}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              toast={toast}
              configCustomization={configCustomization}
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
              userId={userId}
              selectedFinanceIncome={selectedFinanceoutcome}
              previousMaterials={selectedFinanceoutcome.materials}
              setOpenEdit={setOpenSchedulePayment}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              toast={toast}
              configCustomization={configCustomization}
            />
          </Dialog>
        )}
        {openChallengeApproval && (
          <Dialog
            fullWidth
            maxWidth="md"
            open={openChallengeApproval}
            onClose={() => setOpenChallengeApproval(!openChallengeApproval)}
          >
            <ChallengeApproval
              userId={userId}
              selectedFinanceOutcome={selectedFinanceoutcome}
              entry={selectedFinanceoutcome.entry}
              open={openChallengeApproval}
              setOpen={setOpenChallengeApproval}
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
