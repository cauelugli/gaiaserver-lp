/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Dialog } from "@mui/material";

import AddClientForm from "../forms/add/AddClientForm";
import AddCustomerForm from "../forms/add/AddCustomerForm";
import AddJobForm from "../forms/add/AddJobForm";
import AddSaleForm from "../forms/add/AddSaleForm";

const ShortcutModals = ({
  action,
  onClose,
  fullWidth,
  maxWidth,
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
