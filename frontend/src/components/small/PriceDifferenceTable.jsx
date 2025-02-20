/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";

import {
  Button,
  Grid2,
  InputAdornment,
  Table,
  TableCell,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

import { icons } from "../../icons";

import { calculatePriceDifferences } from "../../../../controllers/functions/overallFunctions";

const PriceDifferenceTable = (props) => {
  const [confirmButton, setConfirmButton] = React.useState(false);

  useEffect(() => {}, [props.sum]);

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
    const hasErrors = {
      body: newItem.body === "",
      itemValue: newItem.itemValue === "",
    };

    setErrors(hasErrors);

    if (!hasErrors.body && !hasErrors.itemValue) {
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
    }
  };

  const handleDeleteItem = (index) => {
    props.setPriceDifference((prevItems) => {
      const updatedItems = { ...prevItems };
      delete updatedItems[index];
      return updatedItems;
    });
  };

  const handleConfirmDifference = () => {
    props.setFinalPrice(finalSum.toFixed(2));
    props.setOkToDispatch(true);
    setConfirmButton(true);
  };

  const handleCancelDifference = () => {
    props.setFinalPrice(finalSum.toFixed(2));
    props.setOkToDispatch(false);
    setConfirmButton(false);
  };

  const [errors, setErrors] = useState({
    body: false,
    itemValue: false,
  });

  const { sumOfAllIncreases, sumOfAllDiscounts, finalSum } =
    calculatePriceDifferences(props.priceDifference, props.sum);

  return (
    <>
      {props.showTitle !== 0 && (
        <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
          Alterações
        </Typography>
      )}
      <Grid2
        container
        direction="column"
        justifyContent="flex-end"
        alignItems="flex-end"
        sx={{ border: "1px solid #ccc", borderRadius: 1 }}
      >
        <Table size="small">
          <TableRow id="header">
            <TableCell>
              <Typography sx={{ fontWeight: "bold", fontSize: 13 }}>
                + | -
              </Typography>
            </TableCell>
            <TableCell>
              <Typography sx={{ fontWeight: "bold", fontSize: 13 }}>
                Discriminação
              </Typography>
            </TableCell>
            <TableCell>
              <Typography sx={{ fontWeight: "bold", fontSize: 13 }}>
                Tipo
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography sx={{ fontWeight: "bold", fontSize: 13 }}>
                Valor
              </Typography>
            </TableCell>
            <TableCell align="right">
              <icons.CheckIcon sx={{ fontWeight: "bold", fontSize: 14 }} />
            </TableCell>
          </TableRow>
          {Object.keys(props.priceDifference).map((key) => {
            const item = props.priceDifference[key];
            return (
              <TableRow key={item.index} id="item">
                <TableCell>
                  <Typography sx={{ fontSize: 13 }}>
                    {item.plusOrLess}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: 13 }}>{item.body}</Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: 13 }}>{item.type}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography sx={{ fontSize: 13 }}>
                    {item.itemValue}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {props.okToDispatch ? (
                    ""
                  ) : (
                    <icons.DeleteIcon
                      sx={{ fontSize: 14, cursor: "pointer" }}
                      onClick={() => handleDeleteItem(item.index)}
                    />
                  )}
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
                      newItem.plusOrLess === "+" ? "green" : undefined,
                    "&.Mui-selected": {
                      backgroundColor: "green",
                      "&:hover": {
                        backgroundColor: "green",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "#90ee90",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13,
                      color: newItem.plusOrLess === "+" && "white",
                    }}
                  >
                    +
                  </Typography>
                </ToggleButton>
                <ToggleButton
                  value="-"
                  size="small"
                  sx={{
                    backgroundColor:
                      newItem.plusOrLess === "-" ? "red" : undefined,
                    "&.Mui-selected": {
                      backgroundColor: "red",
                      "&:hover": {
                        backgroundColor: "red",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "#ffcccb",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13,
                      color: newItem.plusOrLess === "-" && "white",
                    }}
                  >
                    -
                  </Typography>
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
                error={errors.body}
                helperText={errors.body ? "Campo obrigatório" : ""}
              />
            </TableCell>
            <TableCell>
              <ToggleButtonGroup
                exclusive
                value={newItem.type}
                onChange={handleChangeType}
              >
                <ToggleButton value="$" size="small">
                  <Typography sx={{ fontSize: 13 }}>R$</Typography>
                </ToggleButton>
                <ToggleButton value="%" size="small">
                  <Typography sx={{ fontSize: 13 }}>%</Typography>
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
                      <Typography sx={{ fontSize: 13 }}>R$</Typography>
                    </InputAdornment>
                  ),
                  endAdornment: newItem.type === "%" && (
                    <InputAdornment position="end">
                      <Typography sx={{ fontSize: 13 }}>%</Typography>
                    </InputAdornment>
                  ),
                }}
                error={errors.itemValue}
                helperText={errors.itemValue ? "Campo obrigatório" : ""}
              />
            </TableCell>
            <TableCell align="right">
              {props.okToDispatch ? (
                ""
              ) : (
                <icons.AddIcon
                  sx={{ fontSize: 14, cursor: "pointer" }}
                  onClick={handleAddItem}
                />
              )}
            </TableCell>
          </TableRow>
        </Table>
      </Grid2>
      {props.openAddDifference &&
        Object.keys(props.priceDifference).length !== 0 && (
          <>
            <Typography sx={{ mt: 2, fontSize: 16, fontWeight: "bold" }}>
              Acréscimos e Descontos
            </Typography>
            <Grid2
              container
              direction="column"
              sx={{
                border: "1px solid #ccc",
                borderRadius: 1,
              }}
            >
              <Grid2 item sx={{ m: 1, mx: 2 }}>
                <Grid2 container direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: 16 }}>
                    {props.fieldType === "productList"
                      ? "Serviço + Itens"
                      : "Valor dos Itens"}
                  </Typography>
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    R${props.sum ? props.sum : 0.0}
                  </Typography>
                </Grid2>
              </Grid2>
              <Grid2 item sx={{ m: 1, mx: 2 }}>
                <Grid2 container direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: 16, color: "green" }}>
                    Acréscimos
                  </Typography>
                  <Typography sx={{ fontSize: 16, color: "green" }}>
                    + R${sumOfAllIncreases.toFixed(2)}
                  </Typography>
                </Grid2>
              </Grid2>
              <Grid2 item sx={{ m: 1, mx: 2 }}>
                <Grid2 container direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: 16, color: "red" }}>
                    Descontos
                  </Typography>
                  <Typography sx={{ fontSize: 16, color: "red" }}>
                    - R${sumOfAllDiscounts.toFixed(2)}
                  </Typography>
                </Grid2>
              </Grid2>
              <Grid2 item sx={{ m: 1, mx: 2 }}>
                <Grid2 container direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: 16 }}>Valor Final</Typography>
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    R${finalSum.toFixed(2)}
                  </Typography>
                </Grid2>
              </Grid2>
            </Grid2>
            <Grid2 container direction="row" justifyContent="flex-end">
              {confirmButton ? (
                <Button
                  size="small"
                  variant="outlined"
                  color="inherit"
                  onClick={handleCancelDifference}
                  sx={{ mt: 1 }}
                >
                  Editar Acréscimos
                </Button>
              ) : (
                <Button
                  size="small"
                  variant="outlined"
                  color="success"
                  onClick={handleConfirmDifference}
                  sx={{ mt: 1 }}
                >
                  Aceitar Acréscimos
                </Button>
              )}
            </Grid2>
          </>
        )}
    </>
  );
};

export default PriceDifferenceTable;
