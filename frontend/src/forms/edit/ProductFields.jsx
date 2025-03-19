/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const ProductFields = ({ productFields, handleChange, fields }) => {
  const renderField = (field) => {
    switch (field.type) {
      case "text":
        return (
          <TextField
            fullWidth
            label={field.name}
            value={fields[field.name] || ""}
            onChange={handleChange(field.name)}
            margin="normal"
          />
        );

      case "number":
        return (
          <TextField
            fullWidth
            label={field.name}
            type="number"
            value={fields[field.name] || ""}
            onChange={handleChange(field.name)}
            margin="normal"
            inputProps={{
              min: field.minValue || 0,
              max: field.maxValue || undefined,
              step: field.numberType === "integer" ? 1 : 0.01,
            }}
          />
        );

      case "options":
        return (
          <FormControl fullWidth margin="normal">
            <InputLabel>{field.name}</InputLabel>
            <Select
              value={fields[field.name] || ""}
              onChange={handleChange(field.name)}
              label={field.name}
            >
              {field.options.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case "checkbox":
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={fields[field.name] || false}
                onChange={handleChange(field.name)}
                color="primary"
              />
            }
            label={field.name}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {productFields.map((field, index) => (
        <div key={index}>{renderField(field)}</div>
      ))}
    </div>
  );
};

export default ProductFields;
