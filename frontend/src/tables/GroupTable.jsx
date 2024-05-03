/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";

import {
  Box,
  Dialog,
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

import GroupMembers from "../components/small/GroupMembers";
import GroupTableActions from "../components/small/buttons/tableActionButtons/GroupTableActions";
import EditGroupRenameForm from "../forms/edit/EditGroupRenameForm";
import EditGroupMembersForm from "../forms/edit/EditGroupMembersForm";

export default function GroupTable({
  configData,
  groups,
  allUsers,
  users,
  managers,
  toast,
  searchValue,
  searchOption,
  refreshData,
  setRefreshData,
  topBar,
}) {
  const [selectedGroup, setSelectedGroup] = React.useState("");
  const [openRename, setRename] = React.useState(false);
  const [openEditMembers, setOpenEditMembers] = React.useState(false);

  const tableHeaderRow = [
    {
      id: "name",
      label: "Nome do Grupo",
    },
    {
      id: "members",
      label: "Membros",
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
      return [...groups].sort(compare);
    }

    return [...groups].sort((a, b) => {
      const isAsc = order === "asc";
      if (isAsc) {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    });
  }, [groups, order, orderBy]);

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
      <Box sx={{ width: topBar ? "105%" : "100%", minHeight: "50vw" }}>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                {tableHeaderRow.map((headCell) => (
                  <TableCell
                    align={headCell.label === "Nome do Grupo" ? "" : "center"}
                    sx={{
                      fontSize: 13,
                      fontWeight: "bold",
                      pl: headCell.label === "Nome do Grupo" ? "" : 5,
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
                .filter((item) => {
                  const itemProperty = searchOption
                    .split(".")
                    .reduce((obj, key) => obj[key], item);
                  return (
                    itemProperty &&
                    itemProperty
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                  );
                })
                .map((group) => (
                  <>
                    <TableRow key={group._id}>
                      <TableCell>
                        <Typography sx={{ fontSize: 13 }}>
                          {group.name}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <GroupMembers
                          members={group.members}
                          users={users}
                          managers={managers}
                        />
                      </TableCell>
                      <TableCell
                        cursor="pointer"
                        align="center"
                        onClick={() => setSelectedGroup(group)}
                      >
                        <GroupTableActions
                          configData={configData}
                          setRename={setRename}
                          setOpenEditMembers={setOpenEditMembers}
                          selectedItem={selectedGroup}
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
        {openRename && (
          <Dialog
            fullWidth
            maxWidth="xs"
            open={openRename}
            onClose={() => setRename(!openRename)}
          >
            <EditGroupRenameForm
              setRename={setRename}
              selectedGroup={selectedGroup}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              toast={toast}
            />
          </Dialog>
        )}

        {openEditMembers && (
          <Dialog
            fullWidth
            maxWidth="xs"
            open={openEditMembers}
            onClose={() => setOpenEditMembers(!openEditMembers)}
          >
            <EditGroupMembersForm
              openEdit={openEditMembers}
              users={allUsers}
              selectedGroup={selectedGroup}
              setOpenEditMembers={setOpenEditMembers}
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
