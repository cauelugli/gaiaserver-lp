/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";

import { IconButton, Tooltip, Typography } from "@mui/material";

export default function RequestApproval({entry}) {
  return (
    <Tooltip
      title={
        <Typography sx={{ fontSize: 12 }}>
         Clique para solicitar a Aprovação do Gerente do departamento
        </Typography>
      }
    >
      <IconButton size="small" onClick={() => console.log(entry)}>
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
