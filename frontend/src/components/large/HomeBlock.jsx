/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Grid, Paper } from "@mui/material";

import { optionsMainblocks } from "../../options/homeOptions";

const HomeBlock = ({ currentWindowSize, allowedLinks, configData }) => {
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
      "quotes",
      "security",
      "dashboard",
      "reports",
    ].includes(link)
  );

  React.useEffect(() => {}, [configData]);

  const [hoveredIndexMainblocks, setHoveredIndexMainblocks] = useState(null);

  const factor =
    {
      nano: 0.5,
      xs: 1,
      sm: 2,
      md1: 2.5,
      md2: 2.75,
      lg1: 3.5,
      lg2: 3.75,
      xl: 4.25,
    }[currentWindowSize] || 0;

  return (
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
              lg={3}
              xl={4}
              sx={{ p: 1 }}
            >
              <Link to={option.link} style={{ textDecoration: "none" }}>
                <Paper
                  onMouseEnter={() => setHoveredIndexMainblocks(index)}
                  onMouseLeave={() => setHoveredIndexMainblocks(null)}
                  sx={{
                    height: 40 * factor,
                    transition: "background-color 0.3s, color 0.3s",
                    backgroundColor:
                      hoveredIndexMainblocks === index &&
                      configData &&
                      configData.customization
                        ? configData.customization.mainColor
                        : "white",
                    color: hoveredIndexMainblocks === index ? "white" : "#777",
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
                        marginTop: factor * 2,
                        width: "auto",
                        fontSize: 14 + (factor + factor / 2),
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
  );
};

export default HomeBlock;
