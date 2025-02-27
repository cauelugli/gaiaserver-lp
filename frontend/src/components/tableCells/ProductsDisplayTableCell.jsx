/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import { Grid2, Table, TableCell, TableRow, Typography } from "@mui/material";

const ProductsDisplayTableCell = (props) => {
  // Ajusta o count automaticamente se stockQuantity for 0 (aplicado apenas quando toStock é false)
  const adjustCountForZeroStock = () => {
    if (!props.toStock) {
      props.selectedProducts.forEach((product) => {
        if (product.stockQuantity === 0 && product.count > 0) {
          product.count = 0;
        }
      });
      props.setRefreshData(!props.refreshData);
    }
  };

  useEffect(() => {
    adjustCountForZeroStock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedProducts]);

  const handleIncrement = (product) => {
    const updatedProducts = [...props.selectedProducts];
    const existingProduct = updatedProducts.find(
      (item) => item._id === product._id
    );

    if (existingProduct) {
      if (props.toStock || existingProduct.stockQuantity > 0) {
        existingProduct.count += 1;
        if (!props.toStock) {
          existingProduct.stockQuantity -= 1;
        }
        props.setRefreshData(!props.refreshData);
      }
    }
  };

  const handleDecrement = (product) => {
    const updatedProducts = [...props.selectedProducts];
    const existingProduct = updatedProducts.find(
      (item) => item._id === product._id
    );

    if (existingProduct && existingProduct.count > 0) {
      existingProduct.count -= 1;
      if (!props.toStock) {
        existingProduct.stockQuantity += 1;
      }
      props.setRefreshData(!props.refreshData);
    }
  };

  return (
    <Grid2
      sx={{
        m: 2,
        mt: 4,
        border: "1px solid #ccc",
        borderRadius: 4,
      }}
    >
      <Table size="small">
        <TableRow>
          <TableCell>
            <Typography sx={{ fontWeight: "bold", fontSize: 14 }}>
              Tipo
            </Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ fontWeight: "bold", fontSize: 14 }}>
              Nome
            </Typography>
          </TableCell>
          <TableCell align="left" sx={{ width: 200 }}>
            <Typography sx={{ fontWeight: "bold", fontSize: 14 }}>
              Valor {props.toStock ? "de Compra " : "de Venda "}
            </Typography>
          </TableCell>
          <TableCell align="center">
            <Typography sx={{ fontWeight: "bold", fontSize: 14 }}>
              Quantidade
            </Typography>
          </TableCell>
          <TableCell align="right">
            <Typography sx={{ fontWeight: "bold", fontSize: 14 }}>
              Estoque
            </Typography>
          </TableCell>
          <TableCell align="right">
            <Typography sx={{ fontWeight: "bold", fontSize: 14 }}>
              Total
            </Typography>
          </TableCell>
        </TableRow>
        {props.selectedProducts.map((product, index) => (
          <TableRow key={index} sx={{ mt: 3 }}>
            <TableCell>
              <Typography sx={{ fontSize: 14 }}>{product.type}</Typography>
            </TableCell>
            <TableCell>
              <Typography sx={{ fontSize: 14 }}>{product.name}</Typography>
            </TableCell>
            <TableCell align="left">
              <Typography sx={{ fontSize: 14 }}>
                R$
                {props.toStock
                  ? product.buyValue?.toFixed(2)
                  : product.sellValue?.toFixed(2)}
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Grid2 container direction="row" justifyContent="center">
                <Typography
                  sx={{ fontSize: 16, cursor: "pointer" }}
                  onClick={() => handleDecrement(product)}
                >
                  -
                </Typography>
                <Typography sx={{ fontSize: 14, mx: 2 }}>
                  {product.count}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 16,
                    cursor:
                      props.toStock || product.stockQuantity > 0
                        ? "pointer"
                        : "not-allowed",
                    color:
                      props.toStock || product.stockQuantity > 0
                        ? "inherit"
                        : "#ccc",
                  }}
                  onClick={() =>
                    (props.toStock || product.stockQuantity > 0) &&
                    handleIncrement(product)
                  }
                >
                  +
                </Typography>
              </Grid2>
            </TableCell>
            <TableCell align="right">
              <Typography
                sx={{
                  fontSize: 14,
                  color:
                    product.stockQuantity === 0 && !props.toStock
                      ? "#ffbbbb"
                      : "inherit",
                }}
              >
                {props.toStock
                  ? product.stockQuantity + product.count
                  : product.stockQuantity}
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography sx={{ fontSize: 14 }}>
                R$
                {props.toStock
                  ? product.buyValue &&
                    (product.buyValue * product.count).toFixed(2)
                  : product.sellValue &&
                    (product.sellValue * product.count).toFixed(2)}
              </Typography>
            </TableCell>
          </TableRow>
        ))}
        <TableRow sx={{ mt: 0.5 }}>
          <TableCell id="ghost" />
          <TableCell id="ghost" />
          <TableCell id="ghost" />
          <TableCell id="ghost" />
          <TableCell id="ghost" />
          <TableCell align="right">
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: "bold",
              }}
            >
              Total Geral R$
              {props.toStock
                ? props.selectedProducts
                    .reduce(
                      (sum, product) => sum + product.buyValue * product.count,
                      0
                    )
                    .toFixed(2)
                : props.selectedProducts
                    .reduce(
                      (sum, product) => sum + product.sellValue * product.count,
                      0
                    )
                    .toFixed(2)}
            </Typography>
          </TableCell>
        </TableRow>
      </Table>
    </Grid2>
  );
};

export default ProductsDisplayTableCell;
