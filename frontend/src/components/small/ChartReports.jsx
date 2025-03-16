/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid2,
  Box,
  Button,
  Popper,
} from "@mui/material";
import { icons } from "../../icons";
import { LineChart } from "@mui/x-charts/LineChart";
import { getChartItems } from "../../options/chartOptions";
import ChartDataDetail from "./ChartDataDetail";

const ChartReports = ({ api, mainColor }) => {
  const [salesData, setSalesData] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [groupBy, setGroupBy] = useState("week");
  const [selectedChart, setSelectedChart] = useState(0);
  const [isChartFocused, setIsChartFocused] = useState(false);
  const [displayChart, setDisplayChart] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [popoverData, setPopoverData] = useState("");

  const handleHighlightItem = (item) => {
    setSelectedChart(item);
    setIsChartFocused(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/get/dashboard");
        const sales = response.data.find((item) => item.model === "Sale");
        const stock = response.data.find((item) => item.model === "StockEntry");
        setSalesData(sales);
        setStockData(stock);
      } catch (err) {
        console.error("Erro ao buscar dados");
      }
    };

    fetchData();
  }, [api]);

  if (!salesData || !salesData.data || !stockData || !stockData.data) {
    return <CircularProgress />;
  }

  const chartItems = getChartItems(salesData, stockData, groupBy);

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
          <Grid2 sx={{ m: 2 }} container direction="row" alignItems="center">
            <Typography
              id="title"
              sx={{ fontSize: "2vw", mr: "1vw", ml: -1, cursor: "pointer" }}
              onClick={() => setDisplayChart(!displayChart)}
            >
              Relatórios
            </Typography>
            <icons.ExpandLessIcon
              onClick={() => setDisplayChart(!displayChart)}
              sx={{ cursor: "pointer" }}
            />
            <FormControl sx={{ ml: 1 }}>
              <InputLabel>Período</InputLabel>
              <Select
                value={groupBy}
                label="Período"
                onChange={(e) => setGroupBy(e.target.value)}
              >
                <MenuItem value="day">Por Dia</MenuItem>
                <MenuItem value="week">Por Semana</MenuItem>
                <MenuItem value="month">Por Mês</MenuItem>
              </Select>
            </FormControl>
            {isChartFocused && (
              <Button
                sx={{ ml: "auto", height: "auto" }}
                variant="contained"
                color="error"
                onClick={() => setIsChartFocused(false)}
              >
                X
              </Button>
            )}
          </Grid2>

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
                  <LineChart
                    xAxis={[
                      {
                        data: chartItems[selectedChart].labels,
                        scaleType: "point",
                      },
                    ]}
                    series={[
                      {
                        data: chartItems[selectedChart].values,
                        color: chartItems[selectedChart].color,
                      },
                    ]}
                    width={1350}
                    height={300}
                  />
                </Grid2>
              </Grid2>
            ) : (
              chartItems.map((item, index) => (
                <Grid2 container direction="column" key={index}>
                  <Box
                    sx={{
                      position: "relative",
                      display: "inline-block",
                    }}
                  >
                    <Typography
                      onClick={() => handleHighlightItem(index)}
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
                          ml: index === 3 ? 1 : 2,
                          top: "50%",
                          transform: "translateY(-50%)",
                        },
                      }}
                    >
                      {item.title}
                    </Typography>
                  </Box>
                  <Grid2 sx={{ my: -5 }}>
                    <LineChart
                      xAxis={[{ data: item.labels, scaleType: "point" }]}
                      series={[{ data: item.length, color: item.color }]}
                      onClick={handleChartClick(item, index)}
                      width={350}
                      height={200}
                    />
                    {highlightedIndex === index && (
                      <Popper
                        open={Boolean(anchorEl && highlightedIndex === index)}
                        anchorEl={anchorEl} 
                        placement="right"
                      >
                        <ChartDataDetail
                          title={item.title}
                          popoverData={popoverData}
                          handleCloseChartClick={handleCloseChartClick}
                          mainColor={mainColor}
                        />
                      </Popper>
                    )}
                  </Grid2>
                </Grid2>
              ))
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
