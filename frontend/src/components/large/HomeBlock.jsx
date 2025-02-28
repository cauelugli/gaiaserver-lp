/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Grid2,
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
      "chat",
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
    <Grid2
      container
      direction="row"
      sx={{ mt: -1, ml: allowedListMainblocks.length <= 4 ? 15 : "" }}
    >
      {optionsMainblocks.map((option, index) => {
        if (allowedListMainblocks.includes(option.permissionLabel)) {
          if (layout === "Padrão" || layout === "Chip") {
            return (
              <Grid2 item key={index} sx={{ p: 1, my: 1 }}>
                <Link to={option.link} style={{ textDecoration: "none" }}>
                  <Paper
                    onMouseEnter={() => setHoveredIndexMainblocks(index)}
                    onMouseLeave={() => setHoveredIndexMainblocks(null)}
                    sx={{
                      height: (layout === "Chip" ? 30 : 55) * factor,
                      width: (layout === "Chip" ? 55 : 55) * factor,
                      transition: "background-color 0.3s, color 0.3s",
                      backgroundColor:
                        hoveredIndexMainblocks === index && configData
                          ? configData.mainColor
                          : "none",
                      color:
                        hoveredIndexMainblocks === index ? "white" : "none",
                      borderRadius: layout === "Chip" ? 50 : 0,
                    }}
                  >
                    <Grid2
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
                          fontSize: 16 + (factor * 3) / 2,
                          fontWeight: "bold",
                          color:
                            hoveredIndexMainblocks === index
                              ? "white"
                              : "inherit",
                        }}
                      >
                        {option.text}
                      </Typography>
                    </Grid2>
                  </Paper>
                </Link>
              </Grid2>
            );
          }

          if (layout === "Compacto") {
            return (
              <Grid2
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
                        hoveredIndexMainblocks === index && configData
                          ? configData.mainColor
                          : "none",
                      color:
                        hoveredIndexMainblocks === index ? "white" : "none",
                    }}
                  >
                    <Grid2
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
                          color:
                            hoveredIndexMainblocks === index
                              ? "white"
                              : "inherit",
                        }}
                      >
                        {option.text}
                      </Typography>
                    </Grid2>
                  </Paper>
                </Link>
              </Grid2>
            );
          }

          if (layout === "Nuvem") {
            return (
              <Grid2 item key={index} sx={{ p: 2, mt: 5 }}>
                <Link to={option.link} style={{ textDecoration: "none" }}>
                  <Paper
                    onMouseEnter={() => setHoveredIndexMainblocks(index)}
                    onMouseLeave={() => setHoveredIndexMainblocks(null)}
                    sx={{
                      height: 25 * factor,
                      width: 80 * factor,
                      transition: "transform 0.3s ease-in-out",
                      backgroundColor:
                        hoveredIndexMainblocks === index && configData
                          ? configData.mainColor
                          : "#f0f8ff",
                      color: hoveredIndexMainblocks === index ? "white" : "",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                      transform:
                        hoveredIndexMainblocks === index
                          ? "scale(1.2)"
                          : "scale(1)",
                      "::before": {
                        content: "''",
                        position: "absolute",
                        width: "60%",
                        height: "60%",
                        backgroundColor: "inherit",
                        borderRadius: "50%",
                        top: "-40%",
                        left: "10%",
                      },
                      "::after": {
                        content: "''",
                        position: "absolute",
                        width: "50%",
                        height: "50%",
                        backgroundColor: "inherit",
                        borderRadius: "50%",
                        top: "-20%",
                        right: "10%",
                      },
                    }}
                  >
                    {React.cloneElement(option.icon, {
                      style: {
                        fontSize: "2vw",
                      },
                    })}
                    <Typography
                      style={{
                        marginLeft: factor,
                        fontSize: 14 + factor,
                        fontWeight: "bold",
                        color: hoveredIndexMainblocks === index ? "white" : "",
                      }}
                    >
                      {option.text}
                    </Typography>
                  </Paper>
                </Link>
              </Grid2>
            );
          }

          if (layout === "Avatar") {
            return (
              <Grid2
                item
                key={index}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                sx={{ p: 1 }}
              >
                <Link to={option.link} style={{ textDecoration: "none" }}>
                  <Paper
                    onMouseEnter={() => setHoveredIndexMainblocks(index)}
                    onMouseLeave={() => setHoveredIndexMainblocks(null)}
                    sx={{
                      height: 55 * factor,
                      width: 55 * factor,
                      transition: "background-color 0.3s, color 0.3s",
                      backgroundColor:
                        hoveredIndexMainblocks === index && configData
                          ? configData.mainColor
                          : "white",
                      color: hoveredIndexMainblocks === index && "white",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Link to={option.link} style={{ textDecoration: "none" }}>
                      <Grid2
                        container
                        direction="column"
                        alignItems="center"
                        sx={{
                          height: "100%",
                          cursor: "pointer",
                          backgroundColor:
                            hoveredIndexMainblocks === index &&
                            configData &&
                            configData.mainColor,
                          color: hoveredIndexMainblocks === index && "white",
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
                            color:
                              hoveredIndexMainblocks === index
                                ? "white"
                                : "inherit",
                          }}
                        >
                          {option.text}
                        </Typography>
                      </Grid2>
                    </Link>
                  </Paper>
                </Link>
              </Grid2>
            );
          }

          if (layout === "Tabela") {
            return (
              <TableContainer key={index} component={Paper} sx={{ mt: 0.25 }}>
                <Table>
                  <TableBody>
                    <TableRow
                      onMouseEnter={() => setHoveredIndexMainblocks(index)}
                      onMouseLeave={() => setHoveredIndexMainblocks(null)}
                      sx={{
                        backgroundColor:
                          hoveredIndexMainblocks === index &&
                          configData &&
                          configData.mainColor,
                        color: hoveredIndexMainblocks === index && "white",
                        cursor: "pointer",
                      }}
                    >
                      <TableCell align="left">
                        <Link
                          to={option.link}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <Grid2
                            container
                            sx={{
                              backgroundColor:
                                hoveredIndexMainblocks === index &&
                                configData &&
                                configData.mainColor,
                              color:
                                hoveredIndexMainblocks === index && "white",
                            }}
                          >
                            <Grid2 item>
                              {React.cloneElement(option.icon, {
                                style: { fontSize: "24px" },
                              })}
                            </Grid2>
                            <Grid2 item sx={{ ml: 1 }}>
                              <Typography
                                style={{
                                  fontSize: 14 + factor,
                                  fontWeight: "bold",
                                  color:
                                    hoveredIndexMainblocks === index
                                      ? "white"
                                      : "inherit",
                                }}
                              >
                                {option.text}
                              </Typography>
                            </Grid2>
                          </Grid2>
                        </Link>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            );
          }
        } else {
          return null;
        }
      })}
    </Grid2>
  );
};

export default HomeBlock;
