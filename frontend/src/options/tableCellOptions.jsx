/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";

import { Checkbox, InputLabel, TextField } from "@mui/material";

import ColorPicker from "../components/small/ColorPicker";
import CurrencyTableCell from "../components/tableCells/CurrencyTableCell";
import DateTableCell from "../components/tableCells/DateTableCell";
import DynamicDataTableCell from "../components/tableCells/DynamicDataTableCell";
import IdDocTableCell from "../components/tableCells/IdDocTableCell";
import PhoneTableCell from "../components/tableCells/PhoneTableCell";
import ProductsTableCell from "../components/tableCells/ProductsTableCell";
import ManagerSelectTableCell from "../components/tableCells/ManagerSelectTableCell";
import MembersTableCell from "../components/tableCells/MembersTableCell";
import SelectTableCell from "../components/tableCells/SelectTableCell";
import StringTableCell from "../components/tableCells/StringTableCell";
import AllCustomersTableCell from "../components/tableCells/AllCustomersTableCell";
import UsersTableCell from "../components/tableCells/UsersTableCell ";
import ServiceListTableCell from "../components/tableCells/ServiceListTableCell";
import ServicesTableCell from "../components/tableCells/ServicesTableCell";
import DepartmentTypeTableCell from "../components/tableCells/DepartmentTypeTableCell";
import DepartmentsTableCell from "../components/tableCells/DepartmentsTableCell";

const TableCellOptions = ({
  field,
  fields,
  handleChange,
  modalOptions,
  setFields,
  handleMemberChange,
  handleProductChange,
  handleServiceChange,
  selectedMembers,
  selectedServices,
  color,
  priceDifference,
  setPriceDifference,
  setFinalPrice,
  setOkToDispatch,
  serviceLength,
  refreshData,
  setRefreshData,
  targetId,
  tabIndex,
}) => {
  // this is used in EditForm
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
      {field.type === "allCustomers" && (
        <AllCustomersTableCell
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
        />
      )}
      {field.type === "services" && (
        <ServicesTableCell
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

      {field.type === "departmentType" && (
        <DepartmentTypeTableCell
          fields={fields}
          field={field}
          menuOptions={field.options}
          handleChange={handleChange}
          // modalOptions={modalOptions}
          // required={field.required}
          // isFullWidth
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
      {field.type === "members" && (
        <MembersTableCell
          fields={fields}
          field={field}
          selectedMembers={selectedMembers}
          modalOptions={modalOptions}
          handleMemberChange={handleMemberChange}
          isEditing={true}
          targetId={targetId}
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
          serviceLength={serviceLength}
        />
      )}
      {field.type === "department" && (
        <DepartmentsTableCell
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
          multiple={field.multiple}
          managerRestriction={
            modalOptions.label === "Colaborador" && tabIndex === 1
              ? true
              : false
          }
        />
      )}
      {field.type === "users" && (
        <UsersTableCell
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
          multiple={field.multiple}
          serviceLength={serviceLength}
        />
      )}
      {field.type === "managerSelect" && (
        <ManagerSelectTableCell
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
          multiple={field.multiple}
          fromConfig={false}
          targetId={targetId}
        />
      )}
      {field.type === "productList" && (
        <ProductsTableCell
          selectedProducts={
            fields[field.name]?.selectedProducts || fields[field.name] || []
          }
          refreshData={refreshData}
          setRefreshData={setRefreshData}
          required={field.required}
          handleProductChange={handleProductChange}
          toStock={modalOptions.name === "AddStockEntry"}
        />
      )}
      {field.type === "servicesList" && (
        <ServiceListTableCell
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
        <>
          <InputLabel>{field.label}</InputLabel>
          <Checkbox
            checked={fields[field.name] || false}
            onChange={() =>
              setFields({
                ...fields,
                [field.name]: !fields[field.name],
              })
            }
            size="small"
            required={field.required}
          />
        </>
      )}
      {field.type === "color" && (
        <ColorPicker
          prevColor={color}
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
