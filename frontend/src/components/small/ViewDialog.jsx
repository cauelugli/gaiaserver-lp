/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";

import DialogHeader from "./DialogHeader";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const imageExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".tiff",
  ".webp",
];

const ViewDialog = ({
  selectedItem,
  setOpenViewDialog,
  createObjectURL,
  createObjectURLItem,
  list,
  listTitle,
}) => {
  let isImage;
  let isPdf;

  const [filteredActivities, setFilteredActivities] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [searchDateInitial, setSearchDateInitial] = React.useState(null);
  const [searchDateFinal, setSearchDateFinal] = React.useState(dayjs());

  if (!list) {
    isImage = imageExtensions.some((extension) =>
      selectedItem.endsWith(extension)
    );

    isPdf = selectedItem.endsWith(".pdf");
  }

  useEffect(() => {
    if (list) {
      const filtered = selectedItem.filter((activity) => {
        const activityDate = dayjs(activity.date, "DD/MM/YYYY");
        const searchDateMatch =
          searchDateInitial && searchDateFinal
            ? activityDate.isBetween(
                searchDateInitial,
                searchDateFinal,
                "day",
                "[]"
              )
            : true;
        const searchTextMatch = activity.title
          .toLowerCase()
          .includes(searchValue.toLowerCase());

        return searchTextMatch && searchDateMatch;
      });
      setFilteredActivities(filtered);
    }
  }, [searchValue, searchDateInitial, searchDateFinal, selectedItem]);

  return (
    <>
      <DialogTitle>
        {list ? (
          <DialogHeader
            special
            specialTitle={`Histórico ${listTitle}`}
            femaleGender={false}
          />
        ) : (
          !isImage &&
          !isPdf &&
          (selectedItem.name || selectedItem.title || selectedItem.quoteNumber)
        )}
      </DialogTitle>

      <Grid
        item
        sx={{ width: "100%", mt: 1 }}
        container
        direction="row"
        alignItems="center"
        justifyContent="space-evenly"
      >
        <Grid>
          <TextField
            placeholder="Pesquise..."
            size="small"
            sx={{ mx: 2, mt: 1 }}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
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
        <Grid item>
          <Grid container>
            <Grid>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  format="DD/MM/YYYY"
                  label={searchDateInitial ? null : "De"}
                  value={searchDateInitial}
                  onChange={(newValue) => {
                    setSearchDateInitial(dayjs(newValue, "DD/MM/YYYY"));
                  }}
                  sx={{
                    // o overwrite do Mui está aqui
                    "& .MuiInputBase-root": {
                      mt: 1,
                      height: 40,
                      width: 150,
                    },
                  }}
                />
              </LocalizationProvider>{" "}
            </Grid>

            <Grid sx={{ mx: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  format="DD/MM/YYYY"
                  label={searchDateFinal ? null : "Até"}
                  value={searchDateFinal}
                  onChange={(newValue) => {
                    setSearchDateFinal(dayjs(newValue, "DD/MM/YYYY"));
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      mt: 1,
                      height: 40,
                      width: 150,
                    },
                  }}
                />
              </LocalizationProvider>{" "}
            </Grid>
            <Grid>
              <Button
                size="small"
                variant="outlined"
                sx={{ mt: 1 }}
                onClick={() => {
                  setSearchDateInitial(null);
                  setSearchDateFinal(null);
                }}
              >
                Limpar
              </Button>{" "}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <DialogContent style={{ height: "100%", width: list ? "95%" : "100%" }}>
        {list ? (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    color: "#777",
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#fff",
                    zIndex: 100,
                  }}
                >
                  <Typography sx={{ fontSize: 13 }}>Orçamento</Typography>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    color: "#777",
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#fff",
                    zIndex: 100,
                  }}
                >
                  <Typography sx={{ fontSize: 13 }}>Título</Typography>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    color: "#777",
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#fff",
                    zIndex: 100,
                  }}
                >
                  <Typography sx={{ fontSize: 13 }}>
                    Tipo de Solicitação
                  </Typography>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    color: "#777",
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#fff",
                    zIndex: 100,
                  }}
                >
                  <Typography sx={{ fontSize: 13 }}>Data</Typography>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    color: "#777",
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#fff",
                    zIndex: 100,
                  }}
                >
                  <Typography sx={{ fontSize: 13 }}>Solicitado por</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredActivities
                .sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix())
                .reverse()
                .map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: "white",
                    }}
                  >
                    <TableCell>
                      <Typography sx={{ fontSize: 13 }}>
                        {item.number}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography sx={{ fontSize: 13 }}>
                        {item.title || "Venda"}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography sx={{ fontSize: 13 }}>
                        {item.type === "job"
                          ? "Job"
                          : item.type === "sale"
                          ? "Venda"
                          : ""}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13 }}>{item.date}</Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography sx={{ fontSize: 13 }}>
                        {item.requester}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        ) : (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            style={{ height: "100%" }}
          >
            {isImage && (
              <img
                src={
                  createObjectURL
                    ? URL.createObjectURL(createObjectURLItem)
                    : `http://localhost:3000/static/${selectedItem}`
                }
                alt="Imagem"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            )}
            {isPdf && (
              <Box style={{ width: "100%", height: "100%" }}>
                <Worker
                  workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
                >
                  <Viewer
                    fileUrl={`http://localhost:3000/static/${selectedItem}`}
                  />
                </Worker>
              </Box>
            )}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="success"
          onClick={() => setOpenViewDialog(false)}
          sx={{ mr: 2 }}
        >
          OK
        </Button>
      </DialogActions>
    </>
  );
};

export default ViewDialog;
