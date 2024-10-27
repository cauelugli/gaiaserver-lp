/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Grid, Chip, Paper, TextField, Popper } from "@mui/material";
import TableFilterDialog from "./TableFilterDialog";

function TableFiltersBar({
  tableColumns,
  mainColor,
  tableFilters,
  setTableFilters,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openFilter, setOpenFilter] = useState(null);
  const [filterValue, setFilterValue] = useState("");

  const handleOpenFilter = (event, column) => {
    setAnchorEl(event.currentTarget);
    setOpenFilter(column);
    setFilterValue(tableFilters[column.id] || "");
  };

  const handleApplyFilter = () => {
    setTableFilters((prevFilters) => ({
      ...prevFilters,
      [openFilter.id]: filterValue,
    }));
    setOpenFilter(null);
    setAnchorEl(null);
    setFilterValue("");
  };

  const handleClose = () => {
    setOpenFilter(null);
    setAnchorEl(null);
    setFilterValue("");
  };

  const availableColumns = tableColumns.filter(
    (column) => !(column.id in tableFilters && tableFilters[column.id])
  );

  const mappedDataTypes = {
    buyValue: { type: "number", data: "currency" },
    cellphone: { type: "phone", data: "cellphone" },
    createdAt: { type: "date", data: "simple" },

    customer: { type: "dynamic", data: "customer", model: "Customer" },

    department: { type: "dynamic", data: "department", model: "Department" },
    email: { type: "string", data: "simple" },
    mainContactName: { type: "string", data: "simple" },
    manager: { type: "dynamic", data: "manager", model: "User" },
    members: { type: "dynamic", data: "members", model: "User" },
    name: { type: "string", data: "simple" },
    number: { type: "number", data: "index" },
    // payment: { type: "dynamic", data: "payment" },
    phone: { type: "phone", data: "phone" },
    position: { type: "dynamic", data: "position", model: "Position" },
    price: { type: "number", data: "currency" },
    products: { type: "dynamic", data: "products", model: "Product" },
    quote: { type: "dynamic", data: "quote", model: "Quote" },
    role: { type: "dynamic", data: "role", model: "Role" },
    scheduledTo: { type: "date", data: "simple" },
    sellValue: { type: "number", data: "currency" },
    service: { type: "dynamic", data: "service", model: "Service" },
    status: { type: "dynamic", data: "status", model: "Config" },
    stockQuantity: { type: "number", data: "stockQuantity" },
    title: { type: "string", data: "simple" },
    // type: { type: "string", data: "serviceType" },
    user: { type: "dynamic", data: "user", model: "User" },
    username: { type: "dynamic", data: "username", model: "User" },
    value: { type: "number", data: "currency" },
    worker: { type: "dynamic", data: "worker", model: "User" },
  };

  return (
    <Grid
      container
      spacing={1}
      alignItems="center"
      justifyContent="flex-start"
      sx={{ width: "auto" }}
    >
      {availableColumns.map(
        (column, index) =>
          index !== 0 && (
            <Grid item key={index} sx={{ cursor: "pointer" }}>
              <Chip
                label={column.label}
                size="small"
                variant="contained"
                onClick={(event) => handleOpenFilter(event, column)}
                sx={{
                  background: mainColor,
                  "&:hover": {
                    backgroundColor: "lightgrey",
                  },
                }}
              />
              <Popper
                open={openFilter && openFilter.id === column.id}
                anchorEl={anchorEl}
                placement="bottom-start"
                disablePortal={false}
              >
                <TableFilterDialog
                  columnLabel={column.label}
                  filterValue={filterValue}
                  setFilterValue={setFilterValue}
                  handleApplyFilter={handleApplyFilter}
                  handleClose={handleClose}
                  dialogData={mappedDataTypes[column.id]}
                />
              </Popper>
            </Grid>
          )
      )}
    </Grid>
  );
}

export default TableFiltersBar;
