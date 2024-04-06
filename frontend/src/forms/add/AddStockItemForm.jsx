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
import DialogHeader from "../../components/small/DialogHeader";
import FormEndLineTenant from "../../components/small/FormEndLineTenant";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function AddStockItemForm({
  user,
  onClose,
  refreshData,
  setRefreshData,
  configCustomization,
  toast,
}) {
  const [name, setName] = React.useState("");
  const [buyValue, setBuyValue] = React.useState(0);
  const [sellValue, setSellValue] = React.useState(0);
  const [image, setImage] = React.useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);

    try {
      const uploadResponse = await api.post("/uploads/singleFile", formData);
      const imagePath = uploadResponse.data.imagePath;
      const res = await api.post("/stockItems", {
        name,
        buyValue,
        sellValue,
        image: imagePath,
        createdBy: user.username,
      });
      if (res.data) {
        toast.success("Material Adicionado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      onClose();
      setRefreshData(!refreshData);
    } catch (err) {
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleAdd}>
      <DialogHeader title="Material" femaleGender={false} extraSmall />
      <DialogContent>
        <>
          <Grid
            container
            sx={{ mt: 2 }}
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
            alignItems="center"
            justifyContent="center"
          >
            <Grid item sx={{ my: 4 }}>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const selectedImage = e.target.files[0];
                    setImage(selectedImage);
                  }}
                  required
                />
                {!image && (
                  <label htmlFor="fileInput">
                    <Button
                      variant="outlined"
                      color="primary"
                      component="span"
                      size="small"
                      startIcon={<FileUploadIcon />}
                    >
                      Imagem
                    </Button>
                  </label>
                )}
              </div>
            </Grid>
            {image && (
              <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                <Grid item>
                  <Avatar
                    src={URL.createObjectURL(image)}
                    alt="Prévia da Imagem"
                    sx={{ width: 250, height: 250, my: 2 }}
                  />
                </Grid>
                <Grid item>
                  <FormHelperText>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => setImage("")}
                    >
                      Remover
                    </Button>
                  </FormHelperText>
                </Grid>
              </Grid>
            )}
          </Grid>
        </>
      </DialogContent>
      <FormEndLineTenant configCustomization={configCustomization} extraSmall />
      <DialogActions>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            onClose();
          }}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
}
