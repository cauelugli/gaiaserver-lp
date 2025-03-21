/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import {
  Grid2,
  Typography,
  Tooltip,
  Avatar,
  TextField,
  InputAdornment,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { useAppData } from "../../../src/AppDataContext";
import { icons } from "../../icons";

import ChartRequestsPerCustomerHeader from "./ChartRequestsPerCustomerHeader";

const ChartRequestPerCustomer = ({
  requestsPerCustomer,
  mainColor,
  chartType,
  groupBy,
}) => {
  const appData = useAppData();
  const idIndexList = appData.idIndexList;
  const [selectedCustomer, setSelectedCustomer] = useState(
    requestsPerCustomer && requestsPerCustomer.length > 0
      ? requestsPerCustomer[0]
      : null
  );
  const [selectedCustomerDisplay, setSelectedCustomerDisplay] = useState("all");
  const [searchValue, setSearchValue] = React.useState("");

  const filteredCustomers = requestsPerCustomer.filter((item) => {
    const customer = idIndexList.find(
      (customer) => customer.id === item.customerId
    );

    switch (selectedCustomerDisplay) {
      case "all":
        return true;
      case "customer":
        return customer?.customerType === "Customer";
      case "client":
        return customer?.customerType === "Client";
      default:
        return true;
    }
  });

  useEffect(() => {}, [groupBy]);

  const searchedCustomers = filteredCustomers.filter((item) => {
    const customer = idIndexList.find(
      (customer) => customer.id === item.customerId
    );
    return customer?.name?.toLowerCase().includes(searchValue.toLowerCase());
  });

  return (
    <Grid2 container direction="column" sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
        Clientes
      </Typography>

      {!requestsPerCustomer || requestsPerCustomer.length === 0 ? (
        <Typography>
          Nenhum dado de requisições por cliente encontrado.
        </Typography>
      ) : (
        <Grid2 container>
          <Grid2
            item
            sx={{
              width: "15vw",
              height: "auto",
            }}
          >
            <ChartRequestsPerCustomerHeader
              selectedCustomerDisplay={selectedCustomerDisplay}
              setSelectedCustomerDisplay={setSelectedCustomerDisplay}
            />
            <Grid2 container>
              <TextField
                placeholder="Pesquisar"
                variant="outlined"
                size="small"
                sx={{ my: 0.5, mx: "10%" }}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <icons.SearchIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              {searchedCustomers.map((item, index) => {
                const isSelected =
                  selectedCustomer?.customerId === item.customerId;
                return (
                  <Grid2 item key={index}>
                    <Tooltip
                      title={
                        idIndexList.find(
                          (customer) => customer.id === item.customerId
                        )?.name || ""
                      }
                    >
                      <Avatar
                        src={`http://localhost:3000/static/${
                          idIndexList.find(
                            (customer) => customer.id === item.customerId
                          )?.image || ""
                        }`}
                        onClick={() => setSelectedCustomer(item)}
                        sx={{
                          m: 1.25,
                          cursor: "pointer",
                          border: isSelected && `1px solid ${mainColor}`,
                        }}
                      />
                    </Tooltip>
                  </Grid2>
                );
              })}
            </Grid2>
          </Grid2>

          <Grid2 item>
            {selectedCustomer && (
              <Grid2 item sx={{ ml: 2, mt: -5 }}>
                <Grid2 container alignItems="center">
                  <Avatar
                    src={`http://localhost:3000/static/${
                      idIndexList.find(
                        (customer) =>
                          customer.id === selectedCustomer.customerId
                      )?.image || ""
                    }`}
                    sx={{
                      m: 1.25,
                      cursor: "pointer",
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {idIndexList.find(
                      (customer) => customer.id === selectedCustomer.customerId
                    )?.name || ""}
                  </Typography>
                </Grid2>
                <Grid2 item sx={{mt:-5}}>
                  {chartType === "line" ? (
                    <LineChart
                      xAxis={[
                        { data: selectedCustomer.labels, scaleType: "point" },
                      ]}
                      yAxis={[{ tickMinStep: 1, min: 0 }]}
                      series={[
                        {
                          data: selectedCustomer.length,
                          color: selectedCustomer.color,
                        },
                      ]}
                      width={1450}
                      height={300}
                    />
                  ) : (
                    <BarChart
                      xAxis={[
                        { data: selectedCustomer.labels, scaleType: "band" },
                      ]}
                      yAxis={[{ tickMinStep: 1, min: 0 }]}
                      series={[
                        {
                          data: selectedCustomer.length,
                          color: selectedCustomer.color,
                        },
                      ]}
                      width={1450}
                      height={300}
                    />
                  )}
                </Grid2>
              </Grid2>
            )}
          </Grid2>
        </Grid2>
      )}
    </Grid2>
  );
};

export default ChartRequestPerCustomer;
