/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Grid, Paper } from "@mui/material";

export default function MaterialList({
  stockItems,
  materials,
  setMaterials,
  materialsEditCost,
  setMaterialsFinalCost,
}) {
  const [selectedItemId, setSelectedItemId] = React.useState(null);
  const [options, setOptions] = React.useState(stockItems);
  const [stockList, setStockList] = React.useState(materials || []);
  const [materialsCost, setMaterialsCost] = React.useState(
    materialsEditCost || 0
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
      {
        materialsEditCost
          ? setMaterialsFinalCost(materialsEditCost + selectedOption.sellValue)
          : setMaterialsFinalCost(materialsCost + selectedOption.sellValue);
      }
      const newOptions = options.map((option) =>
        option._id === selectedItemId
          ? { ...option, quantity: option.quantity - 1 }
          : option
      );
      setOptions(newOptions);
      const existingItem = stockList.find(
        (item) => item._id === selectedItemId
      );
      if (existingItem) {
        const updatedStockList = stockList.map((item) =>
          item._id === selectedItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
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
    setMaterialsCost(materialsCost - item.sellValue);
    {
      materialsEditCost
        ? setMaterialsFinalCost(materialsEditCost - item.sellValue)
        : setMaterialsFinalCost(materialsCost - item.sellValue);
    }

    const updatedStockList = stockList.map((item) =>
      item._id === itemId ? { ...item, quantity: --item.quantity } : item
    );
    setStockList(updatedStockList.filter((item) => item.quantity > 0));

    const newOptions = options.map((option) =>
      option._id === itemId
        ? { ...option, quantity: ++option.quantity }
        : option
    );

    setOptions(newOptions);
    setMaterials(updatedStockList.filter((item) => item.quantity > 0));
  };

  return (
    <Grid container sx={{ mt: 2 }}>
      <Grid item>
        <Typography>Em estoque:</Typography>
        <Paper sx={{ mt: 1, width: 350, height: 200, overflow: "auto" }}>
          <FormGroup sx={{ mt: 2 }}>
            {options.map((option) => (
              <FormControlLabel
                sx={{ px: 3 }}
                key={option.id}
                control={
                  <Checkbox
                    sx={{ mb: 0.5 }}
                    checked={option._id === selectedItemId}
                    onChange={() => handleChecked(option._id)}
                  />
                }
                label={
                  <Grid>
                    {
                      <Grid container direction="row">
                        <Typography>{option.name} </Typography>
                        <Typography sx={{ ml: 2 }}>
                          R${option.sellValue}{" "}
                        </Typography>
                        <Typography
                          sx={{ fontSize: "12px", color: "#777", p: 0.5 }}
                        >
                          (x{option.quantity}){" "}
                        </Typography>
                        {option._id === selectedItemId && (
                          <Button
                            variant="contained"
                            color="success"
                            sx={{ ml: 1, px: "-15px", height: "20px" }}
                            disabled={option.quantity === 0}
                            onClick={handleAddToStock}
                          >
                            +
                          </Button>
                        )}
                      </Grid>
                    }
                  </Grid>
                }
              />
            ))}
          </FormGroup>
        </Paper>
      </Grid>

      <Grid item sx={{ ml: "50px" }}>
        <Typography>Selecionados:</Typography>
        <Paper sx={{ mt: 1, width: 350, height: 200, overflow: "auto" }}>
          {stockList.map((item) => (
            <li key={item._id}>
              {
                <Grid container direction="row" sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ ml: 1, px: "-15px", height: "20px" }}
                    onClick={() => handleRemoveFromStock(item._id || item.id)}
                  >
                    -
                  </Button>
                  <Typography sx={{ ml: 2 }}>{item.name} </Typography>
                  <Typography
                    sx={{ mx: 1, fontSize: "12px", color: "#777", p: 0.5 }}
                  >
                    (x{item.quantity}){" "}
                  </Typography>
                  <Typography>
                    = R${(item.sellValue * item.quantity).toFixed(2)}{" "}
                  </Typography>
                </Grid>
              }
            </li>
          ))}
          <Typography sx={{ mt: 2 }}>
            Custo total: R${materialsCost.toFixed(2)}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}
