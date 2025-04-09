/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
// import toast from "react-hot-toast";

import { Button, DialogActions, DialogTitle } from "@mui/material";

// import { icons } from "../../icons";

const api = axios.create({
  baseURL: "/api",
});

export default function Reports() {
// { onClose }
  const [configData, setConfigData] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        setConfigData(config.data.reports);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <form>
      <DialogTitle
        sx={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
      >
        Configurações de Relatórios
      </DialogTitle>
      {configData.length !== 0 && (
        <>
          <DialogActions>
            <Button type="submit" variant="contained" color="success">
              OK
            </Button>
          </DialogActions>
        </>
      )}
    </form>
  );
}
