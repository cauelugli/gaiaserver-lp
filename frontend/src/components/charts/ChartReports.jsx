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
  // Button,
  Popper,
} from "@mui/material";
import { icons } from "../../icons";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import {
  getChartItems,
  getRequestsPerCustomer,
} from "../../options/chartOptions";
import ChartDataDetail from "./ChartDataDetail";
import ChartReportsHeader from "./ChartReportsHeader";
import ChartRequestPerCustomer from "./ChartRequestsPerCustomer";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

const ChartReports = ({ api, mainColor, windowSizeSetter, fromPage }) => {
  const [salesData, setSalesData] = useState(null);
  const [jobsData, setJobsData] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [requestsPerCustomer, setRequestsPerCustomerData] = useState({});
  const [groupBy, setGroupBy] = useState("day");
  const [selectedChart, setSelectedChart] = useState(0);
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
  const [selectedDate, setSelectedDate] = useState({ type: "", value: [] });
  const [chartSize, setChartSize] = useState({
    width: windowSizeSetter.width / 4.5,
    height: windowSizeSetter.height / 4,
  });

  useEffect(() => {
    setChartSize({
      width: windowSizeSetter.width / 4.5,
      height: windowSizeSetter.height / 4,
    });
  }, [windowSizeSetter]);

  const handleHighlightItem = (item) => {
    setSelectedChart(item);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/get/reports");
        const sales = response.data.find((item) => item.model === "Sale");
        const jobs = response.data.find((item) => item.model === "Job");
        const stock = response.data.find((item) => item.model === "StockEntry");

        setSalesData(sales);
        setJobsData(jobs);
        setStockData(stock);

        const requestsPerCustomer = getRequestsPerCustomer(
          jobs,
          sales,
          groupBy
        );
        setRequestsPerCustomerData(requestsPerCustomer);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    };

    fetchData();
  }, [api, groupBy]);

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

  const filterDataByDate = (labels, data) => {
    if (!selectedDate.value || selectedDate.value.length === 0) {
      return { filteredLabels: labels, filteredData: data };
    }

    if (selectedDate.type === "day") {
      const [start, end] = selectedDate.value;
      const startDate = dayjs(start, "DD/MM");
      const endDate = dayjs(end, "DD/MM");

      const filteredIndices = labels
        .map((label, index) => {
          const currentDate = dayjs(label, "DD/MM");
          return currentDate.isBetween(startDate, endDate, "day", "[]")
            ? index
            : null;
        })
        .filter((index) => index !== null);

      const filteredLabels = filteredIndices.map((index) => labels[index]);
      const filteredData = filteredIndices.map((index) => data[index]);

      return { filteredLabels, filteredData };
    }

    if (selectedDate.type === "month") {
      const filteredIndices = labels
        .map((label, index) => {
          const monthPart = label.substring(0, 3);
          return selectedDate.value.includes(monthPart) ? index : null;
        })
        .filter((index) => index !== null);

      const filteredLabels = filteredIndices.map((index) => labels[index]);
      const filteredData = filteredIndices.map((index) => data[index]);

      return { filteredLabels, filteredData };
    }

    return { filteredLabels: labels, filteredData: data };
  };

  return (
    <Grid2 sx={{ width: "auto" }}>
      {displayChart ? (
        <>
          <ChartReportsHeader
            displayChart={displayChart}
            setDisplayChart={setDisplayChart}
            chartType={chartType}
            setChartType={setChartType}
            groupBy={groupBy}
            setGroupBy={setGroupBy}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            fromPage={fromPage}
          />

          <Grid2
            container
            direction="row"
            justifyContent="center"
            spacing={4}
            sx={{ pb: 2 }}
          >
            <Grid2 container direction="column" sx={{ width: "95%" }}>
              {types.map((type, index) => (
                <Grid2 item key={index}>
                  <Grid2 container direction="column">
                    <Grid2 item>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
                        {typesTranslated[type] || ""}
                      </Typography>
                    </Grid2>

                    <Grid2 container sx={{ m: 2 }}>
                      {chartItems
                        .filter((item) => item.type === type)
                        .map((item, index) => {
                          const globalIndex = chartItems.indexOf(item);

                          return (
                            <Grid2 item key={index}>
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
                                        data: filterDataByDate(
                                          chartItems[selectedChart].labels,
                                          chartItems[selectedChart].length
                                        ).filteredLabels,
                                        scaleType: "point",
                                      },
                                    ]}
                                    yAxis={[{ tickMinStep: 1, min: 0 }]}
                                    series={[
                                      {
                                        data: filterDataByDate(
                                          chartItems[selectedChart].labels,
                                          chartItems[selectedChart].length
                                        ).filteredData,
                                        color: item.color,
                                      },
                                    ]}
                                    onAxisClick={handleChartClick(
                                      item,
                                      globalIndex
                                    )}
                                    width={chartSize.width}
                                    height={200}
                                  />
                                ) : (
                                  <BarChart
                                    xAxis={[
                                      {
                                        data: filterDataByDate(
                                          chartItems[selectedChart].labels,
                                          chartItems[selectedChart].length
                                        ).filteredLabels,
                                        scaleType: "band",
                                        categoryGapRatio: 0.7,
                                        tickPlacement: "middle",
                                      },
                                    ]}
                                    yAxis={[{ tickMinStep: 1, min: 0 }]}
                                    series={[
                                      {
                                        data: filterDataByDate(
                                          chartItems[selectedChart].labels,
                                          chartItems[selectedChart].length
                                        ).filteredData,
                                        color: item.color,
                                      },
                                    ]}
                                    onAxisClick={handleChartClick(
                                      item,
                                      globalIndex
                                    )}
                                    width={chartSize.width}
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
              <ChartRequestPerCustomer
                requestsPerCustomer={requestsPerCustomer}
                mainColor={mainColor}
                chartType={chartType}
                groupBy={groupBy}
                filterDataByDate={filterDataByDate}
                chartSize={chartSize}
              />
            </Grid2>
            <Grid2 id="ghost" sx={{ width: "7vw" }} />
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
