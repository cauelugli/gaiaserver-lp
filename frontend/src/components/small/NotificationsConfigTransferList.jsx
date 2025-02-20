/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";

import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid2,
  IconButton,
  Switch,
  Typography,
} from "@mui/material";

export default function NotificationsConfigTransferList({
  onSelectedChange,
  onSwitchChange,
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
    <Grid2
      container
      direction="row"
      alignItems="center"
      justifyContent="space-around"
      sx={{ mt: 3, border: "1px solid #ddd", px: 1, py: 2, borderRadius: 3 }}
    >
      <Grid2 item sx={{ width: 200, ml: 5, mr: -2 }}>
        <Grid2
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography sx={{ fontWeight: "bold" }}>
            {title.toUpperCase()}
          </Typography>
          <Grid2
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
          </Grid2>
        </Grid2>
      </Grid2>
      <Grid2 item sx={{ width: 250, ml: 4 }}>
        <Grid2
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
                  <Grid2>
                    <Grid2 container direction="row">
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
                    </Grid2>
                  </Grid2>
                }
              />
            ))}
          </FormGroup>
        </Grid2>
      </Grid2>
      <Grid2 item sx={{ width: 250 }}>
        <Grid2
          sx={{
            height: 120,
            overflow: "auto",
          }}
        >
          {Array.isArray(selectedList) && selectedList.length > 0 ? (
            selectedList.map((item) => (
              <li key={item._id}>
                <Grid2 container direction="row" sx={{ mt: 1 }}>
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
                </Grid2>
              </li>
            ))
          ) : (
            <Typography sx={{ mt: 5, ml: 4 }}>Não há selecionados</Typography>
          )}
        </Grid2>
      </Grid2>
    </Grid2>
  );
}
