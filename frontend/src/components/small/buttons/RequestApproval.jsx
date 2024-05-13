/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import dayjs from "dayjs";

import { IconButton, Tooltip, Typography } from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const socket = io("http://localhost:3000");

export default function RequestApproval({
  userName,
  entry,
  refreshData,
  setRefreshData,
  dispatcherManager,
}) {
  const handleRequestApproval = async (job) => {
    try {
      const requestBody = {
        entryId: entry._id,
      };
      const res = await api.put("/stock/requestApproval", requestBody);
      if (res.data) {
        toast.success("Aprovação Solicitada!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        socket.emit("requestApproval", {
          sender: userName,
          receiver: dispatcherManager,
          job: entry,
          type: "Estoque",
          date: dayjs(Date.now()).format("DD/MM/YYYY"),
        });
        setRefreshData(!refreshData);
      }
    } catch (err) {
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
    }
  };

  return (
    <>
      {dispatcherManager ? (
        <Tooltip
          title={
            <Typography sx={{ fontSize: 12 }}>
              Clique para solicitar a Aprovação do Gerente do Departamento
            </Typography>
          }
        >
          <Typography
            onClick={handleRequestApproval}
            sx={{
              color: "white",
              fontWeight: "bold",
              fontSize: 12,
              px: 1,
              ml: 0.5,
              backgroundColor: "#888",
              cursor: "pointer",
            }}
          >
            !
          </Typography>
        </Tooltip>
      ) : (
        <Tooltip
          title={
            <Typography sx={{ fontSize: 12 }}>
              Não há Gerente do Departamento. Defina um Gerente ao Departamento
              para Solicitar Aprovação.
            </Typography>
          }
        >
          <Typography
            sx={{
              color: "white",
              fontWeight: "bold",
              fontSize: 12,
              px: 1,
              ml: 0.5,
              backgroundColor: "#888",
              cursor: "pointer",
            }}
          >
            !
          </Typography>
        </Tooltip>
      )}
    </>
  );
}
