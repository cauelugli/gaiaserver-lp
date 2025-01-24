/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
const socket = io("http://localhost:5002");

const AppDataContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAppData = () => {
  return useContext(AppDataContext);
};

export const AppDataProvider = ({ children }) => {
  const [idIndexList, setIdIndexList] = useState([]);
  const [loadingIdIndexList, setLoadingIdIndexList] = useState(true);

  useEffect(() => {
    const fetchIdIndexList = async () => {
      try {
        const { data: idIndexList } = await axios.get(
          "http://localhost:3000/api/idIndexList"
        );

        setIdIndexList(idIndexList);
      } catch (error) {
        console.error("Erro ao buscar a idIndexList:", error);
      } finally {
        setLoadingIdIndexList(false);
      }
    };
    fetchIdIndexList();

    socket.on("refreshIdIndexList", () => {
      fetchIdIndexList();
    });
  }, []);

  const contextValue = {
    idIndexList,
    loadingIdIndexList,
  };

  return (
    <AppDataContext.Provider value={contextValue}>
      {children}
    </AppDataContext.Provider>
  );
};
