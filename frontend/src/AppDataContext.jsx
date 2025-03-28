/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AppDataContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAppData = () => {
  return useContext(AppDataContext);
};

export const AppDataProvider = ({ children }) => {
  const useArchiveList = [
    "Customer",
    "Client",
    "Job",
    "Sale",
    "StockEntry",
    "Service",
    "ServicePlan",
    "FinanceIncome",
    "FinanceOutcome",
  ];
  const [idIndexList, setIdIndexList] = useState([]);
  const [loadingIdIndexList, setLoadingIdIndexList] = useState(true);
  const [configData, setConfigData] = useState(true);

  useEffect(() => {
    const fetchIdIndexList = async () => {
      try {
        const { data: idIndexList } = await axios.get(
          "http://localhost:3000/api/idIndexList"
        );
        const config = await axios.get("http://localhost:3000/api/config");

        setConfigData(config.data);
        setIdIndexList(idIndexList);
      } catch (error) {
        console.error("Erro ao buscar a idIndexList:", error);
      } finally {
        setLoadingIdIndexList(false);
      }
    };
    fetchIdIndexList();
  }, []);

  const contextValue = {
    useArchiveList,
    idIndexList,
    loadingIdIndexList,
    configData,
  };

  return (
    <AppDataContext.Provider value={contextValue}>
      {children}
    </AppDataContext.Provider>
  );
};
