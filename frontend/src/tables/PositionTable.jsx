/* eslint-disable react/prop-types */
import * as React from "react";

import {
  Box,
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
  Typography,
} from "@mui/material";

import EditPositionForm from "../forms/edit/EditPositionForm";
import PositionMembers from "../components/small/PositionMembers";
import PositionTableActions from "../components/small/buttons/tableActionButtons/PositionTableActions";

export default function PositionTable({
  departments,
  positions,
  users,
  managers,
  toast,
  refreshData,
  setRefreshData,
  topBar,
}) {
  const [selectedPosition, setSelectedPosition] = React.useState("");
  const [openEdit, setOpenEdit] = React.useState(false);

  const tableHeaderRow = [
    {
      id: "name",
      label: "Nome do Cargo",
    },
    {
      id: "department.name",
      label: "Departamento",
    },
    {
      id: "members",
      label: "Colaboradores",
    },
    {
      id: "actions",
      label: "Ações",
    },
  ];

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");

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
      return [...positions].sort(compare);
    }

    return [...positions].sort((a, b) => {
      const isAsc = order === "asc";
      if (isAsc) {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    });
  }, [positions, order, orderBy]);

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
    <Box sx={{ width: topBar ? "105%" : "100%", minHeight: "50vw" }}>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              {tableHeaderRow.map((headCell, index) => (
                <TableCell
                  key={index}
                  align={
                    headCell.label === "Nome do Cargo" ||
                    headCell.label === "Departamento"
                      ? ""
                      : "center"
                  }
                  sx={{
                    fontSize: 13,
                    fontWeight: "bold",
                    pl: headCell.label === "Nome do Cargo" ? "" : 5,
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
              ))}
            </TableRow>
            {sortedRows
              .map((position, index) => (
                <>
                  <TableRow key={index}>
                    <TableCell>
                      <Typography sx={{ fontSize: 13 }}>
                        {position.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {position.department ? (
                        <Grid container direction="row">
                          <Paper
                            elevation={0}
                            sx={{
                              mr: 1,
                              width: 15,
                              height: 15,
                              borderRadius: 50,
                              backgroundColor: position.department.color,
                            }}
                          />
                          <Typography sx={{ fontSize: 13 }}>
                            {position.department.name}
                          </Typography>
                        </Grid>
                      ) : (
                        ""
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <PositionMembers
                        members={position.members}
                        users={users}
                        managers={managers}
                      />
                    </TableCell>
                    <TableCell
                      cursor="pointer"
                      align="center"
                      onClick={() => setSelectedPosition(position)}
                    >
                      <PositionTableActions
                        setOpenEdit={setOpenEdit}
                        selectedItem={selectedPosition}
                        refreshData={refreshData}
                        setRefreshData={setRefreshData}
                      />
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
      {openEdit && (
        <Dialog
          fullWidth
          maxWidth="xs"
          open={openEdit}
          onClose={() => setOpenEdit(!openEdit)}
        >
          <EditPositionForm
            openEdit={openEdit}
            departments={departments}
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
  );
}
