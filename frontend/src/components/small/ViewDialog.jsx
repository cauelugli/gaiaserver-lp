/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const imageExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".tiff",
  ".webp",
];

const ViewDialog = ({ selectedItem, setOpenViewDialog }) => {
  const isImage = imageExtensions.some((extension) =>
    selectedItem.endsWith(extension)
  );

  const isPdf = selectedItem.endsWith(".pdf");

  return (
    <>
      <DialogTitle>
        {!isImage &&
          !isPdf &&
          (selectedItem.name || selectedItem.title || selectedItem.quoteNumber)}
      </DialogTitle>
      <DialogContent style={{ height: "100%", width: "100%" }}>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ height: "100%" }}
        >
          {isImage && (
            <img
              src={`http://localhost:3000/static/${selectedItem}`}
              alt="Imagem"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }} // Garante que a imagem seja redimensionada proporcionalmente
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
