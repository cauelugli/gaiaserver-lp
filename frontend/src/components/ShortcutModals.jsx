/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Dialog } from "@mui/material";

import AddJobForm from "../forms/add/AddJobForm";
import AddSaleForm from "../forms/add/AddSaleForm";

const ShortcutModals = ({ action, onClose, fullWidth, maxWidth, ...props }) => {
  const ACTION_COMPONENTS = {
    addJob: <AddJobForm {...props} setOpenAddJob={onClose} fromShortcut />,
    addSale: <AddSaleForm {...props} setOpenAddSale={onClose} fromShortcut />,
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
