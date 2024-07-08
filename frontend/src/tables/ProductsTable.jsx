/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Avatar,
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

import EditProductForm from "../forms/edit/EditProductForm";
import StockTableActions from "../components/small/buttons/tableActionButtons/StockTableActions";

export default function ProductsTable({
  baseProduct,
  products,
  refreshData,
  setRefreshData,
  topBar,
  userId,
}) {
  const [selectedProduct, setSelectedProduct] = React.useState("");
  const [openEdit, setOpenEdit] = React.useState(false);

  console.log("baseProduct on table", baseProduct);

  const tableHeaderRow = [
    {
      id: "name",
      label: "Nome",
    },
    ...baseProduct[0].fields.map((field) => ({
      id: field.name,
      label: field.name,
    })),
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
    return [...products].sort((a, b) => {
      const isAsc = order === "asc";
      if (isAsc) {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    });
  }, [products, order, orderBy]);

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
              .map((product) => (
                <TableRow key={product._id}>
                  <TableCell sx={{ py: 0 }}>
                    <Avatar
                      src={`http://localhost:3000/static/${product.images[0]}`}
                      alt={product.name[0]}
                      style={{
                        marginLeft: 10,
                        width: 42,
                        height: 42,
                      }}
                    />
                  </TableCell>
                  <TableCell align="left">
                    <Typography sx={{ fontSize: 13 }}>
                      {product.name}
                    </Typography>
                  </TableCell>
                  {baseProduct[0].fields.map((field, index) => (
                    <TableCell align="center" key={index}>
                      <Typography sx={{ fontSize: 13 }}>
                        {product.fields[index].value}
                      </Typography>
                    </TableCell>
                  ))}
                  <TableCell
                    align="center"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <StockTableActions
                      userId={userId}
                      type="Produto"
                      setOpenEdit={setOpenEdit}
                      selectedItem={selectedProduct}
                      refreshData={refreshData}
                      setRefreshData={setRefreshData}
                    />
                  </TableCell>
                </TableRow>
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
          maxWidth="lg"
          open={openEdit}
          onClose={() => setOpenEdit(!openEdit)}
        >
          <EditProductForm
            userId={userId}
            openEdit={openEdit}
            selectedProduct={selectedProduct}
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
