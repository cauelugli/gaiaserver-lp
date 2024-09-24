/* eslint-disable react/prop-types */
import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  Box,
  CircularProgress,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import TableModel from "../tables/TableModel";

import PageButtonModel from "../components/small/buttons/PageButtonModel";
import RefreshButton from "../components/small/buttons/RefreshButton";
import NoDataText from "../components/small/NoDataText";
import TableOrCardSelector from "../components/small/TableOrCardSelector";
import CardModel from "../components/cards/CardModel";
import ProductsTableButton from "../components/small/buttons/ProductsTableButton";

import {
  getDataForPage,
  isArray,
} from "../../../controllers/functions/overallFunctions";

function CustomTabPanel(props) {
  const { children, value, index } = props;

  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <Box sx={{ p: 1 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function PageModel(props) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [refreshData, setRefreshData] = React.useState(false);
  const [newDataRefreshButton, setNewDataRefreshButton] = React.useState(true);
  const [configItem, setConfigItem] = React.useState({});
  const [value, setValue] = React.useState(0);

  const [items, setItems] = React.useState([]);
  const [baseItems, setBaseItems] = React.useState([]);

  const [currentPage, setCurrentPage] = React.useState(props.item.page);

  const handleChange = (noArgument, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    if (props.item.page !== currentPage) {
      setValue(0);
      setCurrentPage(props.item.page);
    }

    const fetchData = async () => {
      try {
        const [itemsResponse, configResponse] = await Promise.all([
          api.get("/get", {
            params: {
              model:
                props.item.page === "products"
                  ? "Product"
                  : props.item.models[
                      props.item.page !== currentPage ? 0 : value
                    ],
            },
          }),

          api.get("/config"),
        ]);

        const { filteredItems, baseItems } = getDataForPage(
          itemsResponse,
          props.item.page
        );

        setItems(filteredItems);
        setBaseItems(baseItems);

        const configData = isArray(configResponse.data);
        setConfigItem(configData[0]?.props?.endpoint || null);

        setIsLoading(false);
      } catch (error) {
        toast.error("Houve algum erro...", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [refreshData, currentPage, props.item, value]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "50vw" }}>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        sx={{ ml: 2 }}
      >
        <Typography sx={{ fontSize: 25, mr: 1, fontWeight: "bold" }}>
          {props.item.label}
        </Typography>
        {currentPage === "products" && (
          <ProductsTableButton
            configCustomization={props.configCustomization}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            baseProducts={baseItems}
          />
        )}

        {currentPage !== "quotes" &&
          currentPage !== "finance" &&
          currentPage !== "products" && (
            <PageButtonModel
              palette={props.palette}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              configCustomization={props.configCustomization}
              page={currentPage}
            />
          )}
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ style: { backgroundColor: "black" } }}
        >
          {props.item.page === "products"
            ? baseItems.map((item, index) => (
                <Tab
                  key={index}
                  label={
                    <Typography sx={{ fontSize: 13 }}>{item.type}</Typography>
                  }
                  sx={{
                    color: "black",
                    "&.Mui-selected": { color: "black" },
                  }}
                />
              ))
            : props.item.tabs.map((tab, index) => (
                <Tab
                  key={index}
                  label={<Typography sx={{ fontSize: 13 }}>{tab}</Typography>}
                  sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
                />
              ))}
          <RefreshButton
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            configCustomization={props.configCustomization}
            userId={props.userId}
            newDataRefreshButton={newDataRefreshButton}
            setNewDataRefreshButton={setNewDataRefreshButton}
          />
          <Grid sx={{ my: "auto", ml: "auto" }}>
            <TableOrCardSelector
              userId={props.userId}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              tableOrCard={props.tableOrCardView}
              setUserPreferences={props.setUserPreferences}
              cardSize={props.cardSize}
            />
          </Grid>
        </Tabs>
      </Box>
      {props.item.page === "products" &&
        items.map((item, index) => (
          <CustomTabPanel key={index} value={value} index={index}>
            {items.length === 0 ? (
              <NoDataText option={item} />
            ) : (
              <>
                {props.tableOrCardView ? (
                  <TableModel
                    page={props.item.page}
                    mappedItem={item}
                    items={items.filter(
                      (item) => item.type === baseItems[value]?.type
                    )}
                    itemIndex={index}
                    tableColumns={item.fields}
                    userName={props.userName}
                    userId={props.userId}
                    userRole={props.userRole}
                    userDepartment={props.userDepartment}
                    configData={configItem}
                    refreshData={refreshData}
                    setRefreshData={setRefreshData}
                    topBar={props.topBar}
                    configCustomization={props.configCustomization}
                  />
                ) : (
                  <Grid
                    sx={{ mt: 0.5, width: props.topBar ? "107%" : "100%" }}
                    container
                    spacing={2}
                  >
                    {items.map((nothing, index) => (
                      <Grid
                        item
                        key={index}
                        md={props.cardSize}
                        lg={props.cardSize}
                        xl={props.cardSize}
                      >
                        <CardModel
                          userId={props.userId}
                          userName={props.userName}
                          configData={props.configData}
                          item={props.item}
                          type={props.endpoint}
                          refreshData={refreshData}
                          setRefreshData={setRefreshData}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </>
            )}
          </CustomTabPanel>
        ))}
      {props.item.page !== "products" &&
        props.item.tabs.map((tab, index) => (
          <CustomTabPanel key={index} value={value} index={index}>
            {items.length === 0 ? (
              <NoDataText option={tab} />
            ) : (
              <>
                {props.tableOrCardView ? (
                  <TableModel
                    page={props.item.page}
                    items={items}
                    itemIndex={index}
                    tableColumns={props.item.tableColumns}
                    tabIndex={value}
                    userName={props.userName}
                    userId={props.userId}
                    userRole={props.userRole}
                    userDepartment={props.userDepartment}
                    configData={configItem}
                    refreshData={refreshData}
                    setRefreshData={setRefreshData}
                    topBar={props.topBar}
                    configCustomization={props.configCustomization}
                  />
                ) : (
                  <Grid
                    sx={{ mt: 0.5, width: props.topBar ? "107%" : "100%" }}
                    container
                    spacing={2}
                  >
                    {items.map((nothing, index) => (
                      <Grid
                        item
                        key={index}
                        md={props.cardSize}
                        lg={props.cardSize}
                        xl={props.cardSize}
                      >
                        <CardModel
                          userId={props.userId}
                          userName={props.userName}
                          configData={props.configData}
                          item={props.item}
                          type={props.endpoint}
                          refreshData={refreshData}
                          setRefreshData={setRefreshData}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </>
            )}
          </CustomTabPanel>
        ))}
    </Box>
  );
}
