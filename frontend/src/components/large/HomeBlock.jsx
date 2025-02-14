/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

import { optionsMainblocks } from "../../options/homeOptions";

const HomeBlock = ({ currentWindowSize, allowedLinks, configData, layout }) => {
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
      "security",
      "dashboard",
      "reports",
      "chat"
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
          if (layout === "Padrão" || layout === "Chip") {
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
                      height: (layout === "Chip" ? 25 : 40) * factor,
                      transition: "background-color 0.3s, color 0.3s",
                      backgroundColor:
                        hoveredIndexMainblocks === index &&
                        configData &&
                        configData.customization
                          ? configData.customization.mainColor
                          : "white",
                      color:
                        hoveredIndexMainblocks === index ? "white" : "#777",
                      borderRadius: layout === "Chip" ? 50 : 0,
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
                      <Typography
                        style={{
                          marginTop: factor * 2,
                          width: "auto",
                          fontSize: 14 + (factor + factor / 2),
                          fontWeight: "bold",
                        }}
                      >
                        {option.text}
                      </Typography>
                    </Grid>
                  </Paper>
                </Link>
              </Grid>
            );
          }

          if (layout === "Compacto") {
            return (
              <Grid
                item
                key={index}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{ p: 1 }}
              >
                <Link to={option.link} style={{ textDecoration: "none" }}>
                  <Paper
                    onMouseEnter={() => setHoveredIndexMainblocks(index)}
                    onMouseLeave={() => setHoveredIndexMainblocks(null)}
                    sx={{
                      height: 20 * factor,
                      width: 45 * factor,
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
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                      spacing={1}
                      sx={{
                        height: "100%",
                        cursor: "pointer",
                      }}
                    >
                      {React.cloneElement(option.icon, {
                        style: {
                          fontSize: "1.5vw",
                          
                        },
                      })}
                      <Typography
                        style={{
                          marginTop: factor,
                          width: "auto",
                          fontSize: 12 + factor,
                          fontWeight: "bold",
                        }}
                      >
                        {option.text}
                      </Typography>
                    </Grid>
                  </Paper>
                </Link>
              </Grid>
            );
          }

          if (layout === "Avatar") {
            return (
              <Grid
                item
                key={index}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                sx={{ p: 1 }}
              >
                <Paper
                  onMouseEnter={() => setHoveredIndexMainblocks(index)}
                  onMouseLeave={() => setHoveredIndexMainblocks(null)}
                  sx={{
                    height: 55 * factor,
                    width: 55 * factor,
                    transition: "background-color 0.3s, color 0.3s",
                    backgroundColor:
                      hoveredIndexMainblocks === index &&
                      configData &&
                      configData.customization
                        ? configData.customization.mainColor
                        : "white",
                    color: hoveredIndexMainblocks === index ? "white" : "#777",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Link to={option.link} style={{ textDecoration: "none" }}>
                    <Grid
                      container
                      direction="column"
                      alignItems="center"
                      sx={{
                        height: "100%",
                        cursor: "pointer",
                        backgroundColor:
                          hoveredIndexMainblocks === index &&
                          configData &&
                          configData.customization
                            ? configData.customization.mainColor
                            : "white",
                        color:
                          hoveredIndexMainblocks === index ? "white" : "#777",
                        transition: "background-color 0.3s, color 0.3s",
                      }}
                    >
                      {React.cloneElement(option.icon, {
                        style: { fontSize: "6vw" },
                      })}
                      <Typography
                        style={{
                          marginTop: factor,
                          width: "auto",
                          fontSize: 12 + factor,
                          fontWeight: "bold",
                        }}
                      >
                        {option.text}
                      </Typography>
                    </Grid>
                  </Link>
                </Paper>
              </Grid>
            );
          }

          if (layout === "Tabela") {
            return (
              <Grid
                item
                key={index}
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                sx={{ p: 0 }}
              >
                <TableContainer component={Paper}>
                  <Table>
                    <TableBody>
                      <TableRow
                        onMouseEnter={() => setHoveredIndexMainblocks(index)}
                        onMouseLeave={() => setHoveredIndexMainblocks(null)}
                        sx={{
                          backgroundColor:
                            hoveredIndexMainblocks === index &&
                            configData &&
                            configData.customization
                              ? configData.customization.mainColor
                              : "white",
                          color:
                            hoveredIndexMainblocks === index ? "white" : "#777",
                          cursor: "pointer",
                        }}
                      >
                        <TableCell align="left">
                          <Link
                            to={option.link}
                            style={{ textDecoration: "none", color: "inherit" }}
                          >
                            <Grid
                              container
                              sx={{
                                backgroundColor:
                                  hoveredIndexMainblocks === index &&
                                  configData &&
                                  configData.customization
                                    ? configData.customization.mainColor
                                    : "white",
                                color:
                                  hoveredIndexMainblocks === index
                                    ? "white"
                                    : "#777",
                              }}
                            >
                              <Grid item>
                                {React.cloneElement(option.icon, {
                                  style: { fontSize: "24px" },
                                })}
                              </Grid>
                              <Grid item sx={{ ml: 1 }}>
                                <Typography
                                  style={{
                                    fontSize: 14 + factor,
                                    fontWeight: "bold",
                                  }}
                                >
                                  {option.text}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Link>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            );
          }
        } else {
          return null;
        }
      })}
    </Grid>
  );
};

export default HomeBlock;
