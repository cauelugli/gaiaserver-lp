/* eslint-disable react/prop-types */
import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAppData } from "../AppDataContext";

import {
  Box,
  CircularProgress,
  Grid2,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import TableModel from "../tables/TableModel";

import PageButtonModel from "../components/small/buttons/PageButtonModel";
import RefreshDataButton from "../components/small/buttons/RefreshDataButton";
import NoDataText from "../components/small/NoDataText";
import TableOrCardSelector from "../components/small/TableOrCardSelector";
import CardModel from "../components/cards/CardModel";
import ProductCardModel from "../components/cards/ProductCardModel";
import ProductsTableButton from "../components/small/buttons/ProductsTableButton";

import TableFiltersBar from "../components/large/TableFiltersBar";
// import ChartReports from "../components/small/ChartReports";

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

function isArray(data) {
  return Array.isArray(data) ? data : [];
}

function getDataForPage(itemsResponse, page, model) {
  const filters = {
    products: (item) => item.name,
    stock: (item) => (model === "Product" ? item.name : true),
  };

  const filterFunc = filters[page] || (() => true);

  let filteredItems = isArray(itemsResponse.data).filter(filterFunc);
  const baseItems = isArray(itemsResponse.data).filter((item) => !item.name);

  return { filteredItems, baseItems };
}

export default function PageModel(props) {
  const appData = useAppData();
  const [isLoading, setIsLoading] = React.useState(true);
  const [refreshData, setRefreshData] = React.useState(false);
  const [newDataRefreshButton, setNewDataRefreshButton] = React.useState(true);
  const [value, setValue] = React.useState(0);

  const [items, setItems] = React.useState([]);
  const [baseItems, setBaseItems] = React.useState([]);

  const [tableFilters, setTableFilters] = React.useState({});
  const [multiple, setMultiple] = React.useState(false);
  const [selectedMultipleItems, setSelectedMultipleItems] = React.useState([]);
  const [highlightArchived, setHighlightArchived] = React.useState(false);
  const [highlightResolved, setHighlightResolved] = React.useState(false);

  const [currentPage, setCurrentPage] = React.useState(props.item.page);

  // eslint-disable-next-line no-unused-vars
  const [configTables, setConfigTables] = React.useState(
    props.configData.tables || {}
  );

  const handleChange = (noArgument, newValue) => {
    const validTabs = props.item.tabs.filter((tab, index) =>
      shouldDisplayTab(props.item.page, index, configTables)
    );

    if (!validTabs[newValue]) {
      newValue = 0;
    }

    setValue(newValue);
    setTableFilters({});
    setSelectedMultipleItems([]);
    setMultiple(false);
    setNewDataRefreshButton(true);
  };

  const handleChangeProductTabs = (noArgument, newValue) => {
    setValue(newValue);
    setTableFilters({});
    setSelectedMultipleItems([]);
    setMultiple(false);
    setNewDataRefreshButton(true);
  };

  const filteredItems = React.useMemo(() => {
    let result = items;

    if (!highlightArchived && !highlightResolved) {
      result = result.filter(
        (item) => item.status !== "Arquivado" && item.status !== "Resolvido"
      );
    }

    if (highlightArchived && highlightResolved) {
      return result;
    }

    if (highlightArchived) {
      result = result.filter((item) => item.status !== "Resolvido");
    }

    if (highlightResolved) {
      result = result.filter((item) => item.status !== "Arquivado");
    }

    return result;
  }, [items, highlightArchived, highlightResolved]);

  React.useEffect(() => {
    if (props.item.page !== currentPage) {
      setValue(0);
      setTableFilters({});
      setCurrentPage(props.item.page);
      setMultiple(false);
      setSelectedMultipleItems([]);
      setNewDataRefreshButton(true);
    }

    const fetchData = async () => {
      try {
        const [itemsResponse] = await Promise.all([
          props.api.get("/get", {
            params: {
              model:
                props.item.page === "products"
                  ? "Product"
                  : props.item.page === "customers" &&
                    !configTables.customerCustomer
                  ? "Client"
                  : props.item.page === "requests" && !configTables.requestJob
                  ? "Sale"
                  : props.item.models[
                      props.item.page !== currentPage ? 0 : value
                    ],
            },
          }),

          props.api.get("/config"),
        ]);

        const { filteredItems, baseItems } = getDataForPage(
          itemsResponse,
          props.item.page,
          props.item.models[value]
        );

        props.item.page === "users"
          ? value === 0
            ? setItems(filteredItems.filter((item) => !item.isManager))
            : setItems(filteredItems.filter((item) => item.isManager))
          : setItems(filteredItems);

        setBaseItems(baseItems);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.api, refreshData, currentPage, props.item, value]);

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

  const shouldDisplayTab = (page, tabIndex, configTables) => {
    if (page === "customers" && tabIndex === 0) {
      return configTables.customerCustomer;
    }
    if (page === "customers" && tabIndex === 1) {
      return configTables.customerClient;
    }
    if (page === "requests" && tabIndex === 0) {
      return configTables.requestJob;
    }
    if (page === "requests" && tabIndex === 1) {
      return configTables.requestSale;
    }
    if (page === "services" && tabIndex === 1) {
      return configTables.servicePlan;
    }
    return true;
  };

  return (
    <Grid2
      sx={{
        minHeight: "50vw",
        width: props.windowSizeSetter.width * 0.93,
      }}
    >
      <Grid2
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        sx={{ ml: 1, mt: 1, mb: 2 }}
      >
        <Typography
          id="title"
          sx={{ fontSize: "1.5vw", mr: 2, fontWeight: "bold" }}
        >
          {props.item.label}
        </Typography>
        {currentPage === "products" && (
          <ProductsTableButton
            userId={props.userId}
            configCustomization={props.configCustomization}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            baseProducts={baseItems}
          />
        )}

        {currentPage !== "finance" && currentPage !== "products" && (
          <PageButtonModel
            api={props.api}
            socket={props.socket}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            configCustomization={props.configCustomization}
            page={currentPage}
            userId={props.userId}
            isAdmin={props.isAdmin}
          />
        )}
      </Grid2>
      <Grid2 sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={
            props.item.page === "products"
              ? handleChangeProductTabs
              : handleChange
          }
          TabIndicatorProps={{
            style: {
              backgroundColor: props?.configCustomization?.mainColor,
            },
          }}
          sx={{ width: props.topBar ? "103%" : "102%" }}
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
                    "&.Mui-selected": {
                      color: "black",
                      backgroundColor: `${props.configCustomization?.mainColor}42`,
                      borderRadius: "15px 15px 0 0",
                    },
                  }}
                />
              ))
            : props.item.tabs.map((tab, index) => {
                // Verifica se a tab deve ser exibida
                if (shouldDisplayTab(props.item.page, index, configTables)) {
                  return (
                    <Tab
                      key={index}
                      label={
                        <Typography sx={{ fontSize: 13 }}>{tab}</Typography>
                      }
                      sx={{
                        color: "black",
                        "&.Mui-selected": {
                          color: "black",
                          backgroundColor: `${props.configCustomization?.mainColor}42`,
                          borderRadius: "15px 15px 0 0",
                        },
                      }}
                    />
                  );
                }
                return null;
              })}
          <RefreshDataButton
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            configCustomization={props.configCustomization}
            userId={props.userId}
            newDataRefreshButton={newDataRefreshButton}
            setNewDataRefreshButton={setNewDataRefreshButton}
          />
          {
            <TableFiltersBar
              tableFilters={tableFilters}
              setTableFilters={setTableFilters}
              mainColor={props.configCustomization?.mainColor}
              page={props.item.page}
              // tabIndex={value}
              tabIndex={
                props.item.page === "customers" &&
                !configTables.customerCustomer
                  ? value + 1
                  : props.item.page === "requests" && !configTables.requestJob
                  ? value + 1
                  : value
              }
            />
          }
          <Grid2 sx={{ my: "auto", ml: "auto" }}>
            <TableOrCardSelector
              userId={props.userId}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              tableOrCard={props.tableOrCardView}
              setUserPreferences={props.setUserPreferences}
              cardSize={props.cardSize}
              mainColor={props.configCustomization?.mainColor}
              multiple={multiple}
              setMultiple={setMultiple}
              selectedMultipleItems={selectedMultipleItems}
              setSelectedMultipleItems={setSelectedMultipleItems}
              model={
                props.item.models[props.item.page !== currentPage ? 0 : value]
              }
              page={props.item.page}
              highlightResolved={highlightResolved}
              setHighlightResolved={setHighlightResolved}
              useArchiveList={appData.useArchiveList?.includes(
                props.item.models[value]
              )}
              highlightArchived={highlightArchived}
              setHighlightArchived={setHighlightArchived}
            />
          </Grid2>
        </Tabs>
      </Grid2>
      <Grid2
        sx={{
          mt: -1,
          ml: -1,
          width: props.topBar ? "106%" : "102%",
        }}
      >
        {props.item.page === "products" &&
          items.map((item, index) => (
            <CustomTabPanel key={index} value={value} index={index}>
              {items.length === 0 || filteredItems.length === 0 ? (
                <NoDataText option={item} />
              ) : (
                <>
                  {props.tableOrCardView ? (
                    <TableModel
                      api={props.api}
                      themeBGColor={props.palette.background["default"]}
                      mainColor={props.configCustomization?.mainColor}
                      page={props.item.page}
                      mappedItem={item}
                      items={items.filter(
                        (item) => item.type === baseItems[value]?.type
                      )}
                      itemIndex={index}
                      tableColumns={item.fields}
                      userName={props.userName}
                      userId={props.userId}
                      configData={props.configData[props.item.page]}
                      refreshData={refreshData}
                      setRefreshData={setRefreshData}
                      topBar={props.topBar}
                      configCustomization={props.configCustomization}
                      multiple={multiple}
                      selectedMultipleItems={selectedMultipleItems}
                      setSelectedMultipleItems={setSelectedMultipleItems}
                    />
                  ) : (
                    <Grid2 container spacing={2} sx={{ mt: 0.5 }}>
                      {items.map((itemMapped, index) => (
                        <Grid2
                          item
                          key={index}
                          md={props.cardSize}
                          lg={props.cardSize}
                          xl={props.cardSize}
                        >
                          <ProductCardModel
                            userId={props.userId}
                            userName={props.userName}
                            cardSize={props.cardSize}
                            configData={props.configData}
                            item={itemMapped}
                            label={props.item.models[value]}
                            refreshData={refreshData}
                            setRefreshData={setRefreshData}
                          />
                        </Grid2>
                      ))}
                    </Grid2>
                  )}
                </>
              )}
            </CustomTabPanel>
          ))}
        {props.item.page !== "products" &&
          props.item.tabs.map((tab, index) => (
            <CustomTabPanel key={index} value={value} index={index}>
              {items.length === 0 || filteredItems.length === 0 ? (
                <NoDataText option={tab} />
              ) : (
                <>
                  {props.tableOrCardView ? (
                    <TableModel
                      api={props.api}
                      themeBGColor={props.palette.background["default"]}
                      mainColor={props.configCustomization?.mainColor}
                      page={props.item.page}
                      items={filteredItems}
                      itemIndex={
                        props.item.page === "customers" &&
                        !configTables.customerCustomer
                          ? index + 1
                          : props.item.page === "requests" &&
                            !configTables.requestJob
                          ? index + 1
                          : index
                      }
                      tableColumns={props.item.tableColumns}
                      tabIndex={
                        props.item.page === "customers" &&
                        !configTables.customerCustomer
                          ? index + 1
                          : props.item.page === "requests" &&
                            !configTables.requestJob
                          ? index + 1
                          : index
                      }
                      userName={props.userName}
                      userId={props.userId}
                      configData={props.configData[props.item.page]}
                      refreshData={refreshData}
                      setRefreshData={setRefreshData}
                      topBar={props.topBar}
                      configCustomization={props.configCustomization}
                      multiple={multiple}
                      selectedMultipleItems={selectedMultipleItems}
                      setSelectedMultipleItems={setSelectedMultipleItems}
                    />
                  ) : (
                    <Grid2 container spacing={2} sx={{ mt: 0.5 }}>
                      {items.map((itemMapped, index) => (
                        <Grid2
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
                            cardSize={props.cardSize}
                            item={itemMapped}
                            label={props.item.models[value]}
                            refreshData={refreshData}
                            setRefreshData={setRefreshData}
                            page={props.item.page}
                            tabIndex={
                              props.item.page === "customers" &&
                              !configTables.customerCustomer
                                ? index + 1
                                : props.item.page === "requests" &&
                                  !configTables.requestJob
                                ? index + 1
                                : index
                            }
                            mainColor={props.configCustomization?.mainColor}
                          />
                        </Grid2>
                      ))}
                    </Grid2>
                  )}
                </>
              )}
            </CustomTabPanel>
          ))}
      </Grid2>
    </Grid2>
  );
}
