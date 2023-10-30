/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";
import axios from "axios";

import { Box } from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function DocumentTable() {
  const [files, setFiles] = React.useState([]);

  const fetchFiles = async () => {
    try {
      const response = await api.get("/uploads/listFiles");
      setFiles(response.data.files);
    } catch (error) {
      console.error("Erro ao buscar a lista de arquivos:", error);
    }
  };

  React.useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <>
      <Box sx={{ minWidth: "1050px" }}>
        {files
          // .filter((file) =>
          //   file.name.toLowerCase().includes(searchValue.toLowerCase())
          // )
          .map((file) => file.name)}
      </Box>
    </>
  );
}
