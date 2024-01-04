/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";

import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Switch,
  Typography,
} from "@mui/material";

// Dentro do componente filho NotificationsConfigTransferList
export default function NotificationsConfigTransferList({
  onSelectedChange,
  onSwitchChange, // Adicione onSwitchChange como prop
  options,
  booleans,
  selectedList,
  title,
}) {
  const [selectedItemId, setSelectedItemId] = React.useState(null);
  const [switchState, setSwitchState] = React.useState(booleans);

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

  const handleSwitchChange = () => {
    setSwitchState((prevState) => !prevState);
    onSwitchChange(!switchState, title.toLowerCase());
  };

  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="space-around"
      sx={{ mt: 3, border: "1px solid #ddd", px: 1, py: 2, borderRadius: 3 }}
    >
      <Grid item sx={{ width: 200, ml: 5, mr: -2 }}>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography sx={{ fontWeight: "bold" }}>
            {title.toUpperCase()}
          </Typography>
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{ mt: 0.5 }}
          >
            <Typography sx={{ my: "auto", fontSize: 12 }}>
              Desativado
            </Typography>
            <Switch checked={switchState} onChange={handleSwitchChange} />
            <Typography sx={{ my: "auto", fontSize: 12 }}>Ativado</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item sx={{ width: 250, ml: 4 }}>
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
      <Grid item sx={{ width: 250 }}>
        <Grid
          sx={{
            height: 120,
            overflow: "auto",
          }}
        >
          {Array.isArray(selectedList) && selectedList.length > 0 ? (
            selectedList.map((item) => (
              <li key={item._id}>
                <Grid container direction="row" sx={{ mt: 1 }}>
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
            ))
          ) : (
            <Typography sx={{ mt: 5, ml: 4 }}>Não há selecionados</Typography>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
