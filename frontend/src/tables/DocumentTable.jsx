/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";
import axios from "axios";

import {
  Box,
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

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function DocumentTable({
  searchValue,
  searchOption,
  fetchData,
}) {
  const [files, setFiles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchFiles = async () => {
    try {
      const response = await api.get("/uploads/listFiles");
      setFiles(response.data.files);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar a lista de arquivos:", error);
    }

  };

  React.useEffect(() => {
    fetchFiles();
  }, []);

  const tableHeaderRow = [
    {
      id: "name",
      label: "Nome",
    },
    {
      id: "department.name",
      label: "Departamento",
    },
  ];

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
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
              {files
                // .filter((file) =>
                //   file.name.toLowerCase().includes(searchValue.toLowerCase())
                // )
                .map((file) => (
                  <TableRow key={file}>
                    <TableCell>{file}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
