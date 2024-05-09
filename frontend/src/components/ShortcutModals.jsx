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
  configNotifications,
  configNotificationsBooleans,
  configCustomization,
  user,
  ...props
}) => {
  const ACTION_COMPONENTS = {
    addClient: (
      <AddClientForm
        {...props}
        userId={user._id}
        setOpenAdd={onClose}
        fromShortcut
        extraSmall
        configCustomization={configCustomization}
      />
    ),
    addCustomer: (
      <AddCustomerForm
        {...props}
        userId={user._id}
        setOpenAdd={onClose}
        fromShortcut
        configCustomization={configCustomization}
      />
    ),
    addJob: (
      <AddJobForm
        {...props}
        userId={user._id}
        setOpenAddJob={onClose}
        configNotifications={configNotifications}
        configNotificationsBooleans={configNotificationsBooleans}
        addFromShortcut
      />
    ),
    addJobToCustomer: (
      <AddJobForm
        {...props}
        userId={user._id}
        setOpenAddJob={onClose}
        configNotifications={configNotifications}
        configNotificationsBooleans={configNotificationsBooleans}
        fromShortcut
      />
    ),
    addSale: (
      <AddSaleForm
        {...props}
        userId={user._id}
        setOpenAddSale={onClose}
        configNotifications={configNotifications}
        configNotificationsBooleans={configNotificationsBooleans}
        addFromShortcut
      />
    ),
    addSaleToCustomer: (
      <AddSaleForm
        {...props}
        userId={user._id}
        setOpenAddSale={onClose}
        configNotifications={configNotifications}
        configNotificationsBooleans={configNotificationsBooleans}
        fromShortcut
      />
    ),
    addUser: (
      <AddUserForm
        {...props}
        userId={user._id}
        departments={departments}
        positions={positions}
        setOpenAdd={onClose}
        configCustomization={configCustomization}
        configNotifications={configNotifications}
        configNotificationsBooleans={configNotificationsBooleans}
        addFromShortcut
      />
    ),
    addManager: (
      <AddManagerForm
        {...props}
        userId={user._id}
        setOpenAdd={onClose}
        configCustomization={configCustomization}
        addFromShortcut
      />
    ),
    addDepartment: (
      <AddDepartmentForm
        {...props}
        userId={user._id}
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
