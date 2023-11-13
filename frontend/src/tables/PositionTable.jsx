/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";

import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";

import DeleteServicePlanForm from "../forms/delete/DeleteServicePlanForm";
import DeletePositionForm from "../forms/delete/DeletePositionForm";

export default function PositionTable({
  positions,
  fetchData,
  searchValue,
  searchOption,
}) {
  const [selectedPosition, setSelectedPosition] = React.useState("");
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);

  const handleOpenEdit = (position) => {
    setOpenEdit(!openEdit);
    setSelectedPosition(position);
  };

  const handleConfirmDelete = (position) => {
    setOpenDelete(!openDelete);
    setSelectedPosition(position);
  };

  const tableHeaderRow = [
    {
      id: "name",
      label: "Nome do Cargo",
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
                    align={headCell.label === "Nome do Cargo" ? "" : "center"}
                    sx={{
                      fontSize: 16,
                      fontWeight: "bold",
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
                .map((position) => (
                  <>
                    <TableRow
                      key={position._id}
                      sx={{
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#eee " },
                      }}
                    >
                      <TableCell cursor="pointer">
                        <Typography sx={{ fontSize: 14 }}>
                          {position.name}
                        </Typography>
                      </TableCell>
                      <TableCell cursor="pointer">
                        <Typography sx={{ fontSize: 14 }}>
                          {position.members.lenght}
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
                              onClick={() => handleOpenEdit(position)}
                              sx={{ color: "#333" }}
                            />
                          </IconButton>
                          <IconButton>
                            <DeleteIcon
                              cursor="pointer"
                              onClick={() => handleConfirmDelete(position)}
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
        {/* {openEdit && (
          <Dialog
            fullWidth
            maxWidth="md"
            open={openEdit}
            onClose={() => setOpenEdit(!openEdit)}
          >
            <EditServiceForm
              openEdit={openEdit}
              selectedPosition={selectedPosition}
              previousMaterials={selectedPosition.materials}
              setOpenEdit={setOpenEdit}
              fetchData={fetchData}
              toast={toast}
            />
          </Dialog>
        )} */}
        {openDelete && (
          <Dialog open={openDelete} onClose={() => setOpenDelete(!openDelete)}>
            <DeletePositionForm
              selectedPosition={selectedPosition}
              openDelete={openDelete}
              setOpenDelete={setOpenDelete}
              fetchData={fetchData}
              toast={toast}
            />
          </Dialog>
        )}
      </Box>
    </>
  );
}
