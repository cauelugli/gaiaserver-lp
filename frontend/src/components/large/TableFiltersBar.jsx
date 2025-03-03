/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";

import { icons } from "../../icons";
import { Button } from "@mui/material";

const TableFiltersBar = (props) => {
  const [showFilter, setShowFilter] = React.useState(false);

  return (
    <>
      {showFilter ? (
        <icons.FilterAltOffIcon
          sx={{
            my: "auto",
            mr: 1,
            color: "lightgrey",
            cursor: "pointer",
            fontSize: 30,
          }}
          onClick={() => setShowFilter(!showFilter)}
        />
      ) : (
        <icons.FilterAltIcon
          sx={{
            my: "auto",
            mr: 1,
            color: "darkgrey",
            cursor: "pointer",
            fontSize: 30,
          }}
          onClick={() => setShowFilter(!showFilter)}
        />
      )}

      {showFilter && (
        <Button onClick={() => console.log("props", props)}>oi</Button>
      )}
    </>
  );
};

export default TableFiltersBar;
