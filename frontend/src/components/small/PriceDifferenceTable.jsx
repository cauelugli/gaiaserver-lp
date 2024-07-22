/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";

import {
  Grid,
  InputAdornment,
  Table,
  TableCell,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";

import { calculatePriceDifferences } from "../../../../controllers/functions/overallFunctions";

const PriceDifferenceTable = (props) => {
  useEffect(() => {
    console.log("Sum changed:", props.sum);
    // Aqui você pode recalcular os valores ou realizar outras ações baseadas em sum
  }, [props.sum]);

  const [newItem, setNewItem] = useState({
    index: null,
    plusOrLess: "+",
    body: "",
    type: "$",
    itemValue: "",
  });

  const handleChangePlusOrLess = (event, newPlusOrLess) => {
    if (newPlusOrLess !== null) {
      setNewItem((prevItem) => ({ ...prevItem, plusOrLess: newPlusOrLess }));
    }
  };

  const handleChangeBody = (event) => {
    setNewItem((prevItem) => ({ ...prevItem, body: event.target.value }));
  };

  const handleChangeType = (event, newType) => {
    if (newType !== null) {
      setNewItem((prevItem) => ({ ...prevItem, type: newType }));
    }
  };

  const handleChangeItemValue = (event) => {
    setNewItem((prevItem) => ({
      ...prevItem,
      itemValue: event.target.value,
    }));
  };

  const handleAddItem = () => {
    const newIndex = Object.keys(props.priceDifference).length;
    props.setPriceDifference((prevItems) => ({
      ...prevItems,
      [newIndex]: {
        ...newItem,
        index: newIndex,
        itemValue: parseFloat(newItem.itemValue),
      },
    }));
    setNewItem({
      index: null,
      plusOrLess: "+",
      body: "",
      type: "$",
      itemValue: "",
    });
  };

  const handleDeleteItem = (index) => {
    props.setPriceDifference((prevItems) => {
      const updatedItems = { ...prevItems };
      delete updatedItems[index];
      return updatedItems;
    });
  };

  const { sumOfAllIncreases, sumOfAllDiscounts, finalSum } =
    calculatePriceDifferences(props.priceDifference, props.sum);

  return (
    <>
      <Grid
        container
        direction="column"
        justifyContent="flex-end"
        alignItems="flex-end"
        sx={{ m: 1, border: "1px solid #ccc", borderRadius: 1, width: "100%" }}
      >
        <Table size="small">
          <TableRow>
            <TableCell>
              <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>
                + | -
              </Typography>
            </TableCell>
            <TableCell>
              <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>
                Discriminação
              </Typography>
            </TableCell>
            <TableCell>
              <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>
                Tipo
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>
                Valor
              </Typography>
            </TableCell>
            <TableCell align="right">
              <CheckIcon sx={{ fontWeight: "bold", fontSize: 14 }} />
            </TableCell>
          </TableRow>
          {Object.keys(props.priceDifference).map((key) => {
            const item = props.priceDifference[key];
            return (
              <TableRow key={item.index}>
                <TableCell>
                  <Typography sx={{ fontSize: 12 }}>
                    {item.plusOrLess}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: 12 }}>{item.body}</Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: 12 }}>{item.type}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography sx={{ fontSize: 12 }}>
                    {item.itemValue}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <DeleteIcon
                    sx={{ fontSize: 14, cursor: "pointer" }}
                    onClick={() => handleDeleteItem(item.index)}
                  />
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell>
              <ToggleButtonGroup
                exclusive
                value={newItem.plusOrLess}
                onChange={handleChangePlusOrLess}
              >
                <ToggleButton
                  value="+"
                  size="small"
                  sx={{
                    backgroundColor:
                      newItem.plusOrLess === "+" ? "success.main" : "inherit",
                    color: newItem.plusOrLess === "+" ? "white" : "inherit",
                    "&:hover": {
                      backgroundColor:
                        newItem.plusOrLess === "+" ? "success.dark" : "inherit",
                    },
                  }}
                >
                  <Typography sx={{ fontSize: 12 }}>+</Typography>
                </ToggleButton>
                <ToggleButton
                  value="-"
                  size="small"
                  sx={{
                    backgroundColor:
                      newItem.plusOrLess === "-" ? "error.main" : "inherit",
                    color: newItem.plusOrLess === "-" ? "white" : "inherit",
                    "&:hover": {
                      backgroundColor:
                        newItem.plusOrLess === "-" ? "error.dark" : "inherit",
                    },
                  }}
                >
                  <Typography sx={{ fontSize: 12 }}>-</Typography>
                </ToggleButton>
              </ToggleButtonGroup>
            </TableCell>
            <TableCell>
              <TextField
                placeholder="Discriminação"
                value={newItem.body}
                onChange={handleChangeBody}
                size="small"
                sx={{ width: "100%" }}
              />
            </TableCell>
            <TableCell>
              <ToggleButtonGroup
                exclusive
                value={newItem.type}
                onChange={handleChangeType}
              >
                <ToggleButton value="$" size="small">
                  <Typography sx={{ fontSize: 12 }}>R$</Typography>
                </ToggleButton>
                <ToggleButton value="%" size="small">
                  <Typography sx={{ fontSize: 12 }}>%</Typography>
                </ToggleButton>
              </ToggleButtonGroup>
            </TableCell>
            <TableCell align="right">
              <TextField
                value={newItem.itemValue}
                onChange={handleChangeItemValue}
                size="small"
                sx={{ width: "75%" }}
                InputProps={{
                  startAdornment: newItem.type === "$" && (
                    <InputAdornment position="start">
                      <Typography sx={{ fontSize: 12 }}>R$</Typography>
                    </InputAdornment>
                  ),
                  endAdornment: newItem.type === "%" && (
                    <InputAdornment position="end">
                      <Typography sx={{ fontSize: 12 }}>%</Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </TableCell>
            <TableCell align="right">
              <AddIcon
                sx={{ fontSize: 14, cursor: "pointer" }}
                onClick={handleAddItem}
              />
            </TableCell>
          </TableRow>
        </Table>
      </Grid>
      {props.openAddDifference &&
        Object.keys(props.priceDifference).length !== 0 && (
          <Grid
            container
            direction="column"
            sx={{
              m: 2,
              border: "1px solid #ccc",
              borderRadius: 1,
              width: "100%",
            }}
          >
            <Grid item sx={{ m: 1, mx: 2 }}>
              <Grid container direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: 14 }}>Valor Inicial</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>
                  R${props.sum ? props.sum : 0.0}
                </Typography>
              </Grid>
            </Grid>
            <Grid item sx={{ m: 1, mx: 2 }}>
              <Grid container direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: 14, color: "green" }}>
                  Acréscimos
                </Typography>
                <Typography sx={{ fontSize: 14, color: "green" }}>
                  + R${sumOfAllIncreases.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
            <Grid item sx={{ m: 1, mx: 2 }}>
              <Grid container direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: 14, color: "red" }}>
                  Descontos
                </Typography>
                <Typography sx={{ fontSize: 14, color: "red" }}>
                  - R${sumOfAllDiscounts.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
            <Grid item sx={{ m: 1, mx: 2 }}>
              <Grid container direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: 14 }}>Valor Final</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>
                  R${finalSum.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        )}
    </>
  );
};

export default PriceDifferenceTable;
