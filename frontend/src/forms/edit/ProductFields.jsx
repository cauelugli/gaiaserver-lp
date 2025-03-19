/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid2,
} from "@mui/material";

const ProductFields = ({ productFields, handleChange, fields }) => {
  const renderField = (field) => {
    switch (field.type) {
      case "string":
        return (
          <Grid2>
            <InputLabel>{field.name}</InputLabel>
            <TextField
              fullWidth
              label={field.name}
              value={fields[field.name] || ""}
              onChange={handleChange(field.name)}
              margin="normal"
            />
          </Grid2>
        );

      case "number":
        return (
          <Grid2>
            <InputLabel>{field.name}</InputLabel>
            <TextField
              size="small"
              type="number"
              value={fields[field.name] || ""}
              onChange={handleChange(field.name)}
              slotprops={{
                htmlInput: {
                  min: field.minValue || 0,
                  max: field.maxValue || undefined,
                  step: field.numberType === "integer" ? 1 : 0.01,
                },
              }}
              sx={{ width: 200 }}
            />
          </Grid2>
        );

      case "options":
        return (
          <Grid2>
            <InputLabel>{field.name}</InputLabel>
            <FormControl>
              <Select
                size="small"
                value={fields[field.name] || ""}
                onChange={handleChange(field.name)}
                sx={{ width: 200 }}
              >
                {field.options.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid2>
        );

      case "currency":
        return (
          <Grid2>
            <InputLabel>{field.name}</InputLabel>
            {/* <TextField
              fullWidth
              label={field.name}
              value={fields[field.name] || ""}
              onChange={handleChange(field.name)}
              margin="normal"
            /> */}
          </Grid2>
        );

      case "date":
        return (
          <Grid2>
            <InputLabel>{field.name}</InputLabel>
            {/* <TextField
              fullWidth
              label={field.name}
              value={fields[field.name] || ""}
              onChange={handleChange(field.name)}
              margin="normal"
            /> */}
          </Grid2>
        );

      default:
        return null;
    }
  };

  return (
    <Grid2 container>
      {productFields.map((field, index) => (
        <Grid2 key={index} sx={{ mr: 1 }}>
          {renderField(field)}
        </Grid2>
      ))}
    </Grid2>
  );
};

export default ProductFields;
