/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Grid, Paper } from "@mui/material";

export default function MaterialList({ stockItems, materials, setMaterials }) {
  const [selectedItemId, setSelectedItemId] = React.useState(null);
  const [options, setOptions] = React.useState(stockItems);
  const [stockList, setStockList] = React.useState([]);

  const handleChecked = (id) => {
    setSelectedItemId(id === selectedItemId ? null : id);
  };

  const handleAddToStock = () => {
    const selectedOption = options.find(
      (option) => option.id === selectedItemId
    );
    if (selectedOption) {
      const newOptions = options.map((option) =>
        option.id === selectedItemId
          ? { ...option, quantity: option.quantity - 1 }
          : option
      );
      setOptions(newOptions);
      const existingItem = stockList.find((item) => item.id === selectedItemId);
      if (existingItem) {
        const updatedStockList = stockList.map((item) =>
          item.id === selectedItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        setStockList(updatedStockList);
        // setMaterials(updatedStockList);
      } else {
        setStockList([...stockList, { ...selectedOption, quantity: 1 }]);
        // setMaterials([...stockList, { ...selectedOption, quantity: 1 }]);
      }
    }
  };

  const handleRemoveFromStock = (itemId) => {
    const updatedStockList = stockList.map((item) =>
      item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
    );
    setStockList(updatedStockList.filter((item) => item.quantity > 0));
    const newOptions = options.map((option) =>
      option.id === itemId
        ? { ...option, quantity: option.quantity + 1 }
        : option
    );
    setOptions(newOptions);
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{ mt: 2 }}
    >
      <Grid item>
        <Typography >Em estoque:</Typography>
        <Paper sx={{ mt:1, width: 350, height: 200, overflow: "auto" }}>
          <FormGroup>
            {options.map((option) => (
              <FormControlLabel
                sx={{ px: 3, py: 2 }}
                key={option.id}
                control={
                  <Checkbox
                    checked={option.id === selectedItemId}
                    onChange={() => handleChecked(option.id)}
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
                        <Typography sx={{ fontSize: "12px", color: "#777", p:0.5 }}>
                          (x{option.quantity}){" "}
                        </Typography>
                        {option.id === selectedItemId && (
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

      <Grid item sx={{ mt:1, ml: "50px" }}>
        <Typography>Selecionados:</Typography>
        <Paper sx={{ width: 350, height: 200, overflow: "auto" }}>
          {stockList.map((item) => (
            <li key={item.id}>
              {`${item.label} - ${item.quantity}`}
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleRemoveFromStock(item.id)}
              >
                -
              </Button>
            </li>
          ))}
        </Paper>
      </Grid>
    </Grid>
  );
}
