/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import { Grid, Typography } from "@mui/material";

import { icons } from "../../icons";

import MultipleSelectorButton from "./buttons/MultipleSelectorButton";

const TableOrCardSelector = (props) => {
  const [tableOrCardView, setTableOrCardView] = React.useState(props.tableOrCard);

  React.useEffect(() => {
    setTableOrCardView(props.tableOrCard);
  }, [props.tableOrCard]);

  const handleUpdateTableOrCardView = async (newTableOrCardView) => {
    const existingPreferences =
      JSON.parse(sessionStorage.getItem("userPreferences")) || {};
    const updatedPreferences = {
      ...existingPreferences,
      tableOrCardView: newTableOrCardView,
    };

    try {
      const response = await api.put("/userPreferences/tableOrCardView", {
        userId: props.userId,
        tableOrCardView: newTableOrCardView,
      });

      if (response.data && response.data.tableOrCardView !== undefined) {
        sessionStorage.setItem(
          "userPreferences",
          JSON.stringify(updatedPreferences)
        );
        props.setRefreshData(!props.refreshData);
        props.setUserPreferences((prev) => ({
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
        userId: props.userId,
        cardSize: newCardSize,
      });

      if (response.data && response.data.cardSize !== undefined) {
        sessionStorage.setItem(
          "userPreferences",
          JSON.stringify(updatedPreferences)
        );
        props.setRefreshData(!props.refreshData);
        props.setUserPreferences((prev) => ({
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
      <MultipleSelectorButton
        mainColor={props.mainColor}
        multiple={props.multiple}
        setMultiple={props.setMultiple}
        selectedMultipleItems={props.selectedMultipleItems}
        setSelectedMultipleItems={props.setSelectedMultipleItems}
        userId={props.userId}
        model={props.model}
        page={props.page}
        refreshData={props.refreshData}
        setRefreshData={props.setRefreshData}
      />

      <Grid item>
        {!tableOrCardView && (
          <Grid container direction="row" sx={{ mr: 3 }}>
            {props.cardSize !== 12 && (
              <Typography
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: 18,
                  mr: 2,
                }}
                onClick={() => {
                  const newSize = (props.cardSize || 0) + 1;
                  handleUpdateCardSize(newSize);
                }}
              >
                +
              </Typography>
            )}
            {props.cardSize !== 2 && (
              <Typography
                sx={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: 18,
                }}
                onClick={() => {
                  const newSize = (props.cardSize || 0) - 1;
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
        <icons.AppsIcon
          sx={{
            mr: 1,
            cursor: "pointer",
            color: !tableOrCardView ? props.mainColor : "gray",
          }}
          onClick={() => handleUpdateTableOrCardView(false)}
        />
      </Grid>
      <Grid>
        <icons.TableRowsIcon
          sx={{
            cursor: "pointer",
            color: tableOrCardView ? props.mainColor : "gray",
          }}
          onClick={() => handleUpdateTableOrCardView(true)}
        />
      </Grid>
    </Grid>
  );
};

export default TableOrCardSelector;
