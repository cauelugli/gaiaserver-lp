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
  const [idIndexList, setIdIndexList] = useState([]);
  const [loadingIdIndexList, setLoadingIdIndexList] = useState(true);

  // Exemplo: Adicione outros estados futuramente
  //   const [anotherData, setAnotherData] = useState(null);
  //   const [loadingAnotherData, setLoadingAnotherData] = useState(false);

  // Carregar `idIndexList` no início
  useEffect(() => {
    const fetchIdIndexList = async () => {
      try {
        // Desestruturação da resposta para pegar diretamente a propriedade 'data'
        const { data: idIndexList } = await axios.get(
          "http://localhost:3000/api/idIndexList"
        );

        // Atualizando o estado com os dados retornados
        setIdIndexList(idIndexList);
      } catch (error) {
        console.error("Erro ao buscar a idIndexList:", error);
      } finally {
        setLoadingIdIndexList(false);
      }
    };

    fetchIdIndexList();
  }, []);

  // Função para carregar outro dado (exemplo de escalabilidade futura)
  //   const fetchAnotherData = async () => {
  //     setLoadingAnotherData(true);
  //     try {
  //       const response = await axios.get("http://localhost:3000/api/anotherData");
  //       setAnotherData(response.data);
  //     } catch (error) {
  //       console.error("Erro ao buscar anotherData:", error);
  //     } finally {
  //       setLoadingAnotherData(false);
  //     }
  //   };

  // O contexto fornece todos os estados e funções relacionados
  const contextValue = {
    idIndexList,
    loadingIdIndexList,
    // anotherData,
    // loadingAnotherData,
    // fetchAnotherData, // Permite carregar manualmente outro dado
  };

  return (
    <AppDataContext.Provider value={contextValue}>
      {children}
    </AppDataContext.Provider>
  );
};
