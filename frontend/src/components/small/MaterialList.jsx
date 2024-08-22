/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";
import {
  Avatar,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

export default function MaterialList({
  stockItems,
  materials,
  setMaterials,
  materialsEditCost,
  materialsAddJobCost,
  setMaterialsFinalCost,
  // option,
  productsDefined,
}) {
  const [selectedItemId, setSelectedItemId] = React.useState(null);
  const [options, setOptions] = React.useState(stockItems);
  const [stockList, setStockList] = React.useState(materials || []);
  const [materialsCost, setMaterialsCost] = React.useState(
    materialsEditCost || materialsAddJobCost || 0
  );
  const [searchValue, setSearchValue] = React.useState("");

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleChecked = (id) => {
    setSelectedItemId(id === selectedItemId ? null : id);
  };

  const handleAddToStock = () => {
    const selectedOption = options.find(
      (option) => option._id === selectedItemId
    );
    if (selectedOption) {
      setMaterialsCost(materialsCost + selectedOption.sellValue);
      setMaterialsFinalCost((prevCost) => prevCost + selectedOption.sellValue);
      const newOptions = options.map((option) =>
        option._id === selectedItemId
          ? { ...option, quantity: option.quantity - 1 }
          : option
      );
      setOptions(newOptions);

      const existingItemIndex = stockList.findIndex(
        (item) => item._id === selectedItemId
      );
      if (existingItemIndex !== -1) {
        const updatedStockList = [...stockList];
        updatedStockList[existingItemIndex] = {
          ...updatedStockList[existingItemIndex],
          quantity: updatedStockList[existingItemIndex].quantity + 1,
        };
        setStockList(updatedStockList);
        setMaterials(updatedStockList);
      } else {
        setStockList([...stockList, { ...selectedOption, quantity: 1 }]);
        setMaterials([...stockList, { ...selectedOption, quantity: 1 }]);
      }
    }
  };

  const handleRemoveFromStock = (itemId) => {
    const item = stockList.find((item) => item._id === itemId);
    if (item) {
      // Subtrair o valor do item vendido por unidade, em vez do valor total
      const itemValue = item.sellValue;

      // Atualizar o custo
      setMaterialsCost(materialsCost - itemValue);
      setMaterialsFinalCost((prevCost) => prevCost - item.sellValue);

      // Atualizar a lista de estoque
      const updatedStockList = stockList
        .map((item) =>
          item._id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);

      // Atualizar as opções no estoque
      const updatedOptions = options.map((option) =>
        option._id === itemId
          ? { ...option, quantity: option.quantity + 1 }
          : option
      );

      setStockList(updatedStockList);
      setMaterials(updatedStockList);
      setOptions(updatedOptions);
    }
  };

  return (
    <Grid container sx={{ mt: 2 }}>
      {!productsDefined && (
        <Grid item>
          <Grid container direction="row" justifyContent="flex-start">
            <Grid item>
              <Typography>Em estoque:</Typography>
            </Grid>
            <Grid item>
              <TextField
                placeholder="Pesquise aqui..."
                size="small"
                sx={{ ml: 2, mt: -2, width: 175 }}
                value={searchValue}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment:
                    searchValue.length > 0 ? (
                      <InputAdornment position="end">
                        <ClearIcon
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
            </Grid>
          </Grid>

          <Paper sx={{ width: 400, height: 200, overflow: "auto" }}>
            <FormGroup sx={{ mt: 1 }}>
              {options
                .filter((opt) =>
                  opt.name.toLowerCase().includes(searchValue.toLowerCase())
                )
                .map((option) => (
                  <Grid
                    key={option._id}
                    container
                    direction="row"
                    sx={{ mx: 8 }}
                  >
                    <FormControlLabel
                      sx={{ ml: 1 }}
                      control={
                        <Checkbox
                          size="small"
                          sx={{ mb: 0.5 }}
                          checked={option._id === selectedItemId}
                          onChange={() => handleChecked(option._id)}
                        />
                      }
                      label={
                        <Grid
                          container
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Avatar
                            alt="Imagem do Produto"
                            src={`http://localhost:3000/static/${option.image}`}
                            sx={{
                              width: 20,
                              height: 20,
                              marginRight: 1,
                              opacity: option.quantity === 0 ? 0.5 : 1,
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: 12,
                              color: option.quantity === 0 ? "grey" : "black",
                            }}
                          >
                            {option.name}
                          </Typography>
                          <Typography
                            sx={{
                              mx: 1,
                              fontSize: 12,
                              color: option.quantity === 0 ? "grey" : "black",
                            }}
                          >
                            R${option.sellValue}
                          </Typography>
                          <Typography sx={{ fontSize: 12, color: "#777" }}>
                            (x{option.quantity}){" "}
                          </Typography>
                          {option._id === selectedItemId && (
                            <IconButton
                              sx={{
                                ml: 1,
                                height: 18,
                                maxWidth: 18,
                                color: "white",
                                backgroundColor: "green",
                                borderRadius: 3,
                                "&:hover": {
                                  color: "white",
                                  backgroundColor: "green",
                                },
                              }}
                              disabled={option.quantity === 0}
                              onClick={handleAddToStock}
                            >
                              <Typography sx={{ fontWeight: "bold" }}>
                                +
                              </Typography>
                            </IconButton>
                          )}
                        </Grid>
                      }
                    />
                  </Grid>
                ))}
            </FormGroup>
          </Paper>
        </Grid>
      )}

      <Grid item sx={{ ml: productsDefined ? "20px" : "40px" }}>
        <Typography>Selecionados:</Typography>
        <Paper
          sx={{
            width: productsDefined ? 800 : 400,
            height: productsDefined ? 150 : 200,
            overflow: "auto",
            position: "relative",
          }}
        >
          {stockList.map((item) => (
            <li key={item._id}>
              <Grid container direction="row" sx={{ mt: 2, px: 0.5, mx: 8 }}>
                {!productsDefined && (
                  <IconButton
                    sx={{
                      ml: 1,
                      height: 18,
                      maxWidth: 18,
                      color: "white",
                      backgroundColor: "red",
                      borderRadius: 3,
                      "&:hover": {
                        color: "white",
                        backgroundColor: "red",
                      },
                    }}
                    onClick={() => handleRemoveFromStock(item._id || item.id)}
                  >
                    <Typography sx={{ fontWeight: "bold" }}>-</Typography>
                  </IconButton>
                )}
                <Avatar
                  alt="Imagem do Produto"
                  src={`http://localhost:3000/static/${item.image}`}
                  sx={{
                    width: 20,
                    height: 20,
                    marginLeft: 1,
                  }}
                />
                <Typography sx={{ ml: 2, fontSize:12 }}>
                  {item.name}
                </Typography>
                <Typography sx={{ mx: 1, fontSize:12, color: "#777" }}>
                  (x{item.quantity}){" "}
                </Typography>
                <Typography sx={{ fontSize:12 }}>
                  = R${(item.sellValue * item.quantity).toFixed(2)}{" "}
                </Typography>
              </Grid>
            </li>
          ))}
        </Paper>
        <FormHelperText>
          <Typography textAlign="right" sx={{ fontWeight:"bold", fontSize:16 }}>
            Total: R${materialsCost.toFixed(2)}
          </Typography>
        </FormHelperText>
      </Grid>
    </Grid>
  );
}
