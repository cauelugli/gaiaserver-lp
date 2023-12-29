/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { IconButton, Tooltip, Typography } from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function RequestApproval({
  user,
  entry,
  refreshData,
  setRefreshData,
}) {
  const handleRequestApproval = async (job) => {
    try {
      const requestBody = {
        entryId: entry._id,
      };
      const res = await api.put("/stock/requestApproval", requestBody);
      const newNotification = await api.post("/notifications", {
        noteBody: `Solicitação de aprovação de entrada de estoque`,
        sender: user,
        receiver: job.manager,
      });
      if (res.data && newNotification.data) {
        toast.success("Aprovação Solicitada!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        setRefreshData(!refreshData);
      }
    } catch (err) {
      alert("Vish, deu não...");
      console.error(err);
    }
  };
  return (
    <Tooltip
      title={
        <Typography sx={{ fontSize: 12 }}>
          Clique para solicitar a Aprovação do Gerente do departamento
        </Typography>
      }
    >
      <IconButton size="small" onClick={handleRequestApproval}>
        <Typography
          sx={{
            color: "white",
            fontWeight: "bold",
            fontSize: 12,
            px: 1,
            ml: 0.5,
            backgroundColor: "#32aacd",
          }}
        >
          !
        </Typography>
      </IconButton>
    </Tooltip>
  );
}
