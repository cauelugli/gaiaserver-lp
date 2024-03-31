/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Dialog } from "@mui/material";

import AddClientForm from "../forms/add/AddClientForm";
import AddCustomerForm from "../forms/add/AddCustomerForm";
import AddJobForm from "../forms/add/AddJobForm";
import AddSaleForm from "../forms/add/AddSaleForm";
import AddUserForm from "../forms/add/AddUserForm";
import AddManagerForm from "../forms/add/AddManagerForm";
import AddDepartmentForm from "../forms/add/AddDepartmentForm";

const ShortcutModals = ({
  action,
  onClose,
  fullWidth,
  maxWidth,
  configData,
  users,
  managers,
  departments,
  positions,
  configNotificationsBooleans,
  configCustomization,
  ...props
}) => {
  const ACTION_COMPONENTS = {
    addClient: (
      <AddClientForm
        {...props}
        setOpenAdd={onClose}
        fromShortcut
        extraSmall
        configCustomization={configCustomization}
      />
    ),
    addCustomer: (
      <AddCustomerForm
        {...props}
        setOpenAdd={onClose}
        fromShortcut
        configCustomization={configCustomization}
      />
    ),
    addJob: <AddJobForm {...props} setOpenAddJob={onClose} addFromShortcut />,
    addJobToCustomer: (
      <AddJobForm {...props} setOpenAddJob={onClose} fromShortcut />
    ),
    addSale: (
      <AddSaleForm {...props} setOpenAddSale={onClose} addFromShortcut />
    ),
    addSaleToCustomer: (
      <AddSaleForm {...props} setOpenAddSale={onClose} fromShortcut />
    ),
    addUser: (
      <AddUserForm
        {...props}
        configNotificationsBooleans={configNotificationsBooleans}
        departments={departments}
        positions={positions}
        setOpenAdd={onClose}
        configCustomization={configCustomization}
        addFromShortcut
      />
    ),
    addManager: (
      <AddManagerForm
        {...props}
        setOpenAdd={onClose}
        configCustomization={configCustomization}
        addFromShortcut
      />
    ),
    addDepartment: (
      <AddDepartmentForm
        {...props}
        setOpenAdd={onClose}
        configData={configData}
        users={users}
        managers={managers}
        configCustomization={configCustomization}
        addFromShortcut
      />
    ),
  };

  const SelectedComponent = ACTION_COMPONENTS[action] || null;

  return (
    <Dialog
      open={Boolean(action)}
      onClose={onClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
    >
      {SelectedComponent}
    </Dialog>
  );
};

export default ShortcutModals;
