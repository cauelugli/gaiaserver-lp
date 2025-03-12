/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";

import { icons } from "../../icons";

import { getTableFiltersOptions } from "../../options/tableFiltersOptions";

const TableFiltersBar = (props) => {
  const [showFilter, setShowFilter] = React.useState(false);
  const filterOptions = getTableFiltersOptions(props.page, props.tabIndex);

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

      {showFilter &&
        Object.entries(filterOptions).map(([key, values]) => (
          <div key={key}>
            <strong>{key}</strong>: {values.join(", ")}
          </div>
        ))}
    </>
  );
};

export default TableFiltersBar;
