// TransferList.js
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";
import axios from "axios";
import {
  Avatar,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function TransferList({
  onSelectedChange,
  options,
  selectedList,
  title
}) {
  const [selectedItemId, setSelectedItemId] = React.useState(null);

  const handleChecked = (id) => {
    setSelectedItemId(id === selectedItemId ? null : id);
  };

  const handleAdd = () => {
    const selectedOption = options.find(
      (option) => option._id === selectedItemId
    );
    if (selectedOption) {
      const updatedOptions = options.filter(
        (option) => option._id !== selectedItemId
      );

      onSelectedChange(
        [...selectedList, { ...selectedOption }],
        updatedOptions
      );
      setSelectedItemId(null);
    }
  };

  const handleRemove = (itemId) => {
    const item = selectedList.find((item) => item._id === itemId);
    if (item) {
      const updatedSelectedList = selectedList.filter(
        (item) => item._id !== itemId
      );

      onSelectedChange(updatedSelectedList, [...options, { ...item }]);
    }
  };

  // Filtra as opções que não estão na selectedList
  const filteredOptions = options.filter(
    (option) => !selectedList.some((item) => item._id === option._id)
  );

  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="space-around"
      sx={{ mt: 2 }}
    >
      <Grid item>{title}</Grid>
      <Grid item>
        <Paper
          sx={{
            width: 175,
            height: 120,
            overflow: "auto",
            backgroundColor: "#ddd",
          }}
        >
          <FormGroup sx={{ mt: 1 }}>
            {filteredOptions.map((option) => (
              <FormControlLabel
                sx={{ ml: 1 }}
                key={option._id}
                control={
                  <Checkbox
                    size="small"
                    sx={{ mb: 0.5, p: 0.25 }}
                    checked={option._id === selectedItemId}
                    onChange={() => handleChecked(option._id)}
                  />
                }
                label={
                  <Grid>
                    <Grid container direction="row">
                      <Typography sx={{ fontSize: 14 }}>
                        {option.name}
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
                          onClick={handleAdd}
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

      <Grid item>
        <Paper
          sx={{
            width: 175,
            height: 120,
            overflow: "auto",
            position: "relative",
            backgroundColor: "#ddd",
          }}
        >
          {selectedList.map((item) => (
            <li key={item._id}>
              <Grid container direction="row" sx={{ p: 0 }}>
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
                  onClick={() => handleRemove(item._id)}
                >
                  <Typography sx={{ fontWeight: "bold" }}>-</Typography>
                </IconButton>
                <Typography sx={{ ml: 2 }}>{item.name}</Typography>
              </Grid>
            </li>
          ))}
        </Paper>
      </Grid>
    </Grid>
  );
}
