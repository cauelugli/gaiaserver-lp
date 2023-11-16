/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Avatar,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import DeleteIcon from "@mui/icons-material/Delete";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function EditStockItemForm({
  selectedStockItem,
  openEdit,
  setOpenEdit,
  refreshData,
  setRefreshData,
  toast,
}) {
  const [name, setName] = React.useState(selectedStockItem.name);
  const [buyValue, setBuyValue] = React.useState(selectedStockItem.buyValue);
  const [sellValue, setSellValue] = React.useState(selectedStockItem.sellValue);
  const [image, setImage] = React.useState(selectedStockItem.image);
  const [newImage, setNewImage] = React.useState("");

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      let updatedImagePath = selectedStockItem.image;

      if (newImage) {
        const formData = new FormData();
        formData.append("image", newImage);
        const uploadResponse = await api.post(
          "/uploads/singleProduct",
          formData
        );
        updatedImagePath = uploadResponse.data.imagePath;
      }
      const res = await api.put("/stockItems", {
        stockItemId: selectedStockItem._id,
        name,
        buyValue,
        sellValue,
        image: updatedImagePath,
      });
      if (res.data) {
        toast.success("Material Editado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenEdit(!openEdit);
      setRefreshData(!refreshData);
    } catch (err) {
      alert("Vish, deu não...");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleEdit}>
      <DialogTitle>Editando Material - {selectedStockItem.name}</DialogTitle>
      <DialogContent>
        <>
          <Grid
            container
            sx={{ my: 2 }}
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Grid item>
              <Typography>Nome</Typography>
              <TextField
                size="small"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                sx={{ width: 230 }}
              />
            </Grid>
            <Grid item sx={{ mx: 1 }}>
              <Typography>Valor de Compra</Typography>
              <TextField
                type="number"
                size="small"
                value={buyValue}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mr: 0 }}>
                      R$
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (inputValue >= 0) {
                    setBuyValue(inputValue);
                  }
                }}
                required
                variant="outlined"
                sx={{ width: 130 }}
              />
            </Grid>
            <Grid item>
              <Typography>Valor de Venda</Typography>
              <TextField
                type="number"
                size="small"
                value={sellValue}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mr: 0 }}>
                      R$
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (inputValue >= 0) {
                    setSellValue(inputValue);
                  }
                }}
                required
                variant="outlined"
                sx={{ width: 130 }}
              />
            </Grid>
          </Grid>

          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>
              <Avatar
                alt="Imagem do Usuário"
                src={`http://localhost:3000/static/${selectedStockItem.image}`}
                sx={{
                  width: 200,
                  height: 200,
                  opacity: newImage ? "0.5" : "1",
                  marginRight: newImage ? 5 : 0,
                }}
              />
            </Grid>

            <Grid item>
              {newImage && (
                <Avatar
                  src={URL.createObjectURL(newImage)}
                  alt="Prévia da Imagem"
                  style={{
                    width: 200,
                    height: 200,
                  }}
                />
              )}
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              style={{ display: "none" }}
              onChange={(e) => {
                const selectedImage = e.target.files[0];
                setNewImage(selectedImage);
              }}
            />
            {!newImage ? (
              <label htmlFor="fileInput">
                <Button
                  variant="outlined"
                  color="primary"
                  component="span"
                  size="small"
                  startIcon={<FileUploadIcon />}
                  sx={{ my: 2 }}
                >
                  Alterar Imagem
                </Button>
              </label>
            ) : (
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => setNewImage("")}
                sx={{ my: 2 }}
              >
                Remover Imagem
              </Button>
            )}
          </Grid>
        </>
      </DialogContent>
      <DialogActions>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpenEdit(!openEdit)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
}
