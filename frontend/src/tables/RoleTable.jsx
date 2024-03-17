/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import {
  Box,
  Collapse,
  Dialog,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";

import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";

import EditRoleForm from "../forms/edit/EditRoleForm";
import GenericDeleteForm from "../forms/delete/GenericDeleteForm";
import PositionMembers from "../components/small/PositionMembers";
import RoleTableActions from "../components/small/buttons/tableActionButtons/RoleTableActions";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function RoleTable({
  refreshData,
  configData,
  users,
  managers,
  setRefreshData,
  searchValue,
  searchOption,
}) {
  const [selectedRole, setSelectedRole] = React.useState("");
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleConfirmDelete = (position) => {
    setSelectedItem(position);
    setOpenDialog(true);
  };

  const [roles, setRoles] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const roles = await api.get("/roles");
        setRoles(roles.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refreshData]);

  const handleOpenDetail = (role) => {
    setOpenDetail(!openDetail);
    setSelectedRole(role);
  };

  const handleOpenEdit = (role) => {
    setOpenEdit(!openEdit);
    setSelectedRole(role);
  };

  const tableHeaderRow = [
    {
      id: "name",
      label: "Nome",
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

    if (orderBy === "department.name") {
      return [...roles].sort(compare);
    }

    return [...roles].sort((a, b) => {
      const isAsc = order === "asc";
      if (isAsc) {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    });
  }, [roles, order, orderBy]);

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
                  sx={{ "&:hover": { backgroundColor: "#eee " } }}
                  onClick={() => handleOpenDetail(row)}
                >
                  <TableCell onClick={() => handleOpenDetail(row)}>
                    <Typography sx={{ fontSize: 13 }}>{row.name}</Typography>
                  </TableCell>

                  <TableCell align="center">
                    <PositionMembers
                      members={row.members}
                      users={users}
                      managers={managers}
                    />
                  </TableCell>
                  <TableCell
                    cursor="pointer"
                    align="center"
                    onClick={() => setSelectedRole(row)}
                  >
                    <RoleTableActions
                      setOpenEdit={setOpenEdit}
                      selectedItem={selectedRole}
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
            maxWidth="xs"
            open={openEdit}
            onClose={() => setOpenEdit(!openEdit)}
          >
            <EditRoleForm
              openEdit={openEdit}
              selectedRole={selectedRole}
              setOpenEdit={setOpenEdit}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              toast={toast}
            />
          </Dialog>
        )}
        {openDialog && (
          <Dialog open={openDialog} onClose={() => setOpenDialog(!openDialog)}>
            <GenericDeleteForm
              selectedItem={selectedItem}
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              toast={toast}
              endpoint="roles"
              successMessage={`${
                selectedItem.name && selectedItem.name
              } Deletado com Sucesso`}
            />
          </Dialog>
        )}
      </Box>
    </>
  );
}
