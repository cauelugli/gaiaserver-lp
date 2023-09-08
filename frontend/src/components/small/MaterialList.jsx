/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import { FormHelperText, Grid, IconButton, Paper } from "@mui/material";

export default function MaterialList({
  stockItems,
  materials,
  setMaterials,
  materialsEditCost,
  materialsAddJobCost,
  setMaterialsFinalCost,
}) {
  const [selectedItemId, setSelectedItemId] = React.useState(null);
  const [options, setOptions] = React.useState(stockItems);
  const [stockList, setStockList] = React.useState(materials || []);
  const [materialsCost, setMaterialsCost] = React.useState(
    materialsEditCost || materialsAddJobCost || 0
  );

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
      setMaterialsCost(materialsCost - item.sellValue);
      setMaterialsFinalCost((prevCost) => prevCost - item.sellValue);
      const updatedStockList = stockList
        .map((item) =>
          item._id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);
      setStockList(updatedStockList);
      setMaterials(updatedStockList);
    }
  };
  

  return (
    <Grid container sx={{ mt: 2 }}>
      <Grid item>
        <Typography>Em estoque:</Typography>
        <Paper sx={{ mt: 1, width: 350, height: 200, overflow: "auto" }}>
          <FormGroup sx={{ mt: 2 }}>
            {options.map((option) => (
              <FormControlLabel
                sx={{ ml: 1 }}
                key={option._id}
                control={
                  <Checkbox
                    size="small"
                    sx={{ mb: 0.5 }}
                    checked={option._id === selectedItemId}
                    onChange={() => handleChecked(option._id)}
                  />
                }
                label={
                  <Grid>
                    <Grid container direction="row">
                      <Typography sx={{ fontSize: 12 }}>
                        {option.name}
                      </Typography>
                      <Typography sx={{ mx: 1, fontSize: 12 }}>
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
                          <Typography sx={{ fontWeight: "bold" }}>+</Typography>
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                }
              />
            ))}
          </FormGroup>
        </Paper>
      </Grid>

      <Grid item sx={{ ml: "50px" }}>
        <Typography>Selecionados:</Typography>
        <Paper
          sx={{
            mt: 1,
            width: 350,
            height: 200,
            overflow: "auto",
            position: "relative",
          }}
        >
          {stockList.map((item) => (
            <li key={item._id}>
              <Grid container direction="row" sx={{ mt: 2, px: 0.5 }}>
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
                <Typography sx={{ ml: 2, fontSize: 12 }}>
                  {item.name}
                </Typography>
                <Typography sx={{ mx: 1, fontSize: 12, color: "#777" }}>
                  (x{item.quantity}){" "}
                </Typography>
                <Typography sx={{ fontSize: 12 }}>
                  = R${(item.sellValue * item.quantity).toFixed(2)}{" "}
                </Typography>
              </Grid>
            </li>
          ))}
        </Paper>
        <FormHelperText>
          <Typography textAlign="right" sx={{ color: "black" }}>
            Total de Materiais: R${materialsCost.toFixed(2)}
          </Typography>
        </FormHelperText>
      </Grid>
    </Grid>
  );
}
