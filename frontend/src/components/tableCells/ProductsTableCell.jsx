/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  FormControlLabel,
  Grid2,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { icons } from "../../icons";

import BadgedIcon from "../small/BadgedIcon";
import ProductsDisplayTableCell from "../tableCells/ProductsDisplayTableCell";

const ProductsTableCell = (props) => {
  const [baseProducts, setBaseProducts] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [searchType, setSearchType] = React.useState("name");
  const [selectedSearchType, setSelectedSearchType] =
    React.useState("Selecione");
  // eslint-disable-next-line no-unused-vars
  const [sum, setSum] = React.useState(0);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/get", {
          params: { model: "Product" },
        });
        setBaseProducts(response.data.filter((item) => !item.name));
        setProducts(response.data.filter((item) => item.name));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [props.fieldType]);

  React.useEffect(() => {
    let newSum;
    newSum =
      props.selectedProducts &&
      props.selectedProducts
        .reduce((sum, product) => sum + product.sellValue * product.count, 0)
        .toFixed(2);

    setSum(newSum);
  }, [props.selectedProducts, props.fieldType]);

  const uniqueTypes = Array.from(
    new Set(baseProducts.map((option) => option.type))
  );

  const filteredOptions = products.filter((option) => {
    if (searchType === "name") {
      return option.name?.toLowerCase().includes(searchValue.toLowerCase());
    } else if (searchType === "type") {
      return option.type?.toLowerCase() === selectedSearchType.toLowerCase();
    }
    return true;
  });

  const isProductInList = (productId) => {
    return props.selectedProducts?.some((p) => p._id === productId);
  };

  return (
    <>
      <Grid2 container direction="row" sx={{ mb: 1 }}>
        {searchType === "name" ? (
          <TextField
            placeholder="Pesquise..."
            size="small"
            sx={{ my: 1, width: 300 }}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <icons.SearchIcon />
                </InputAdornment>
              ),
              endAdornment:
                searchValue.length > 0 ? (
                  <InputAdornment position="end">
                    <icons.ClearIcon
                      cursor="pointer"
                      sx={{ color: "#d21404" }}
                      onClick={() => setSearchValue("")}
                    />
                  </InputAdornment>
                ) : (
                  ""
                ),
            }}
          />
        ) : (
          <Select
            value={selectedSearchType}
            onChange={(e) => setSelectedSearchType(e.target.value)}
            sx={{ my: 1, width: 250 }}
            size="small"
            renderValue={(selected) =>
              selected ? (
                <Typography>{selected}</Typography>
              ) : (
                selectedSearchType
              )
            }
          >
            {uniqueTypes.map((type, index) => (
              <MenuItem value={type} key={index}>
                {type}
              </MenuItem>
            ))}
          </Select>
        )}

        <RadioGroup
          row
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          sx={{ ml: 2 }}
        >
          <FormControlLabel value="name" control={<Radio />} label="Nome" />
          <FormControlLabel value="type" control={<Radio />} label="Tipo" />
        </RadioGroup>
      </Grid2>

      <Grid2
        container
        direction="row"
        alignItems="center"
        justifyContent="space-evenly"
      >
        {filteredOptions.length === 0 ? (
          <Typography sx={{ my: 4, fontSize: 20, fontColor: "darkgrey" }}>
            Nenhum Produto Encontrado
          </Typography>
        ) : (
          filteredOptions.map((option) => (
            <Grid2 item key={option._id}>
              <BadgedIcon
                item={option}
                handleProductChange={props.handleProductChange}
                value={props.value}
                isInList={isProductInList(option._id)}
              />
            </Grid2>
          ))
        )}
      </Grid2>
      {props.selectedProducts?.length !== 0 && (
        <ProductsDisplayTableCell
          selectedProducts={props.selectedProducts}
          handleProductChange={props.handleProductChange}
          fieldType={props.fieldType}
          servicePrice={props.servicePrice || 0}
          refreshData={props.refreshData}
          setRefreshData={props.setRefreshData}
          toStock={props.toStock}
        />
      )}
    </>
  );
};

export default ProductsTableCell;
