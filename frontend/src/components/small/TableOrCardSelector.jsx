/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import { Grid2, Typography } from "@mui/material";

import { icons } from "../../icons";

import MultipleSelectorButton from "./buttons/MultipleSelectorButton";
import HighlightSelfUserButton from "./buttons/HighlightSelfUserButton";
import HighlightArchivedButton from "./buttons/HighlightArchivedButton";
import HighlightResolvedButton from "./buttons/HighlightResolvedButton";

const TableOrCardSelector = (props) => {
  const [tableOrCardView, setTableOrCardView] = React.useState(
    props.tableOrCard
  );

  React.useEffect(() => {
    setTableOrCardView(props.tableOrCard);
  }, [props.tableOrCard]);

  const handleUpdateTableOrCardView = async (newTableOrCardView) => {
    try {
      const response = await api.put("/userPreferences/tableOrCardView", {
        userId: props.userId,
        tableOrCardView: newTableOrCardView,
      });

      if (response.data && response.data.tableOrCardView !== undefined) {
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
    try {
      const response = await api.put("/userPreferences/cardSize", {
        userId: props.userId,
        cardSize: newCardSize,
      });

      if (response.data && response.data.cardSize !== undefined) {
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

  const validPages = ["requests", "finance", "stock"];

  return (
    <Grid2
      container
      direction="row"
      justifyContent="flex-end"
      alignItems="flex-end"
      sx={{ m: 0.75 }}
    >
      {validPages.includes(props.page) && (
        <HighlightSelfUserButton
          mainColor={props.mainColor}
          highlightSelfUser={props.highlightSelfUser}
          setHighlightSelfUser={props.setHighlightSelfUser}
        />
      )}
      {validPages.includes(props.page) && (
        <HighlightResolvedButton
          mainColor={props.mainColor}
          highlightResolved={props.highlightResolved}
          setHighlightResolved={props.setHighlightResolved}
        />
      )}
      {props.useArchiveList && (
        <HighlightArchivedButton
          mainColor={props.mainColor}
          highlightArchived={props.highlightArchived}
          setHighlightArchived={props.setHighlightArchived}
        />
      )}
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

      <Grid2 item>
        {!tableOrCardView && (
          <Grid2 container direction="row" sx={{ mr: 3 }}>
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
          </Grid2>
        )}
      </Grid2>
      <Grid2>
        <icons.AppsIcon
          sx={{
            mr: 1,
            cursor: "pointer",
            color: !tableOrCardView ? props.mainColor : "gray",
          }}
          onClick={() => handleUpdateTableOrCardView(false)}
        />
      </Grid2>
      <Grid2>
        <icons.TableRowsIcon
          sx={{
            cursor: "pointer",
            color: tableOrCardView ? props.mainColor : "gray",
          }}
          onClick={() => handleUpdateTableOrCardView(true)}
        />
      </Grid2>
    </Grid2>
  );
};

export default TableOrCardSelector;
