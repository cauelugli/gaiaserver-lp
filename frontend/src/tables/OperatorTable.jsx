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
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";

import ModeEditIcon from "@mui/icons-material/ModeEdit";
import LockIcon from "@mui/icons-material/Lock";
import DeleteIcon from "@mui/icons-material/Delete";

import EditOperatorForm from "../forms/edit/EditOperatorForm";
import DeleteOperatorForm from "../forms/delete/DeleteOperatorForm";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function OperatorTable({
  refreshData,
  setRefreshData,
  searchValue,
  searchOption,
}) {
  const [selectedOperator, setSelectedOperator] = React.useState("");
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [option, setOption] = React.useState("false");

  const [operators, setOperators] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await api.get("/users");
        const managersResponse = await api.get("/managers");
        const usersData = usersResponse.data;
        const managersData = managersResponse.data;
        const combinedData = [...usersData, ...managersData];
        setOperators(combinedData.filter((user) => user.username));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refreshData]);

  const handleOpenEdit = (user, option) => {
    setOption(option);
    setSelectedOperator(user);
    setOpenEdit(!openEdit);
  };

  const handleConfirmDelete = (user) => {
    setOpenDelete(!openDelete);
    setSelectedOperator(user);
  };

  const tableHeaderRow = [
    {
      id: "name",
      label: "Nome",
    },
    {
      id: "username",
      label: "Nome de Operador",
    },
    {
      id: "role",
      label: "Nível de Acesso",
    },
    {
      id: "actions",
      label: "Ações",
    },
  ];

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("role");

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
      return [...operators].sort(compare);
    }

    return [...operators].sort((a, b) => {
      const isAsc = order === "asc";
      if (isAsc) {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    });
  }, [operators, order, orderBy]);

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
                <TableCell padding="checkbox"></TableCell>
                {tableHeaderRow.map((headCell) => (
                  <TableCell
                    align={headCell.label === "Nome" ? "" : "center"}
                    sx={{
                      fontSize: 16,
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
                  <>
                    <TableRow
                      key={row._id}
                      sx={{
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#eee " },
                      }}
                    >
                      <TableCell cursor="pointer" sx={{ py: 0 }}>
                        <Avatar
                          src={`http://localhost:3000/static/${row.image}`}
                          alt={row.name[0]}
                          cursor="pointer"
                          style={{
                            marginLeft: 10,
                            width: 42,
                            height: 42,
                          }}
                        />
                      </TableCell>
                      <TableCell cursor="pointer">
                        <Typography sx={{ fontSize: 14 }}>
                          {row.name}
                        </Typography>
                      </TableCell>
                      <TableCell cursor="pointer" align="center">
                        <Typography sx={{ fontSize: 14 }}>
                          {row.username}
                        </Typography>
                      </TableCell>
                      <TableCell cursor="pointer" align="center">
                        <Typography sx={{ fontSize: 14 }}>
                          {row.role}
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
                            <ModeEditIcon
                              cursor="pointer"
                              onClick={() => handleOpenEdit(row, "operator")}
                              sx={{ color: "#333" }}
                            />
                          </IconButton>
                          <IconButton sx={{ mx: -1 }}>
                            <LockIcon
                              cursor="pointer"
                              onClick={() => handleOpenEdit(row, "password")}
                              sx={{ color: "#333" }}
                            />
                          </IconButton>
                          <IconButton>
                            <DeleteIcon
                              cursor="pointer"
                              onClick={() => handleConfirmDelete(row)}
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
        </TableContainer>

        {openEdit && (
          <Dialog
            fullWidth
            maxWidth="sm"
            open={openEdit}
            onClose={() => setOpenEdit(!openEdit)}
          >
            <EditOperatorForm
              option={option}
              openEdit={openEdit}
              selectedOperator={selectedOperator}
              setOpenEdit={setOpenEdit}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              toast={toast}
            />
          </Dialog>
        )}
        {openDelete && (
          <Dialog open={openDelete} onClose={() => setOpenDelete(!openDelete)}>
            <DeleteOperatorForm
              selectedOperator={selectedOperator}
              openDelete={openDelete}
              setOpenDelete={setOpenDelete}
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
