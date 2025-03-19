/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import {
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

const ProductFields = ({ productFields, handleChange, fields }) => {
  const renderValue = (field, fields) => {
    switch (field.type) {
      case "number":
        return fields[field.name] || field.value || "";
      case "string":
        return fields[field.name] || field.value || "";
      case "options":
        return fields[field.name] || field.value || "";
      case "currency":
        return fields[field.name] || field.value || "";
      case "date":
        return fields[field.name] || field.value || "";
      default:
        return "";
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case "string":
        return (
          <Grid2>
            <InputLabel>{field.name}</InputLabel>
            <TextField
              size="small"
              label={field.name}
              value={renderValue(field, fields)}
              onChange={handleChange(field.name)}
              sx={{ width: 200 }}
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
              value={renderValue(field, fields)}
              onChange={handleChange(field.name)}
              slotProps={{
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
                value={renderValue(field, fields)}
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
        return;
      // return formatCurrency(fields[field.name] || field.value || "");
      case "date":
        return;
      // return formatDate(fields[field.name] || field.value || "");
      default:
        return null;
    }
  };

  return (
    <Grid2 container sx={{ mt: -2 }}>
      {productFields.map((field, index) => (
        <Grid2 key={index} sx={{ mr: 1 }}>
          {renderField(field)}
        </Grid2>
      ))}
    </Grid2>
  );
};

export default ProductFields;
