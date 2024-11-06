/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";

import {
  Grid,
  Table,
  TableRow,
  TableCell,
  Typography,
  TextField,
  Checkbox,
} from "@mui/material";

import StringTableCell from "../components/tableCells/StringTableCell";
import IdDocTableCell from "../components/tableCells/IdDocTableCell";
import PhoneTableCell from "../components/tableCells/PhoneTableCell";
import CurrencyTableCell from "../components/tableCells/CurrencyTableCell";
import SelectTableCell from "../components/tableCells/SelectTableCell";
import DateTableCell from "../components/tableCells/DateTableCell";
import DynamicDataTableCell from "../components/tableCells/DynamicDataTableCell";
import ManagerSelectTableCell from "../components/tableCells/ManagerSelectTableCell";
import ProductsTableCell from "../components/tableCells/ProductsTableCell";
import ServicesTableCell from "../components/tableCells/ServicesTableCell";
import ColorPicker from "../components/small/ColorPicker";

const TableCellOptions = ({
  field,
  fields,
  handleChange,
  modalOptions,
  setFields,
  handleProductChange,
  handleServiceChange,
  selectedProducts,
  selectedServices,
  priceDifference,
  setPriceDifference,
  setFinalPrice,
  setOkToDispatch,
}) => {
  return (
    <>
      {field.type === "string" && (
        <StringTableCell
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
        />
      )}
      {field.type === "idDoc" && (
        <IdDocTableCell
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
        />
      )}
      {field.type === "phone" && (
        <PhoneTableCell
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
        />
      )}
      {field.type === "currency" && (
        <CurrencyTableCell
          fields={fields}
          field={field}
          setFields={setFields}
          modalOptions={modalOptions}
          required={field.required}
        />
      )}
      {field.type === "password" && (
        <StringTableCell
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
          isPassword
        />
      )}
      {field.type === "fullWidth" && (
        <StringTableCell
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
          isFullWidth
        />
      )}
      {field.type === "select" && (
        <SelectTableCell
          fields={fields}
          field={field}
          menuOptions={field.options}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
          isFullWidth
        />
      )}
      {field.type === "multipleSelect" && (
        <SelectTableCell
          fields={fields}
          field={field}
          menuOptions={field.options}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
          multiple
        />
      )}
      {field.type === "date" && (
        <DateTableCell
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
        />
      )}
      {field.type === "dynamicData" && (
        <DynamicDataTableCell
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
          multiple={field.multiple}
        />
      )}
      {field.type === "managerSelect" && (
        <ManagerSelectTableCell
          oldManager={fields["manager"]}
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
          multiple={field.multiple}
        />
      )}
      {field.type === "productList" && (
        <Grid direction="column" alignItems="center" justifyContent="center">
          <ProductsTableCell
            selectedProducts={
              fields[field.name]?.selectedProducts || fields[field.name] || []
            }
            onChange={handleChange(field.name)}
            size="small"
            required={field.required}
            handleProductChange={handleProductChange}
          />
          {selectedProducts.length !== 0 && (
            <Grid
              sx={{
                m: 2,
                mt: 4,
                border: "1px solid #ccc",
                borderRadius: 4,
              }}
            >
              <Table size="small">
                <TableRow>
                  <TableCell>
                    <Typography sx={{ fontWeight: "bold", fontSize: 14 }}>
                      Nome
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography sx={{ fontWeight: "bold", fontSize: 14 }}>
                      Quantidade
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography sx={{ fontWeight: "bold", fontSize: 14 }}>
                      Valor por Item
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography sx={{ fontWeight: "bold", fontSize: 14 }}>
                      Total
                    </Typography>
                  </TableCell>
                </TableRow>
                {selectedProducts.map((product, index) => (
                  <TableRow key={index} sx={{ mt: 3 }}>
                    <TableCell>
                      <Typography sx={{ fontSize: 14 }}>
                        {product.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontSize: 14 }}>
                        {product.count}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontSize: 14 }}>
                        R$
                        {field.type === "productList"
                          ? product.sellValue
                          : product.buyValue.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontSize: 14 }}>
                        R$
                        {(field.type === "productList"
                          ? product.sellValue * product.count
                          : product.buyValue * product.count
                        ).toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
                {selectedProducts.length > 1 && (
                  <TableRow sx={{ mt: 3 }}>
                    <TableCell colSpan={3} />
                    <TableCell align="right">
                      <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                        R$
                        {selectedProducts
                          .reduce(
                            (sum, product) =>
                              sum + product.sellValue * product.count,
                            0
                          )
                          .toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </Table>
            </Grid>
          )}
        </Grid>
      )}
      {field.type === "servicesList" && (
        <ServicesTableCell
          value={fields[field.name] || ""}
          onChange={handleChange(field.name)}
          size="small"
          required={field.required}
          handleServiceChange={handleServiceChange}
          selectedServices={selectedServices}
          priceDifference={priceDifference}
          setPriceDifference={setPriceDifference}
          setFinalPrice={setFinalPrice}
          setOkToDispatch={setOkToDispatch}
        />
      )}
      {field.type === "list" && (
        <TextField
          value={fields[field.name] || ""}
          onChange={handleChange(field.name)}
          sx={{ width: "336%" }}
          size="small"
          required={field.required}
        />
      )}
      {field.type === "checkbox" && (
        <Checkbox
          value={fields[field.name] || ""}
          onChange={handleChange(field.name)}
          size="small"
          required={field.required}
        />
      )}
      {field.type === "color" && (
        <ColorPicker
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
        />
      )}
    </>
  );
};

export default TableCellOptions;
