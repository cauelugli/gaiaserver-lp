/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Typography,
  Grid2,
  Box,
  Button,
  Popper,
} from "@mui/material";
import { icons } from "../../icons";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { getChartItems } from "../../options/chartOptions";
import ChartDataDetail from "./ChartDataDetail";
import ChartReportsHeader from "./ChartReportsHeader";

const ChartReports = ({ api, mainColor }) => {
  const [salesData, setSalesData] = useState(null);
  const [jobsData, setJobsData] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [groupBy, setGroupBy] = useState("week");
  const [selectedChart, setSelectedChart] = useState(0);
  const [isChartFocused, setIsChartFocused] = useState(false);
  const [displayChart, setDisplayChart] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [popoverData, setPopoverData] = useState("");
  const [chartType, setChartType] = useState("line");
  const typesTranslated = {
    Sale: "Vendas",
    Job: "Jobs",
    StockEntry: "Estoque",
  };

  const handleHighlightItem = (item) => {
    setSelectedChart(item);
    setIsChartFocused(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/get/dashboard");
        const sales = response.data.find((item) => item.model === "Sale");
        const jobs = response.data.find((item) => item.model === "Job");
        const stock = response.data.find((item) => item.model === "StockEntry");
        setSalesData(sales);
        setJobsData(jobs);
        setStockData(stock);
      } catch (err) {
        console.error("Erro ao buscar dados");
      }
    };

    fetchData();
  }, [api]);

  if (
    !salesData ||
    !salesData.data ||
    !jobsData ||
    !jobsData.data ||
    !stockData ||
    !stockData.data
  ) {
    return <CircularProgress />;
  }

  const chartItems = getChartItems(salesData, jobsData, stockData, groupBy);
  const types = [...new Set(chartItems.map((item) => item.type))];

  const handleChartClick = (item, index) => (e) => {
    const chartRect = e.target.getBoundingClientRect();
    const clickX = e.clientX - chartRect.left;
    const clickIndex = Math.floor(
      (clickX / chartRect.width) * item.labels.length
    );

    if (clickIndex >= 0 && clickIndex < item.labels.length) {
      const selectedDate = item.labels[clickIndex];
      const selectedValues = item.values[clickIndex] || [];

      setPopoverData({ date: selectedDate, data: selectedValues });
      setAnchorEl(e.currentTarget);
      setHighlightedIndex(index);
    } else {
      setAnchorEl(null);
      setHighlightedIndex(null);
    }
  };

  const handleCloseChartClick = () => {
    setPopoverData(null);
    setAnchorEl(null);
    setHighlightedIndex(null);
  };

  return (
    <Grid2 sx={{ width: "98%" }}>
      {displayChart ? (
        <>
          <ChartReportsHeader
            displayChart={displayChart}
            setDisplayChart={setDisplayChart}
            chartType={chartType}
            setChartType={setChartType}
            groupBy={groupBy}
            setGroupBy={setGroupBy}
            isChartFocused={isChartFocused}
            setIsChartFocused={setIsChartFocused}
          />

          <Grid2
            container
            direction="row"
            justifyContent={isChartFocused ? "space-evenly" : "center"}
            spacing={4}
            sx={{ pb: 2 }}
          >
            {isChartFocused && (
              <Grid2 container sx={{ mt: 1, width: "10vw" }}>
                {chartItems.map((item, index) => (
                  <Button
                    size="small"
                    variant="contained"
                    key={index}
                    sx={{ width: "100%", backgroundColor: item.color, my: 1 }}
                    onClick={() => handleHighlightItem(index)}
                  >
                    {item.title}
                  </Button>
                ))}
              </Grid2>
            )}
            {isChartFocused ? (
              <Grid2 container direction="column">
                <Typography
                  id="title"
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.25vw",
                  }}
                >
                  {chartItems[selectedChart].title}
                </Typography>

                <Grid2 sx={{ my: -5 }}>
                  {chartType === "line" ? (
                    <LineChart
                      xAxis={[
                        {
                          data: chartItems[selectedChart].labels,
                          scaleType: "point",
                        },
                      ]}
                      yAxis={[
                        {
                          tickMinStep: 1,
                          min: 0,
                        },
                      ]}
                      series={[
                        {
                          data: chartItems[selectedChart].length,
                          color: chartItems[selectedChart].color,
                        },
                      ]}
                      onClick={handleChartClick(chartItems[selectedChart], 999)}
                      width={1350}
                      height={300}
                    />
                  ) : (
                    <BarChart
                      xAxis={[
                        {
                          data: chartItems[selectedChart].labels,
                          scaleType: "band",
                        },
                      ]}
                      yAxis={[
                        {
                          tickMinStep: 1,
                          min: 0,
                        },
                      ]}
                      series={[
                        {
                          data: chartItems[selectedChart].length,
                          color: chartItems[selectedChart].color,
                        },
                      ]}
                      onClick={handleChartClick(chartItems[selectedChart], 999)}
                      width={1350}
                      height={300}
                    />
                  )}
                  {highlightedIndex === 999 && (
                    <Popper
                      open={Boolean(anchorEl && highlightedIndex === 999)}
                      anchorEl={anchorEl}
                    >
                      <ChartDataDetail
                        title={chartItems[selectedChart].title}
                        popoverData={popoverData}
                        handleCloseChartClick={handleCloseChartClick}
                        mainColor={mainColor}
                        groupBy={groupBy}
                      />
                    </Popper>
                  )}
                </Grid2>
              </Grid2>
            ) : (
              <Grid2 container direction="column" spacing={4}>
                {types.map((type, index) => (
                  <Grid2 item key={index}>
                    <Grid2 container direction="column" spacing={2}>
                      {/* Título do tipo */}
                      <Grid2 item>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", mb: 2 }}
                        >
                          {typesTranslated[type] || ""}
                        </Typography>
                      </Grid2>

                      {/* Itens do gráfico */}
                      <Grid2 container spacing={2}>
                        {chartItems
                          .filter((item) => item.type === type)
                          .map((item, index) => {
                            const globalIndex = chartItems.indexOf(item);

                            return (
                              <Grid2 item key={index} xs={12} sm={6} md={4}>
                                <Box
                                  sx={{
                                    position: "relative",
                                    display: "inline-block",
                                  }}
                                >
                                  <Typography
                                    onClick={() =>
                                      handleHighlightItem(globalIndex)
                                    }
                                    id="title"
                                    align="center"
                                    sx={{
                                      fontWeight: "bold",
                                      borderRadius: "4px",
                                      transition: "background-color 0.3s ease",
                                      ":hover": {
                                        backgroundColor: `${mainColor}`,
                                        color: "white !important",
                                        cursor: "pointer",
                                      },
                                      ":hover::after": {
                                        content: "'🔍'", // don't remove the '' !!!
                                        position: "absolute",
                                        ml: globalIndex === 3 ? 1 : 2,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                      },
                                    }}
                                  >
                                    {item.title}
                                  </Typography>
                                </Box>
                                <Grid2 sx={{ my: -5 }}>
                                  {chartType === "line" ? (
                                    <LineChart
                                      xAxis={[
                                        {
                                          data: item.labels,
                                          scaleType: "point",
                                        },
                                      ]}
                                      yAxis={[{ tickMinStep: 1, min: 0 }]}
                                      series={[
                                        {
                                          data: item.length,
                                          color: item.color,
                                        },
                                      ]}
                                      onClick={handleChartClick(
                                        item,
                                        globalIndex
                                      )}
                                      width={350}
                                      height={200}
                                    />
                                  ) : (
                                    <BarChart
                                      xAxis={[
                                        {
                                          data: item.labels,
                                          scaleType: "band",
                                        },
                                      ]}
                                      yAxis={[{ tickMinStep: 1, min: 0 }]}
                                      series={[
                                        {
                                          data: item.length,
                                          color: item.color,
                                        },
                                      ]}
                                      onClick={handleChartClick(
                                        item,
                                        globalIndex
                                      )}
                                      width={350}
                                      height={200}
                                    />
                                  )}
                                  {highlightedIndex === globalIndex && (
                                    <Popper
                                      open={Boolean(
                                        anchorEl &&
                                          highlightedIndex === globalIndex
                                      )}
                                      anchorEl={anchorEl}
                                      placement="right"
                                    >
                                      <ChartDataDetail
                                        title={item.title}
                                        popoverData={popoverData}
                                        handleCloseChartClick={
                                          handleCloseChartClick
                                        }
                                        mainColor={mainColor}
                                        groupBy={groupBy}
                                      />
                                    </Popper>
                                  )}
                                </Grid2>
                              </Grid2>
                            );
                          })}
                      </Grid2>
                    </Grid2>
                  </Grid2>
                ))}
              </Grid2>
            )}
            {isChartFocused && <Grid2 id="ghost" sx={{ width: "7vw" }} />}
          </Grid2>
        </>
      ) : (
        <Grid2 container direction="row" alignItems="center">
          <Typography
            id="title"
            sx={{ fontSize: "2vw", m: 2, ml: 1, cursor: "pointer" }}
            onClick={() => setDisplayChart(!displayChart)}
          >
            Relatórios
          </Typography>
          <icons.ExpandMoreIcon
            onClick={() => setDisplayChart(!displayChart)}
            sx={{ cursor: "pointer" }}
          />
        </Grid2>
      )}
    </Grid2>
  );
};

export default ChartReports;
