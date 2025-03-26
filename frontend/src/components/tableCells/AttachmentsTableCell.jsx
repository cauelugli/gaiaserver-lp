/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

import { Grid2, IconButton, Typography, Button } from "@mui/material";

import { icons } from "../../icons";

const imageExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".tiff",
  ".webp",
];
const isImage = (filename) =>
  imageExtensions.some((extension) => filename.endsWith(extension));

const AttachmentsTableCell = ({ attachments, onUpload, onRemove }) => {
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    onUpload(files); // Envia arquivos para o componente pai
  };

  return (
    <Grid2 container direction="column" spacing={2}>
      <Grid2 item>
        <input
          type="file"
          multiple
          style={{ display: "none" }}
          id="file-upload"
          onChange={handleFileUpload}
        />
        <label htmlFor="file-upload">
          <IconButton component="span">
            <icons.AttachFileIcon />
          </IconButton>
        </label>
      </Grid2>

      <Grid2 item>
        {attachments.length > 0 ? (
          <Grid2 container direction="row" spacing={2}>
            {attachments.map((file, index) => (
              <Grid2 item key={index}>
                <Grid2
                  container
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    border: "1px solid darkgrey",
                    borderRadius: 2,
                    padding: 1,
                  }}
                >
                  {isImage(file.name) ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Pré-visualização"
                      style={{
                        width: "80px",
                        height: "80px",
                        marginBottom: "8px",
                      }}
                    />
                  ) : (
                    <img
                      src={`http://localhost:8080/static/doc.png`}
                      alt="Documento"
                      style={{
                        width: "80px",
                        height: "80px",
                        marginBottom: "8px",
                      }}
                    />
                  )}
                  <Typography
                    sx={{
                      fontSize: 10,
                      maxWidth: "75px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {file.name}
                  </Typography>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => onRemove(index)}
                  >
                    <icons.DeleteIcon />
                  </Button>
                </Grid2>
              </Grid2>
            ))}
          </Grid2>
        ) : (
          ""
        )}
      </Grid2>
    </Grid2>
  );
};

export default AttachmentsTableCell;
