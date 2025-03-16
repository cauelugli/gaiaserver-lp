/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import {
  Avatar,
  Button,
  Grid2,
  Tooltip,
  Typography,
  Popper,
} from "@mui/material";
import { useAppData } from "../../../src/AppDataContext";

import { icons } from "../../icons";

const ChartDataDetail = ({
  title,
  popoverData,
  handleCloseChartClick,
  mainColor,
}) => {
  const appData = useAppData();
  const idIndexList = appData.idIndexList;

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [itemPopperAnchor, setItemPopperAnchor] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item, event) => {
    setSelectedItem(item);
    setItemPopperAnchor(event.currentTarget);
  };

  const handleCloseItemPopper = () => {
    setSelectedItem(null);
    setItemPopperAnchor(null);
  };

  return (
    <Grid2
      sx={{
        p: 2,
        border: `1px solid ${mainColor}`,
        borderRadius: 1,
        backgroundColor: "#f8f8ff",
        minWidth: "25vw",
        height: "auto",
      }}
      container
      direction="column"
    >
      <Grid2
        sx={{ mb: 2 }}
        container
        direction="row"
        justifyContent="space-between"
      >
        <Grid2>
          <Typography id="title" variant="h5">
            {title}
          </Typography>
          <Typography variant="body2">em {popoverData?.date}</Typography>
        </Grid2>
        <Grid2>
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={handleCloseChartClick}
          >
            x
          </Button>
        </Grid2>
      </Grid2>
      <Grid2 container direction="column">
        <Grid2 container direction="column">
          {popoverData?.data.map((item, index) => (
            <Grid2
              key={index}
              sx={{
                m: 1,
                borderRadius: 1,
                cursor: "pointer",
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={(event) => handleItemClick(item, event)}
            >
              <Typography
                sx={{ fontWeight: hoveredIndex === index ? "bold" : "" }}
              >
                # {index + 1}
              </Typography>
              <Grid2
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  p: 2,
                  border: `1px solid ${mainColor}`,
                  transition: "background-color 0.3s ease",
                  borderRadius: 1,
                  backgroundColor: hoveredIndex === index ? "#ccc" : "inherit",
                }}
              >
                {item.customer ? (
                  <Tooltip
                    title={
                      idIndexList.find(
                        (customer) => customer.id === item.customer
                      )?.name || ""
                    }
                  >
                    <Avatar
                      src={`http://localhost:3000/static/${
                        idIndexList.find(
                          (customer) => customer.id === item.customer
                        )?.image || ""
                      }`}
                    />
                  </Tooltip>
                ) : (
                  ""
                )}

                <Grid2 container direction="row" alignItems="center">
                  {item.products?.map((product, index) => (
                    <Grid2 key={index} item>
                      <Tooltip
                        title={
                          <>
                            <Typography sx={{ color: "white" }}>
                              {product.name}
                            </Typography>
                            <Typography sx={{ color: "white" }}>
                              {product.count} x {product.sellValue}
                            </Typography>
                          </>
                        }
                      >
                        <Avatar
                          alt={product.name || "Product Image"}
                          src={`http://localhost:3000/static/${
                            product.images?.[0] || product.image?.[0] || ""
                          }`}
                          sx={{ width: 32, height: 32, mr: 0.5 }}
                        />
                      </Tooltip>
                    </Grid2>
                  ))}
                </Grid2>

                {hoveredIndex === index ? (
                  <icons.VisibilityIcon sx={{ color: mainColor }} />
                ) : (
                  <Typography sx={{ my: "auto" }}>
                    R$
                    {item.products
                      .reduce((acc, product) => {
                        const value =
                          product.sellValue || product.buyValue || 0;
                        return acc + (product.count || 1) * value;
                      }, 0)
                      .toFixed(2)}
                  </Typography>
                )}
              </Grid2>
            </Grid2>
          ))}
        </Grid2>

        <Typography
          align="right"
          sx={{ pt: 3, fontWeight: "bold", fontSize: "1.1vw" }}
        >
          Total do Dia: R$
          {popoverData?.data
            .reduce((total, item) => {
              const itemTotal = item.products.reduce((acc, product) => {
                const value = product.sellValue || product.buyValue || 0;
                return acc + (product.count || 1) * value;
              }, 0);
              return total + itemTotal;
            }, 0)
            .toFixed(2)}
        </Typography>
      </Grid2>

      <Popper
        open={Boolean(itemPopperAnchor)}
        anchorEl={itemPopperAnchor}
        placement="right-start"
        sx={{ pl: 1 }}
      >
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

          {selectedItem && (
            <>
              <Grid2 container direction="column">
                {selectedItem.customer && (
                  <Grid2 sx={{ mb: 1, p: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{ mb: 1, fontWeight: "bold" }}
                    >
                      Cliente
                    </Typography>
                    <Grid2 container direction="row" sx={{ ml: 2 }}>
                      <Avatar
                        src={`http://localhost:3000/static/${
                          idIndexList.find(
                            (customer) => customer.id === selectedItem.customer
                          )?.image || ""
                        }`}
                      />
                      <Typography sx={{ my: "auto", ml: 1 }}>
                        {idIndexList.find(
                          (customer) => customer.id === selectedItem.customer
                        )?.name || ""}
                      </Typography>
                    </Grid2>
                  </Grid2>
                )}

                <Grid2 sx={{ mb: 1, p: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{ mb: 1, fontWeight: "bold" }}
                  >
                    Produtos
                  </Typography>
                  <Grid2
                    container
                    direction="row"
                    columnSpacing={2}
                    sx={{ ml: 2 }}
                  >
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
                                  product.images?.[0] ||
                                  product.image?.[0] ||
                                  ""
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
                                  {(product.count * product.sellValue).toFixed(
                                    2
                                  )}
                                </Typography>
                              </Grid2>
                            </Grid2>
                          ))}
                        </Grid2>
                      </Grid2>
                    ))}
                  </Grid2>
                </Grid2>

                <Grid2 sx={{ mb: 1, p: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{ mb: 1, fontWeight: "bold" }}
                  >
                    Total
                  </Typography>
                  <Typography sx={{ my: "auto", ml: 2 }}>
                    R$
                    {selectedItem.products
                      .reduce((acc, product) => {
                        const value =
                          product.sellValue || product.buyValue || 0;
                        return acc + (product.count || 1) * value;
                      }, 0)
                      .toFixed(2)}
                  </Typography>
                </Grid2>
              </Grid2>
            </>
          )}
        </Grid2>
      </Popper>
    </Grid2>
  );
};

export default ChartDataDetail;
