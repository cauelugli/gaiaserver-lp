/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import { Grid } from "@mui/material";

import BadgedIcon from "../BadgedIcon";

const ProductsTableCell = (props) => {
  const [options, setOptions] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/products");
        setOptions(response.data.filter((item) => item.name));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="space-evenly"
    >
      {options.map((option, index) => (
        <Grid item key={index}>
          <BadgedIcon
            item={option}
            handleProductChange={props.handleProductChange}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductsTableCell;
