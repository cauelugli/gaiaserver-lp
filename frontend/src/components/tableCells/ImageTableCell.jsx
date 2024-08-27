/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";

import { Avatar, Badge, Grid } from "@mui/material";
import { Typography } from "@mui/material";

const ImageTableCell = ({
  image,
  onImageChange,
  onImageRemove,
  onImageClick,
}) => {
  const imageSrc = image instanceof File ? URL.createObjectURL(image) : image;

  return (
    <Grid item>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ position: "relative" }}
      >
        <input
          type="file"
          accept="image/*"
          id="fileInput"
          style={{ display: "none" }}
          onChange={onImageChange}
        />
        <label htmlFor="fileInput" disabled={image}>
          <Badge
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            badgeContent={
              image ? (
                <Typography onClick={onImageRemove} sx={{ cursor: "pointer" }}>
                  x
                </Typography>
              ) : null
            }
            color="default"
          >
            <Avatar
              alt="Imagem do Usuário"
              disabled={image}
              sx={{ width: 80, height: 80, cursor: "pointer" }}
              onClick={onImageClick}
            >
              {image ? (
                <img
                  src={imageSrc}
                  alt="Prévia da Imagem"
                  style={{ width: "100%", height: "100%" }}
                />
              ) : null}
            </Avatar>
          </Badge>
        </label>
      </Grid>
    </Grid>
  );
};

export default ImageTableCell;
