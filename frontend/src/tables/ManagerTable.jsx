/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import {
  Avatar,
  Box,
  Dialog,
  Grid,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";

import EditManagerForm from "../forms/edit/EditManagerForm";
import ManagerTableActions from "../components/small/buttons/tableActionButtons/ManagerTableActions";
import ViewUserDetails from "../forms/misc/ViewUserDetails";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function ManagerTable({
  refreshData,
  configData,
  setRefreshData,
  searchValue,
  searchOption,
}) {
  const [selectedManager, setSelectedManager] = React.useState("");
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDetails, setOpenDetails] = React.useState(false);

  const [managers, setManagers] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const managers = await api.get("/managers");
        const departments = await api.get("/departments");
        setManagers(managers.data);
        setDepartments(departments.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refreshData]);

  const tableHeaderRow = [
    {
      id: "name",
      label: "Nome",
    },
    {
      id: "email",
      label: "E-mail",
    },
    {
      id: "phone",
      label: "Telefone",
    },
    {
      id: "department.name",
      label: "Departamento",
    },
    {
      id: "isActive",
      label: "Ativo",
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

    if (orderBy === "department.name") {
      return [...managers].sort(compare);
    }

    return [...managers].sort((a, b) => {
      const isAsc = order === "asc";
      if (isAsc) {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    });
  }, [managers, order, orderBy]);

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
      <Box sx={{ minWidth: "1250px" }}>
        <TableContainer component={Paper}>
          <Table>
            <TableRow
              sx={{
                backgroundColor: "#eee",
              }}
            >
              <TableCell padding="checkbox"></TableCell>
              {tableHeaderRow.map((headCell) => (
                <TableCell
                  align={headCell.label === "Nome" ? "" : "center"}
                  sx={{
                    fontSize: 13,
                    fontWeight: "bold",
                    pl: headCell.label === "Nome" ? "" : 5,
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
              .filter((user) =>
                user[searchOption]
                  .toLowerCase()
                  .includes(searchValue.toLowerCase())
              )
              .map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ "&:hover": { backgroundColor: "#eee" } }}
                >
                  <TableCell sx={{ py: 0 }}>
                    <Avatar
                      src={`http://localhost:3000/static/${row.image}`}
                      alt={row.name[0]}
                      style={{
                        marginLeft: 10,
                        width: 42,
                        height: 42,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 13 }}>{row.name}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontSize: 13 }}>{row.email}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontSize: 13 }}>{row.phone}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontSize: 13 }}>
                      {row.department ? (
                        <Grid container direction="row" justifyContent="center">
                          <Paper
                            elevation={0}
                            sx={{
                              mr: 1,
                              mt: 0.5,
                              width: 12,
                              height: 12,
                              borderRadius: 50,
                              backgroundColor: row.department.color,
                            }}
                          />
                          <Typography sx={{ fontSize: 13 }}>
                            {row.department.name}
                          </Typography>
                        </Grid>
                      ) : (
                        "-"
                      )}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography sx={{ fontSize: 13 }}>
                      {row.isActive ? "Sim" : "Não"}
                    </Typography>
                  </TableCell>
                  <TableCell
                    cursor="pointer"
                    align="center"
                    onClick={() => setSelectedManager(row)}
                  >
                    <ManagerTableActions
                      user={row}
                      configData={configData}
                      setOpenEdit={setOpenEdit}
                      setOpenDetails={setOpenDetails}
                      selectedItem={selectedManager}
                      refreshData={refreshData}
                      setRefreshData={setRefreshData}
                    />
                  </TableCell>
                </TableRow>
              ))
              .slice(startIndex, endIndex)}
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
            maxWidth="md"
            open={openEdit}
            onClose={() => setOpenEdit(!openEdit)}
          >
            <EditManagerForm
              openEdit={openEdit}
              selectedManager={selectedManager}
              departments={departments}
              setOpenEdit={setOpenEdit}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              toast={toast}
            />
          </Dialog>
        )}
        {openDetails && (
          <Dialog
            fullWidth
            maxWidth="md"
            open={openDetails}
            onClose={() => setOpenDetails(!openDetails)}
          >
            <ViewUserDetails
              selectedUser={selectedManager}
              setOpenDetails={setOpenDetails}
              manager
            />
          </Dialog>
        )}
      </Box>
    </>
  );
}
