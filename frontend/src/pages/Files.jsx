/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import "react-toastify/dist/ReactToastify.css";

import {
  Box,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import DocumentTable from "../tables/DocumentTable";
import ImageTable from "../tables/ImageTable";

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

export default function Files() {
  const [value, setValue] = React.useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Typography sx={{ fontSize: 25, m: 2, fontWeight: "bold" }}>
        Arquivos
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ style: { backgroundColor: "black" } }}
        >
          <Tab
            label={<Typography sx={{ fontSize: 13 }}>Documentos</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label={<Typography sx={{ fontSize: 13 }}>Imagens</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <DocumentTable />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ImageTable />
      </CustomTabPanel>
    </Box>
  );
}
