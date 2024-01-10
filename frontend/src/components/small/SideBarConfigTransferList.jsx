/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";

import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";

export default function SideBarConfigTransferList({
  onSelectedChange,
  options,
  selectedList,
  title,
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
    const updatedSelectedList = selectedList.filter(
      (item) => item._id !== itemId
    );

    onSelectedChange(updatedSelectedList, [...options, { ...item }]);
  };

  const filteredOptions = options.filter(
    (option) => !selectedList.some((item) => item._id === option._id)
  );

  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ mt: 2, border: "1px solid #ddd", borderRadius: 3 }}
    >
      <Grid item sx={{width:160, ml:1}}>
        <Typography sx={{ fontWeight: "bold" }}>
          {title.toUpperCase()}
        </Typography>
      </Grid>
      <Grid item sx={{width:180, my:2}}>
        <Grid
          sx={{
            height: 120,
            overflow: "auto",
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
        </Grid>
      </Grid>
      <Grid item sx={{width:180, my:2}}>
        <Grid
          sx={{
            height: 120,
            overflow: "auto",
          }}
        >
          {selectedList.length === 0 ? (
            <Typography sx={{ mt: 5, ml: 4 }}>Não há selecionados</Typography>
          ) : (
            selectedList.map((item) => (
              <li key={item._id}>
                <Grid container direction="row" sx={{ mt: 1 }}>
                  <IconButton
                    sx={{
                      ml: 1,
                      height: 16,
                      maxWidth: 16,
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
            ))
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
