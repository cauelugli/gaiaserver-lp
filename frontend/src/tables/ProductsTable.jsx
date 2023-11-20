/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import {
  Avatar,
  Box,
  Collapse,
  Dialog,
  DialogContent,
  FormHelperText,
  Grid,
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

import EditProductForm from "../forms/edit/EditProductForm";
import GenericDeleteForm from "../forms/delete/GenericDeleteForm";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function ProductsTable({
  searchValue,
  searchOption,
  refreshData,
  setRefreshData,
}) {
  const [selectedProduct, setSelectedProduct] = React.useState("");
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleConfirmDelete = (position) => {
    setSelectedItem(position);
    setOpenDialog(true);
  };

  const [products, setProducts] = React.useState([]);

  const [openImage, setOpenImage] = React.useState(false);

  const handleOpenImage = () => {
    setOpenImage(true);
  };

  const handleCloseImage = () => {
    setOpenImage(false);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await api.get("/products");
        setProducts(products.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleOpenDetail = (product) => {
    setOpenDetail(!openDetail);
    setSelectedProduct(product);
  };

  const handleOpenEdit = (product) => {
    setOpenEdit(!openEdit);
    setSelectedProduct(product);
  };

  const tableHeaderRow = [
    {
      id: "name",
      label: "Nome",
    },
    {
      id: "brand",
      label: "Marca",
    },
    {
      id: "type",
      label: "Tipo",
    },
    {
      id: "model",
      label: "Modelo",
    },
    {
      id: "quantity",
      label: "Quantidade",
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
    <>
      <Box sx={{ minWidth: "1050px" }}>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow sx={{ backgroundColor: "#ccc" }}>
                <TableCell padding="checkbox"></TableCell>
                {tableHeaderRow.map((headCell) => (
                  <TableCell
                    align={headCell.label === "Nome" ? "" : "center"}
                    sx={{
                      fontSize: 14,
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
                .map((product) => (
                  <>
                    <TableRow
                      key={product._id}
                      sx={{
                        cursor: "pointer",
                        backgroundColor:
                          selectedProduct.name === product.name && openDetail
                            ? "#eee"
                            : "none",
                        "&:hover": { backgroundColor: "#eee " },
                      }}
                    >
                      <TableCell
                        onClick={() => handleOpenDetail(product)}
                        cursor="pointer"
                        sx={{ py: 0 }}
                      >
                        <Avatar
                          src={`http://localhost:3000/static/${product.image}`}
                          alt={product.name[0]}
                          cursor="pointer"
                          style={{
                            marginLeft: 10,
                            width: 42,
                            height: 42,
                            opacity:
                              openDetail &&
                              selectedProduct.name === product.name
                                ? 0
                                : 100,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        onClick={() => handleOpenDetail(product)}
                        cursor="pointer"
                        align="left"
                      >
                        <Typography sx={{ fontSize: 14 }}>
                          {product.name}
                        </Typography>
                      </TableCell>
                      <TableCell
                        onClick={() => handleOpenDetail(product)}
                        cursor="pointer"
                        align="center"
                      >
                        <Typography sx={{ fontSize: 14 }}>
                          {product.brand}
                        </Typography>
                      </TableCell>
                      <TableCell
                        onClick={() => handleOpenDetail(product)}
                        cursor="pointer"
                        align="center"
                      >
                        <Typography sx={{ fontSize: 14 }}>
                          {product.type}
                        </Typography>
                      </TableCell>
                      <TableCell
                        onClick={() => handleOpenDetail(product)}
                        cursor="pointer"
                        align="center"
                      >
                        <Typography sx={{ fontSize: 14 }}>
                          {product.model}
                        </Typography>
                      </TableCell>
                      <TableCell
                        onClick={() => handleOpenDetail(product)}
                        cursor="pointer"
                        align="center"
                      >
                        <Typography sx={{ fontSize: 14 }}>
                          {product.quantity}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={6}
                      >
                        <Collapse
                          in={openDetail && selectedProduct._id === product._id}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box sx={{ my: 4, px: 6 }}>
                            <Typography
                              variant="h6"
                              sx={{ fontSize: 18, fontWeight: "bold", my: 2 }}
                            >
                              Detalhes do Item
                            </Typography>
                            <Grid
                              container
                              direction="row"
                              justifyContent="space-around"
                            >
                              <Grid item>
                                <Grid
                                  container
                                  direction="column"
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <Avatar
                                    alt="Imagem do Produto"
                                    src={`http://localhost:3000/static/${product.image}`}
                                    sx={{ width: 200, height: 200 }}
                                    onDoubleClick={handleOpenImage}
                                  />

                                  <FormHelperText>
                                    Click 2x na imagem para ampliar
                                  </FormHelperText>

                                  <Dialog
                                    open={openImage}
                                    onClose={handleCloseImage}
                                  >
                                    <DialogContent>
                                      <img
                                        src={`http://localhost:3000/static/${product.image}`}
                                        alt="Imagem do Produto"
                                        style={{ maxWidth: "100%" }}
                                      />
                                    </DialogContent>
                                  </Dialog>
                                </Grid>
                              </Grid>
                              <Grid item>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>
                                        <Typography
                                          sx={{
                                            fontSize: "14px",
                                            color: "#777",
                                          }}
                                        >
                                          Nome
                                        </Typography>
                                      </TableCell>
                                      <TableCell align="center">
                                        <Typography
                                          sx={{
                                            fontSize: "14px",
                                            color: "#777",
                                          }}
                                        >
                                          Marca
                                        </Typography>
                                      </TableCell>
                                      <TableCell align="center">
                                        <Typography
                                          sx={{
                                            fontSize: "14px",
                                            color: "#777",
                                          }}
                                        >
                                          Tipo
                                        </Typography>
                                      </TableCell>
                                      <TableCell align="center">
                                        <Typography
                                          sx={{
                                            fontSize: "14px",
                                            color: "#777",
                                          }}
                                        >
                                          Modelo
                                        </Typography>
                                      </TableCell>
                                      <TableCell align="center">
                                        <Typography
                                          sx={{
                                            fontSize: "14px",
                                            color: "#777",
                                          }}
                                        >
                                          Tamanho
                                        </Typography>
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell align="center">
                                        <Typography>{product.name}</Typography>
                                      </TableCell>
                                      <TableCell align="center">
                                        <Typography>{product.brand}</Typography>
                                      </TableCell>
                                      <TableCell align="center">
                                        <Typography>{product.type}</Typography>
                                      </TableCell>
                                      <TableCell align="center">
                                        <Typography>{product.model}</Typography>
                                      </TableCell>
                                      <TableCell align="center">
                                        <Typography>{product.size}</Typography>
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                                <Table size="small" sx={{ mt: 4 }}>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>
                                        <Typography
                                          sx={{
                                            fontSize: "14px",
                                            color: "#777",
                                          }}
                                        >
                                          Valor de Compra
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <Typography
                                          sx={{
                                            fontSize: "14px",
                                            color: "#777",
                                          }}
                                        >
                                          Valor de Venda
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <Typography
                                          sx={{
                                            fontSize: "14px",
                                            color: "#777",
                                          }}
                                        >
                                          Lucro por Item
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <Typography
                                          sx={{
                                            fontSize: "14px",
                                            color: "#777",
                                          }}
                                        >
                                          Quantidade
                                        </Typography>
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell>
                                        <Typography>
                                          R${product.buyValue}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <Typography>
                                          R${product.sellValue}
                                        </Typography>
                                      </TableCell>
                                      <TableCell align="center">
                                        <Typography sx={{ color: "#32CD32" }}>
                                          {(
                                            ((product.sellValue -
                                              product.buyValue) /
                                              product.buyValue) *
                                            100
                                          ).toFixed(2)}
                                          %
                                        </Typography>
                                      </TableCell>
                                      <TableCell align="center">
                                        <Typography>
                                          {product.quantity}
                                        </Typography>
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </Grid>
                            </Grid>

                            <Box sx={{ mt: 3, ml: "90%" }}>
                              <ModeEditIcon
                                cursor="pointer"
                                onClick={() => handleOpenEdit(product)}
                                sx={{ color: "grey", mr: 2 }}
                              />
                              <DeleteIcon
                                cursor="pointer"
                                onClick={() => handleConfirmDelete(product)}
                                sx={{ color: "#ff4444" }}
                              />
                            </Box>
                          </Box>
                        </Collapse>
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
            maxWidth="lg"
            open={openEdit}
            onClose={() => setOpenEdit(!openEdit)}
          >
            <EditProductForm
              openEdit={openEdit}
              selectedProduct={selectedProduct}
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
              toast={toast}
              endpoint="products"
              refreshData={refreshData}
              setRefreshData={setRefreshData}
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
