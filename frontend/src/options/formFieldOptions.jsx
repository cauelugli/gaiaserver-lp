// eslint-disable-next-line no-unused-vars
import React from "react";

import { Checkbox, InputLabel } from "@mui/material";

import AllCustomersTableCell from "../components/tableCells/AllCustomersTableCell";
import AttachmentsTableCell from "../components/tableCells/AttachmentsTableCell";
import ColorPicker from "../components/small/ColorPicker";
import CurrencyTableCell from "../components/tableCells/CurrencyTableCell";
import DateTableCell from "../components/tableCells/DateTableCell";
import DynamicDataTableCell from "../components/tableCells/DynamicDataTableCell";
import IdDocTableCell from "../components/tableCells/IdDocTableCell";
import PhoneTableCell from "../components/tableCells/PhoneTableCell";
import ProductsTableCell from "../components/tableCells/ProductsTableCell";
import SelectTableCell from "../components/tableCells/SelectTableCell";
import ServicesTableCell from "../components/tableCells/ServicesTableCell";
import StringTableCell from "../components/tableCells/StringTableCell";
import ServiceListTableCell from "../components/tableCells/ServiceListTableCell";

// this is used in AddForm

export const renderField = (
  field,
  fields,
  handleChange,
  modalOptions,
  handlers,
  okToDispatch,
  selectedProducts,
  selectedServices,
  refreshData,
  setRefreshData
) => {
  switch (field.type) {
    case "string":
      return (
        <StringTableCell
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
        />
      );
    case "idDoc":
      return (
        <IdDocTableCell
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
        />
      );
    case "phone":
      return (
        <PhoneTableCell
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
        />
      );
    case "currency":
      return (
        <CurrencyTableCell
          fields={fields}
          field={field}
          setFields={handlers.setFields}
          modalOptions={modalOptions}
          required={field.required}
        />
      );
    case "password":
    case "fullWidth":
      return (
        <StringTableCell
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
          isPassword={field.type === "password"}
          isFullWidth={field.type === "fullWidth"}
        />
      );
    case "select":
    case "multipleSelect":
      return (
        <SelectTableCell
          fields={fields}
          field={field}
          menuOptions={field.options}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
          isFullWidth={field.type === "select"}
          multiple={field.type === "multipleSelect"}
        />
      );
    case "date":
      return (
        <DateTableCell
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
        />
      );
    case "dynamicData":
      return (
        <DynamicDataTableCell
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
          multiple={field.multiple}
        />
      );

    case "allCustomers":
      return (
        <AllCustomersTableCell
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
          multiple={field.multiple}
        />
      );
    case "services":
      return (
        <ServicesTableCell
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
          multiple={field.multiple}
        />
      );
    case "productList":
      return (
        <ProductsTableCell
          selectedProducts={selectedProducts}
          handleProductChange={handlers.handleProductChange}
          value={fields[field.name] || ""}
          onChange={handleChange(field.name)}
          refreshData={refreshData}
          setRefreshData={setRefreshData}
          finalPrice={handlers.finalPrice}
          setFinalPrice={handlers.setFinalPrice}
          priceDifference={handlers.priceDifference}
          setPriceDifference={handlers.setPriceDifference}
          okToDispatch={okToDispatch}
          setOkToDispatch={handlers.setOkToDispatch}
          toStock={modalOptions.name === "AddStockEntry"}
        />
      );
    case "servicesList":
      return (
        <ServiceListTableCell
          value={fields[field.name] || ""}
          onChange={handleChange(field.name)}
          size="small"
          required={field.required}
          handleServiceChange={handlers.handleServiceChange}
          selectedServices={selectedServices}
          priceDifference={handlers.priceDifference}
          setPriceDifference={handlers.setPriceDifference}
          setFinalPrice={handlers.setFinalPrice}
          setOkToDispatch={handlers.setOkToDispatch}
        />
      );
    case "attachments":
      return (
        <AttachmentsTableCell
          attachments={handlers.attachments}
          onUpload={handlers.handleFileUpload}
          onRemove={handlers.handleFileRemove}
        />
      );
    case "checkbox":
      return (
        <>
          <InputLabel>{field.label}</InputLabel>
          <Checkbox
            value={fields[field.name] || ""}
            onChange={handlers.handleCheck}
            size="small"
            required={field.required}
          />
        </>
      );
    case "color":
      return (
        <>
          <ColorPicker
            fields={fields}
            field={field}
            handleChange={handleChange}
            modalOptions={modalOptions}
          />
        </>
      );
    default:
      return null;
  }
};
