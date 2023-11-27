/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  FormHelperText,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
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
import PriceCheckIcon from "@mui/icons-material/PriceCheck";

import AddPaymentScheduleForm from "../forms/add/AddPaymentScheduleForm";
import EditStatusForm from "../forms/edit/EditStatusForm";
import FinanceIncomeStatusButton from "../components/small/buttons/FinanceIncomeStatusButton";
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
  const [openAddParcelPayment, setOpenAddParcelPayment] = React.useState(false);
  const [openAddFullPayment, setOpenAddFullPayment] = React.useState(false);

  const [openConfirmChangeStatus, setOpenConfirmChangeStatus] =
    React.useState(false);

  const handleOpenAddSchedulePayment = (income) => {
    setSelectedFinanceIncome(income);
    setOpenSchedulePayment(!openSchedulePayment);
  };

  const handleOpenAddParcelPayment = (income) => {
    setSelectedFinanceIncome(income);
    setOpenAddParcelPayment(!openAddParcelPayment);
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

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openAddPayment = Boolean(anchorEl);
  const handleClickAddButton = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseAddPayment = () => {
    setAnchorEl(null);
  };

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
                      <TableCell align="center">
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
                        {income.payment && hoveredIncome === income && (
                          <Paper
                            onMouseEnter={() => setHoveredIncome(income)}
                            onMouseLeave={() => setHoveredIncome(null)}
                            style={{
                              position: "absolute",
                              width: 350,
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
                              justifyContent="space-evenly"
                              sx={{ my: "3%" }}
                            >
                              <Grid item>
                                <Typography sx={{ fontSize: 14 }}>
                                  <strong>Orçamento:</strong> {income.quote}
                                </Typography>
                                <Typography sx={{ fontSize: 14, mt: 2 }}>
                                  <strong>Método:</strong>{" "}
                                  {income.payment.paymentMethod}
                                </Typography>
                                <Typography sx={{ fontSize: 14, mt: 2 }}>
                                  <strong>Opção:</strong>{" "}
                                  {income.payment.paymentOption}
                                </Typography>
                                <Typography sx={{ fontSize: 14, mt: 2 }}>
                                  <strong>Valor:</strong> R$
                                  {income.payment.finalPrice}
                                </Typography>
                                {income.payment.hasParcelMonthlyFee && (
                                  <FormHelperText
                                    sx={{ fontSize: 11, my: -0.5 }}
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
                                    value={(
                                      (Object.values(
                                        income.payment.paymentDates
                                      )
                                        .map((item) =>
                                          item.status === "Pago" ? 1 : 0
                                        )
                                        .reduce((acc, curr) => acc + curr, 0) /
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
                                </Grid>
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
                          R${income.price}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <FinanceIncomeStatusButton
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

                          {income.payment && (
                            <>
                              <Button
                                // disabled={
                                //   income.payment &&
                                //   Object.values(
                                //     income.payment.paymentDates
                                //   ).filter((item) => item.status === "Pago")
                                //     .length === income.payment.parcelQuantity
                                // }
                                id="basic-button"
                                aria-controls={
                                  openAddPayment ? "basic-menu" : undefined
                                }
                                aria-haspopup="true"
                                aria-expanded={
                                  openAddPayment ? "true" : undefined
                                }
                                onClick={handleClickAddButton}
                                size="small"
                                sx={{ color: "#444", ml: -1 }}
                              >
                                {" "}
                                <AttachMoneyIcon />
                              </Button>

                              <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={openAddPayment}
                                // onClick={handleCloseAddPayment}
                                MenuListProps={{
                                  "aria-labelledby": "basic-button",
                                }}
                              >
                                <MenuList sx={{ width: 220 }}>
                                  <MenuItem
                                    onClick={() =>
                                      handleOpenAddParcelPayment(income)
                                    }
                                  >
                                    <ListItemIcon>
                                      <PaymentsIcon />
                                    </ListItemIcon>
                                    <ListItemText>Receber Parcela</ListItemText>
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => setOpenAddFullPayment(true)}
                                  >
                                    <ListItemIcon>
                                      <PriceCheckIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                      Pagamento Completo
                                    </ListItemText>
                                  </MenuItem>
                                </MenuList>
                              </Menu>
                            </>
                          )}
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
        {openAddPayment && (
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
