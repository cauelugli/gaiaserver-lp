/* eslint-disable no-unused-vars */
import * as React from "react";
import axios from "axios";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const Dashboard = () => {
  const [users, setUsers] = React.useState([]);

  const tableHeaderRow = [
    {
      id: "name",
      label: "Nome",
    },
    {
      id: "position",
      label: "Ocupação",
    },
    {
      id: "phone",
      label: "Telefone",
    },
    {
      id: "email",
      label: "E-mail",
    },
    {
      id: "department.name",
      label: "Departamento",
    },
  ];

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await api.get("/users");
        console.log("users.data", users.data);
        setUsers(users.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [users]);

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedRows = React.useMemo(() => {
    return users.slice().sort((a, b) => {
      const isAsc = order === "asc";
      if (isAsc) {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    });
  }, [users, order, orderBy]);

  const getCellValue = (row, headerId) => {
    if (headerId === "department.name") {
      return row.department.name;
    }
    return row[headerId];
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#ccc",
                }}
              >
                {tableHeaderRow.map((headCell) => (
                  <TableCell
                    sx={{ fontSize: 16, fontWeight: "bold" }}
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
            </TableHead>
            <TableBody>
              {sortedRows.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    cursor: "pointer",
                    // backgroundColor:
                    //   selectedUser.name === user.name && openDetail
                    //     ? "#eee"
                    //     : "none",
                    "&:hover": { backgroundColor: "#eee " },
                  }}
                >
                  {tableHeaderRow.map((header) => (
                    <TableCell key={header.id}>
                      {getCellValue(row, header.id)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Dashboard;
