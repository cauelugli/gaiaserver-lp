/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import {
  Box,
  Button,
  Dialog,
  FormControlLabel,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import ServiceTable from "../tables/ServiceTable";
import AddServiceForm from "../forms/add/AddServiceForm";
import QuoteTable from "../tables/QuoteTable";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

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

export default function Quotes({ user }) {
  const [value, setValue] = React.useState(0);
  const [openAddService, setOpenAddService] = React.useState(false);

  const [searchValue, setSearchValue] = React.useState("");
  const [searchOption, setSearchOption] = React.useState("name");

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchOptionChange = (event) => {
    setSearchOption(event.target.value);
  };

  const [quotes, setQuotes] = React.useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const quotes = await api.get("/quotes");
        setQuotes(quotes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [quotes]);

  const fetchData = async () => {
    try {
      const quotes = await api.get("/quotes");
      setQuotes(quotes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Box>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Typography
          sx={{ fontSize: 23, mt: 0.5, ml: 1, mr: 2, fontWeight: "bold" }}
        >
          Orçamentos
        </Typography>
        <Button
          onClick={() => setOpenAddService(true)}
          variant="outlined"
          size="small"
          sx={{
            borderRadius: 3,
            bottom: 3,
            "&:hover": { borderColor: "#eee" },
          }}
        >
          <Typography variant="h6">+</Typography>
          <Typography sx={{ fontSize: 16, mt: 0.5, ml: 0.5 }}>Novo</Typography>
        </Button>
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ style: { backgroundColor: "black" } }}
        >
          <Tab
            label={<Typography sx={{ fontSize: 14 }}>Jobs</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label={<Typography sx={{ fontSize: 14 }}>Vendas</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Grid container direction="row" justifyContent="flex-start">
          <Grid item>
            <TextField
              placeholder="Pesquise aqui..."
              size="small"
              sx={{ mb: 1, ml: "2%", width: 350 }}
              value={searchValue}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment:
                  searchValue.length > 0 ? (
                    <InputAdornment position="end">
                      <ClearIcon
                        cursor="pointer"
                        sx={{ color: "#d21404" }}
                        onClick={() => setSearchValue("")}
                      />
                    </InputAdornment>
                  ) : (
                    ""
                  ),
              }}
            />
          </Grid>
          <Grid item sx={{ ml: "2%", pt: 0.5 }}>
            <RadioGroup
              row
              value={searchOption}
              onChange={handleSearchOptionChange}
            >
              <FormControlLabel
                value="name"
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 13,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                    Nome
                  </Typography>
                }
              />
            </RadioGroup>
          </Grid>
        </Grid>
        <QuoteTable
          quotes={quotes}
          searchOption={searchOption}
          searchValue={searchValue}
          fetchData={fetchData}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Grid container direction="row" justifyContent="flex-start">
          <Grid item>
            <TextField
              placeholder="Pesquise aqui..."
              size="small"
              sx={{ mb: 1, ml: "2%", width: 350 }}
              value={searchValue}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment:
                  searchValue.length > 0 ? (
                    <InputAdornment position="end">
                      <ClearIcon
                        cursor="pointer"
                        sx={{ color: "#d21404" }}
                        onClick={() => setSearchValue("")}
                      />
                    </InputAdornment>
                  ) : (
                    ""
                  ),
              }}
            />
          </Grid>
          <Grid item sx={{ ml: "2%", pt: 0.5 }}>
            <RadioGroup
              row
              value={searchOption}
              onChange={handleSearchOptionChange}
            >
              <FormControlLabel
                value="name"
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 13,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                    Nome
                  </Typography>
                }
              />
            </RadioGroup>
          </Grid>
        </Grid>
        <QuoteTable
          quotes={quotes}
          searchOption={searchOption}
          searchValue={searchValue}
          fetchData={fetchData}
        />
      </CustomTabPanel>
      {openAddService && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openAddService}
          onClose={() => setOpenAddService(!openAddService)}
        >
          <AddServiceForm
            openAdd={openAddService}
            setOpenAdd={setOpenAddService}
            fetchData={fetchData}
            toast={toast}
          />
        </Dialog>
      )}
    </Box>
  );
}
