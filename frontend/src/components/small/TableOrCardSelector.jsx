/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import { Grid } from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import TableRowsIcon from "@mui/icons-material/TableRows";

const TableOrCardSelector = ({
  userId,
  refreshData,
  setRefreshData,
  tableOrCard,
  setUserPreferences,
}) => {
  const [tableOrCardView, setTableOrCardView] = React.useState(tableOrCard);

  React.useEffect(() => {
    setTableOrCardView(tableOrCard);
  }, [tableOrCard]);

  const handleUpdateTableOrCardView = async (newTableOrCardView) => {
    const existingPreferences =
      JSON.parse(sessionStorage.getItem("userPreferences")) || {};
    const updatedPreferences = {
      ...existingPreferences,
      tableOrCardView: newTableOrCardView,
    };

    try {
      const response = await api.put("/userPreferences/tableOrCardView", {
        userId: userId,
        tableOrCardView: newTableOrCardView,
      });

      if (response.data && response.data.tableOrCardView !== undefined) {
        sessionStorage.setItem(
          "userPreferences",
          JSON.stringify(updatedPreferences)
        );
        setRefreshData(!refreshData);
        setUserPreferences((prev) => ({
          ...prev,
          tableOrCardView: newTableOrCardView,
        }));
      } else {
        toast.error("Não foi possível atualizar as preferências.", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
    } catch (err) {
      toast.error("Houve algum erro na atualização das preferências.", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
      console.log(err);
    }
  };

  return (
    <Grid container direction="row">
      <AppsIcon
        sx={{ mr: 2, cursor: "pointer" }}
        color={!tableOrCardView ? "primary" : "inherit"}
        onClick={() => handleUpdateTableOrCardView(false)}
      />
      <TableRowsIcon
        sx={{ cursor: "pointer" }}
        color={tableOrCardView ? "primary" : "inherit"}
        onClick={() => handleUpdateTableOrCardView(true)}
      />
    </Grid>
  );
};

export default TableOrCardSelector;
