/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
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
import { useAppData } from "../../AppDataContext";
import { icons } from "../../icons";
import ChartItemDetail from "./ChartItemDetail";

const ChartDataDetail = ({
  title,
  popoverData,
  handleCloseChartClick,
  mainColor,
  groupBy,
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

  const getType = (title) => {
    if (title.startsWith("Venda")) return "sale";
    if (title.startsWith("Entradas de Estoque")) return "stockEntry";
    if (title.startsWith("Job")) return "job";
    return "customer";
  };

  const type = getType(title);

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
                # {index + 1}{" "}
                {item.status === "Resolvido" ? (
                  <Tooltip title="Resolvido">✅</Tooltip>
                ) : item.status === "Arquivado" ? (
                  <Tooltip title="Arquivado">📁</Tooltip>
                ) : (
                  <Tooltip title="Pendente">🕒</Tooltip>
                )}
              </Typography>
              <Grid2
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  p: 2,
                  border: `1px solid #ccc`,
                  transition: "background-color 0.3s ease",
                  borderRadius: 1,
                  backgroundColor:
                    hoveredIndex === index ? `${mainColor}A0` : "",
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
                  <Tooltip title={"Entrada de Estoque"}>
                    <icons.WarehouseIcon />
                  </Tooltip>
                )}

                <Grid2 container direction="row" alignItems="center">
                  {type === "sale" ? (
                    item.products?.map((product, index) => (
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
                    ))
                  ) : type === "stockEntry" ? (
                    item.items.map((item, index) => (
                      <Grid2 key={index} item>
                        <Tooltip
                          title={
                            <>
                              <Typography sx={{ color: "white" }}>
                                {item.name}
                              </Typography>
                              <Typography sx={{ color: "white" }}>
                                {item.count} x {item.buyValue}
                              </Typography>
                            </>
                          }
                        >
                          <Avatar
                            alt={item.name || "Product Image"}
                            src={`http://localhost:3000/static/${
                              item.images?.[0] || item.image?.[0] || ""
                            }`}
                            sx={{ width: 32, height: 32, mr: 0.5 }}
                          />
                        </Tooltip>
                      </Grid2>
                    ))
                  ) : type === "job" ? (
                    <Typography variant="body1">{item.title}</Typography>
                  ) : (
                    <>
                      {item.products.length !== 0 ? (
                        item.products?.map((product, index) => (
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
                                  product.images?.[0] ||
                                  product.image?.[0] ||
                                  ""
                                }`}
                                sx={{ width: 32, height: 32, mr: 0.5 }}
                              />
                            </Tooltip>
                          </Grid2>
                        ))
                      ) : item.title ? (
                        <Typography>{item.title}</Typography>
                      ) : (
                        <Button onClick={() => console.log("item", item)}>
                          item
                        </Button>
                      )}
                    </>
                  )}
                </Grid2>

                {hoveredIndex === index ? (
                  <icons.VisibilityIcon />
                ) : type === "sale" ? (
                  <Typography sx={{ my: "auto" }}>
                    R$
                    {item.products.length !== 0
                      ? item.products
                          .reduce((acc, product) => {
                            const value = product.sellValue || 0;
                            return acc + (product.count || 1) * value;
                          }, 0)
                          .toFixed(2)
                      : "4.04"}
                  </Typography>
                ) : type === "stockEntry" ? (
                  <Typography sx={{ my: "auto" }}>
                    R$
                    {item.items.length !== 0
                      ? item.items
                          .reduce((acc, item) => {
                            const value = item.buyValue || 0;
                            return acc + (item.count || 1) * value;
                          }, 0)
                          .toFixed(2)
                      : "4.04"}
                  </Typography>
                ) : item.products.length !== 0 ? (
                  <Typography sx={{ my: "auto" }}>
                    R$
                    {item.products
                      ? item.products
                          .reduce((acc, product) => {
                            const value = product.sellValue || 0;
                            return acc + (product.count || 1) * value;
                          }, 0)
                          .toFixed(2)
                      : "4.04"}
                  </Typography>
                ) : (
                  <Typography>R$ {item.price.toFixed(2)}</Typography>
                )}

                {hoveredIndex !== index && item.worker ? (
                  <Tooltip
                    title={
                      idIndexList.find((worker) => worker.id === item.worker)
                        ?.name || ""
                    }
                  >
                    <Avatar
                      src={`http://localhost:3000/static/${
                        idIndexList.find((worker) => worker.id === item.worker)
                          ?.image || ""
                      }`}
                    />
                  </Tooltip>
                ) : (
                  ""
                )}
              </Grid2>
            </Grid2>
          ))}
        </Grid2>

        {type === "sale" ? (
          <Typography
            align="right"
            sx={{ pt: 3, fontWeight: "bold", fontSize: "1.1vw" }}
          >
            Total {groupBy === "day" ? "do Dia" : "do Mês"}: R$
            {popoverData?.data
              .reduce((total, item) => {
                const itemTotal = item.products.reduce((acc, product) => {
                  const value = product.sellValue || 0;
                  return acc + (product.count || 1) * value;
                }, 0);
                return total + itemTotal;
              }, 0)
              .toFixed(2)}
          </Typography>
        ) : type === "stockEntry" ? (
          <Typography
            align="right"
            sx={{ pt: 3, fontWeight: "bold", fontSize: "1.1vw" }}
          >
            Total {groupBy === "day" ? "do Dia" : "do Mês"}: R$
            {popoverData?.data
              .reduce((total, item) => {
                const itemTotal = item.items.reduce((acc, item) => {
                  const value = item.buyValue || 0;
                  return acc + (item.count || 1) * value;
                }, 0);
                return total + itemTotal;
              }, 0)
              .toFixed(2)}
          </Typography>
        ) : null}
      </Grid2>

      <Popper
        open={Boolean(itemPopperAnchor)}
        anchorEl={itemPopperAnchor}
        placement="right-start"
        sx={{ pl: 1 }}
      >
        <ChartItemDetail
          selectedItem={selectedItem}
          mainColor={mainColor}
          idIndexList={idIndexList}
          handleCloseItemPopper={handleCloseItemPopper}
          itemType={type}
        />
      </Popper>
    </Grid2>
  );
};

export default ChartDataDetail;
