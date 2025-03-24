/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import { Avatar, Button, Grid2, Typography, InputLabel } from "@mui/material";
import dayjs from "dayjs";

const ChartItemDetail = ({
  selectedItem,
  mainColor,
  idIndexList,
  handleCloseItemPopper,
  itemType,
}) => {
  if (!selectedItem) return null;

  return (
    <Grid2
      sx={{
        p: 2,
        border: `1px solid ${mainColor}`,
        borderRadius: 1,
        backgroundColor: "#f8f8ff",
        minWidth: "25vw",
      }}
      container
      direction="column"
    >
      <Grid2
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h6">Detalhes do Item</Typography>
        <Button
          size="small"
          variant="contained"
          color="error"
          onClick={handleCloseItemPopper}
        >
          x
        </Button>
      </Grid2>

      <Grid2 container direction="column">
        <Grid2 sx={{ p: 1 }}>
          <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold" }}>
            {itemType === "sale"
              ? "Venda"
              : itemType === "stockEntry"
              ? "Entrada de Estoque"
              : "Job"}
          </Typography>
          <Typography sx={{ my: "auto", ml: 2 }}>
            {selectedItem.number}
          </Typography>
        </Grid2>
        <Grid2
          sx={{ mb: 1, p: 1 }}
          container
          direction="row"
          justifyContent={itemType === "sale" ? "space-between" : ""}
          columnSpacing={3}
        >
          {selectedItem.customer && (
            <Grid2 item>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold" }}>
                Cliente
              </Typography>
              <Grid2 container direction="row">
                <Avatar
                  src={`http://localhost:3000/static/${
                    idIndexList.find(
                      (customer) => customer.id === selectedItem.customer
                    )?.image || ""
                  }`}
                />
              </Grid2>
              <InputLabel variant="standard" sx={{ mt: 1 }}>
                {idIndexList.find(
                  (customer) => customer.id === selectedItem.customer
                )?.name || ""}
              </InputLabel>
            </Grid2>
          )}

          <Grid2 item>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold" }}>
              Criado por
            </Typography>
            <Grid2 container direction="row">
              <Avatar
                src={`http://localhost:3000/static/${
                  idIndexList.find(
                    (customer) => customer.id === selectedItem.createdBy
                  )?.image || ""
                }`}
              />
              <Typography sx={{ my: "auto" }}>
                {idIndexList.find(
                  (createdBy) => createdBy.id === selectedItem.createdBy
                )?.name || ""}
              </Typography>
            </Grid2>
            <InputLabel variant="standard" sx={{ mt: 1 }}>
              {dayjs(selectedItem.createdAt).format("DD/MM/YY HH:MM")}
            </InputLabel>
          </Grid2>

          {selectedItem.resolvedBy ? (
            <Grid2 item>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold" }}>
                Resolvido por
              </Typography>
              <Grid2 container direction="row">
                <Avatar
                  src={`http://localhost:3000/static/${
                    idIndexList.find(
                      (resolver) => resolver.id === selectedItem.resolvedBy
                    )?.image || ""
                  }`}
                />
                <Typography sx={{ my: "auto" }}>
                  {idIndexList.find(
                    (resolver) => resolver.id === selectedItem.resolvedBy
                  )?.name || ""}
                </Typography>
              </Grid2>
              <InputLabel variant="standard" sx={{ mt: 1 }}>
                {dayjs(selectedItem.resolvedAt).format("DD/MM/YY HH:MM")}{" "}
              </InputLabel>
            </Grid2>
          ) : (
            <>
              <Grid2 id="ghost"></Grid2>
              <Grid2 id="ghost"></Grid2>
            </>
          )}
        </Grid2>

        {itemType === "sale" ? (
          <Grid2 sx={{ mb: 1, p: 1 }}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold" }}>
              Produtos
            </Typography>
            <Grid2 container direction="row" columnSpacing={2} sx={{ ml: 2 }}>
              {Object.entries(
                selectedItem.products?.reduce((acc, product) => {
                  const type = product.type || "Outros";
                  if (!acc[type]) {
                    acc[type] = [];
                  }
                  acc[type].push(product);
                  return acc;
                }, {})
              ).map(([type, products, index]) => (
                <Grid2 key={index}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    {type}
                  </Typography>
                  <Grid2
                    container
                    direction="row"
                    columnSpacing={2}
                    sx={{ mb: 2, ml: 2 }}
                  >
                    {products.map((product, index) => (
                      <Grid2
                        key={index}
                        container
                        direction="column"
                        alignItems="center"
                        sx={{ mb: 1 }}
                      >
                        <Avatar
                          alt={product.name || "Product Image"}
                          src={`http://localhost:3000/static/${
                            product.images?.[0] || product.image?.[0] || ""
                          }`}
                          sx={{ width: 32, height: 32, mr: 1 }}
                        />
                        <Grid2>
                          <Typography variant="body2">
                            {product.name}
                          </Typography>
                          <Typography variant="body2">
                            {product.count} x R${product.sellValue}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold" }}
                          >
                            R$
                            {(product.count * product.sellValue).toFixed(2)}
                          </Typography>
                        </Grid2>
                      </Grid2>
                    ))}
                  </Grid2>
                </Grid2>
              ))}
            </Grid2>
          </Grid2>
        ) : itemType === "stockEntry" ? (
          <Grid2 sx={{ mb: 1, p: 1 }}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold" }}>
              Produtos
            </Typography>
            <Grid2 container direction="row" columnSpacing={2} sx={{ ml: 2 }}>
              {Object.entries(
                selectedItem.items?.reduce((acc, item) => {
                  const type = item.type || "Outros";
                  if (!acc[type]) {
                    acc[type] = [];
                  }
                  acc[type].push(item);
                  return acc;
                }, {})
              ).map(([type, items, index]) => (
                <Grid2 key={index}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    {type}
                  </Typography>
                  <Grid2
                    container
                    direction="row"
                    columnSpacing={2}
                    sx={{ mb: 2, ml: 2 }}
                  >
                    {items.map((item, index) => (
                      <Grid2
                        key={index}
                        container
                        direction="column"
                        alignItems="center"
                        sx={{ mb: 1 }}
                      >
                        <Avatar
                          alt={item.name || "Product Image"}
                          src={`http://localhost:3000/static/${
                            item.images?.[0] || item.image?.[0] || ""
                          }`}
                          sx={{ width: 32, height: 32, mr: 1 }}
                        />
                        <Grid2>
                          <Typography variant="body2">{item.name}</Typography>
                          <Typography variant="body2">
                            {item.count} x R${item.buyValue}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold" }}
                          >
                            R$
                            {(item.count * item.buyValue).toFixed(2)}
                          </Typography>
                        </Grid2>
                      </Grid2>
                    ))}
                  </Grid2>
                </Grid2>
              ))}
            </Grid2>
          </Grid2>
        ) : (
          ""
        )}

        {itemType === "sale" ? (
          <Grid2 sx={{ mb: 1, p: 1 }}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold" }}>
              Entrega
            </Typography>
            <Typography sx={{ my: "auto", ml: 2 }}>
              {selectedItem.deliveryScheduledTo} -{" "}
              {selectedItem.deliveryAddress}
            </Typography>
          </Grid2>
        ) : (
          ""
        )}

        {itemType === "sale" || itemType === "stockEntry" ? (
          <Grid2 sx={{ mb: 1, p: 1 }}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold" }}>
              Total
            </Typography>
            {itemType === "sale" ? (
              <Typography sx={{ my: "auto", ml: 2 }}>
                R$
                {selectedItem.products
                  .reduce((acc, product) => {
                    const value = product.sellValue || 0;
                    return acc + (product.count || 1) * value;
                  }, 0)
                  .toFixed(2)}
              </Typography>
            ) : (
              <Typography sx={{ my: "auto", ml: 2 }}>
                R$
                {selectedItem.items
                  .reduce((acc, item) => {
                    const value = item.buyValue || 0;
                    return acc + (item.count || 1) * value;
                  }, 0)
                  .toFixed(2)}
              </Typography>
            )}
          </Grid2>
        ) : (
          ""
        )}

        {selectedItem.price ? (
          <Grid2 sx={{ mb: 1, p: 1 }}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold" }}>
              Valor
            </Typography>
            <Typography sx={{ my: "auto", ml: 2 }}>
              R${selectedItem.price.toFixed(2)}
            </Typography>
          </Grid2>
        ) : (
          ""
        )}

        <Grid2 sx={{ mb: 1, p: 1 }}>
          <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold" }}>
            Status
          </Typography>
          <Typography sx={{ my: "auto", ml: 2 }}>
            {selectedItem.status}
          </Typography>
        </Grid2>

        {selectedItem.resolution ? (
          <Grid2 sx={{ mb: 1, p: 1 }}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold" }}>
              Resolução
            </Typography>
            <Typography sx={{ my: "auto", ml: 2 }}>
              {selectedItem.resolution}
            </Typography>
          </Grid2>
        ) : (
          ""
        )}
      </Grid2>
    </Grid2>
  );
};

export default ChartItemDetail;
