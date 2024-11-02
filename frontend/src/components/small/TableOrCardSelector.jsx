/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import { Grid, Typography } from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import TableRowsIcon from "@mui/icons-material/TableRows";

const TableOrCardSelector = ({
  userId,
  refreshData,
  setRefreshData,
  tableOrCard,
  setUserPreferences,
  cardSize,
  mainColor,
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

  const handleUpdateCardSize = async (newCardSize) => {
    const existingPreferences =
      JSON.parse(sessionStorage.getItem("userPreferences")) || {};
    const updatedPreferences = {
      ...existingPreferences,
      cardSize: newCardSize,
    };

    try {
      const response = await api.put("/userPreferences/cardSize", {
        userId: userId,
        cardSize: newCardSize,
      });

      if (response.data && response.data.cardSize !== undefined) {
        sessionStorage.setItem(
          "userPreferences",
          JSON.stringify(updatedPreferences)
        );
        setRefreshData(!refreshData);
        setUserPreferences((prev) => ({
          ...prev,
          cardSize: newCardSize,
        }));
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
    <Grid
      container
      direction="row"
      justifyContent="flex-end"
      alignItems="flex-end"
    >
      <Grid item>
        {!tableOrCardView && (
          <Grid container direction="row" sx={{ mr: 3 }}>
            {cardSize !== 12 && (
              <Typography
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: 18,
                  mr: 2,
                }}
                onClick={() => {
                  const newSize = (cardSize || 0) + 1;
                  handleUpdateCardSize(newSize);
                }}
              >
                +
              </Typography>
            )}
            {cardSize !== 2 && (
              <Typography
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: 18,
                }}
                onClick={() => {
                  const newSize = (cardSize || 0) - 1;
                  handleUpdateCardSize(newSize);
                }}
              >
                -
              </Typography>
            )}
          </Grid>
        )}
      </Grid>
      <Grid>
        <AppsIcon
          sx={{
            mr: 1,
            cursor: "pointer",
            color: !tableOrCardView ? mainColor : "gray",
          }}
          onClick={() => handleUpdateTableOrCardView(false)}
        />
      </Grid>
      <Grid>
        <TableRowsIcon
          sx={{
            cursor: "pointer",
            color: tableOrCardView ? mainColor : "gray",
          }}
          onClick={() => handleUpdateTableOrCardView(true)}
        />
      </Grid>
    </Grid>
  );
};

export default TableOrCardSelector;
