/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Dialog } from "@mui/material";

const ShortcutModals = ({
  action,
  onClose,
  fullWidth,
  maxWidth,
  configData,
  configNotifications,
  configCustomization,
  user,
  ...props
}) => {
  const ACTION_COMPONENTS = {
    addClient: "",
    addCustomer: "",
    addJob: "",
    addJobToCustomer: "",
    addSale: "",
    addSaleToCustomer: "",
    addUser: "",
    addManager: "",
    addDepartment: "",
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
