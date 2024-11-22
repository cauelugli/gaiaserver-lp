/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Grid, Paper } from "@mui/material";

import {
  optionsMainblocks,
  optionsRightColumn,
} from "../../options/homeOptions";

const HomeBlock = ({ userUsername, allowedLinks, configData }) => {
  const uniqueAllowedLinks = [...new Set(allowedLinks)];

  const allowedListMainblocks = uniqueAllowedLinks.filter((link) =>
    [
      "customers",
      "users",
      "departments",
      "requests",
      "products",
      "stock",
      "services",
      "finance",
    ].includes(link)
  );

  const allowedListRightColumn = uniqueAllowedLinks.filter((link) =>
    ["quotes", "files", "security", "dashboard", "reports", "config"].includes(
      link
    )
  );

  React.useEffect(() => {}, [configData]);

  const [hoveredIndexMainblocks, setHoveredIndexMainblocks] = useState(null);
  const [hoveredIndexRightColumn, setHoveredIndexRightColumn] = useState(null);

  return (
    <Grid
      container
      direction="row"
      justifyContent={
        allowedListRightColumn.length === 0 ? "center" : "space-between"
      }
    >
      <Grid
        item
        id="mainBlock"
        sx={{
          width: allowedListMainblocks.length <= 4 ? "70%" : "80%",
        }}
      >
        <Grid
          container
          direction="row"
          sx={{ mt: -1, ml: allowedListMainblocks.length <= 4 ? 15 : "" }}
        >
          {optionsMainblocks.map((option, index) => {
            if (allowedListMainblocks.includes(option.permissionLabel)) {
              return (
                <Grid
                  item
                  key={index}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={allowedListMainblocks.length <= 4 ? 10 : 6}
                  xl={2}
                  sx={{ p: 1 }}
                >
                  <Link to={option.link} style={{ textDecoration: "none" }}>
                    <Paper
                      onMouseEnter={() => setHoveredIndexMainblocks(index)}
                      onMouseLeave={() => setHoveredIndexMainblocks(null)}
                      sx={{
                        height: 110,
                        width: "100%",
                        transition: "background-color 0.3s, color 0.3s",
                        backgroundColor:
                          hoveredIndexMainblocks === index &&
                          configData &&
                          configData.customization
                            ? configData.customization.mainColor
                            : "white",
                        color:
                          hoveredIndexMainblocks === index ? "white" : "#777",
                      }}
                    >
                      <Grid
                        container
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                          height: "100%",
                          cursor: "pointer",
                        }}
                      >
                        {option.icon}
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: "bold",
                            fontFamily: "Verdana, sans-serif",
                          }}
                        >
                          {option.text}
                        </span>
                      </Grid>
                    </Paper>
                  </Link>
                </Grid>
              );
            } else {
              return null;
            }
          })}
        </Grid>
      </Grid>
      <Grid
        item
        id="rightColumn"
        sx={{ mr: allowedListMainblocks.length <= 4 ? 6 : "" }}
      >
        {optionsRightColumn.map((option, index) => {
          if (allowedListRightColumn.includes(option.permissionLabel)) {
            return (
              <Grid item key={index} sx={{ mb: 4 }}>
                <Link
                  to={option.link}
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <Paper
                    onMouseEnter={() => setHoveredIndexRightColumn(index)}
                    onMouseLeave={() => setHoveredIndexRightColumn(null)}
                    sx={{
                      width: 180,
                      py: 1.5,
                      mx: 1,
                      transition: "background-color 0.3s, color 0.3s",
                      backgroundColor:
                        hoveredIndexRightColumn === index
                          ? "white"
                          : configData && configData.customization
                          ? configData.customization.mainColor
                          : "white",
                      color:
                        hoveredIndexRightColumn === index ? "#777" : "white",
                    }}
                  >
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        cursor: "pointer",
                      }}
                    >
                      {option.icon}
                      <span
                        style={{
                          marginLeft: 10,
                          fontSize: 14,
                          fontWeight: "bold",
                          fontFamily: "Verdana, sans-serif",
                        }}
                      >
                        {option.text}
                      </span>
                    </Grid>
                  </Paper>
                </Link>
              </Grid>
            );
          }
        })}
      </Grid>
    </Grid>
  );
};

export default HomeBlock;
