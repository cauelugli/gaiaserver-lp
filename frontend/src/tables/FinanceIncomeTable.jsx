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
  Typography,
} from "@mui/material";

import ModeEditIcon from "@mui/icons-material/ModeEdit";
import VisibilityIcon from "@mui/icons-material/Visibility";

import EditPositionForm from "../forms/edit/EditPositionForm";

export default function FinanceIncomeTable({
  incoming,
  toast,
  searchValue,
  searchOption,
  refreshData,
  setRefreshData,
}) {
  const [selectedPosition, setSelectedPosition] = React.useState("");
  const [openEdit, setOpenEdit] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState("");

  const handleOpenEdit = (position) => {
    setOpenEdit(!openEdit);
    setSelectedPosition(position);
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
      id: "user",
      label: "Colaborador",
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
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#eee " },
                      }}
                    >
                      <TableCell cursor="pointer">
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
                        <Typography sx={{ fontSize: 14 }}>
                          {income.user}
                        </Typography>
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
                        <Typography sx={{ fontSize: 14 }}>
                          {income.status}
                        </Typography>
                      </TableCell>
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
                              // onClick={() => handleOpenEdit(income)}
                              sx={{ color: "#333" }}
                            />
                          </IconButton>
                          <IconButton>
                            <ModeEditIcon
                              cursor="pointer"
                              onClick={() => handleOpenEdit(income)}
                              sx={{ color: "#ff4444" }}
                            />
                          </IconButton>
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
        {openEdit && (
          <Dialog
            fullWidth
            maxWidth="xs"
            open={openEdit}
            onClose={() => setOpenEdit(!openEdit)}
          >
            <EditPositionForm
              openEdit={openEdit}
              selectedPosition={selectedPosition}
              previousMaterials={selectedPosition.materials}
              setOpenEdit={setOpenEdit}
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
