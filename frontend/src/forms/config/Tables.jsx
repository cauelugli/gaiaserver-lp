/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2,
} from "@mui/material";
import TablesConfigTransferList from "../../components/small/TablesConfigTransferList";

const api = axios.create({
  baseURL: "/api",
});

export default function Tables({ onClose }) {
  const [configData, setConfigData] = React.useState([]);
  const [tableStates, setTableStates] = React.useState({});

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        setConfigData(config.data.tables);
        setTableStates(config.data.tables);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChangeTablesConfig = async (e) => {
    e.preventDefault();
    try {
      const payload = Object.entries(tableStates).reduce(
        (acc, [tableName, tableState]) => {
          acc[tableName] = tableState;
          return acc;
        },
        {}
      );

      const res = await api.put("/config/tables", payload);

      if (res.data) {
        toast.success("Configuração Alterada!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      onClose();
    } catch (err) {
      console.log("erro", err);
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
    }
  };

  return (
    <form onSubmit={handleChangeTablesConfig}>
      <DialogTitle
        sx={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
      >
        Configurações de Tabelas
      </DialogTitle>
      {configData.length !== 0 && (
        <>
          <DialogContent>
            <Grid2
              container
              sx={{ mt: 2 }}
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <TablesConfigTransferList
                tableStates={tableStates}
                setTableStates={setTableStates}
              />
            </Grid2>
          </DialogContent>
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
