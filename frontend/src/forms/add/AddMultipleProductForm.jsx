/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function AddMultipleProductForm({ user,onClose, fetchData, toast }) {
  const [productList, setProductList] = React.useState([
    {
      name: "",
      image: "",
      type: "",
      color: "",
      model: "",
      size: "",
      groupingType: "Unidade",
      buyValue: 0,
      sellValue: 0,
      createdBy: user.name,
    },
  ]);

  const handleFieldChange = (index, fieldName, value) => {
    const updatedList = [...productList];
    updatedList[index] = {
      ...updatedList[index],
      [fieldName]: value,
    };
    setProductList(updatedList);
  };

  const handleAddProductLine = () => {
    setProductList([...productList, { ...productList[0] }]);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      // Crie um array para armazenar as respostas das chamadas de upload
      const uploadResponses = [];

      // Percorra cada item em productList
      for (const product of productList) {
        const formData = new FormData();
        formData.append("image", product.image);

        // Faça o upload da imagem para cada item
        const uploadResponse = await api.post(
          "/uploads/singleProduct",
          formData
        );
        uploadResponses.push(uploadResponse.data.imagePath);
      }

      // Crie um array de objetos com as informações do produto, incluindo os caminhos das imagens
      const productsData = productList.map((product, index) => ({
        name: product.name,
        brand: product.brand,
        image: uploadResponses[index],
        type: product.type,
        model: product.model,
        size: product.size,
        groupingType: product.groupingType,
        buyValue: product.buyValue,
        sellValue: product.sellValue,
      }));

      // Faça a chamada POST para adicionar os produtos
      const res = await api.post("/products", {
        productList: productsData,
      });

      if (res.data) {
        toast.success("Produtos Adicionados!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      onClose();
      fetchData();
    } catch (err) {
      alert("Vish, deu não...");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleAdd}>
      <DialogTitle>Novos Produtos</DialogTitle>
      <DialogContent>
        {productList.map((product, index) => (
          <Grid
            key={index}
            id={`productLine${index}`}
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            {index !== 0 && (
              <Grid item>
                <IconButton
                  sx={{ ml: -2 }}
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => {
                    setProductList((prevList) =>
                      prevList.filter((_, idx) => idx !== index)
                    );
                  }}
                >
                  <ClearIcon />
                </IconButton>
              </Grid>
            )}
            <Grid item>
              {index === 0 && (
                <Typography sx={{ fontSize: 14, ml: 2 }}>Nome</Typography>
              )}
              <TextField
                size="small"
                value={product.name}
                onChange={(e) =>
                  handleFieldChange(index, "name", e.target.value)
                }
                required
                sx={{ width: 200, ml: index === 0 ? 2 : 0 }}
              />
            </Grid>
            <Grid item sx={{ ml: 1}}>
              {index === 0 && (
                <Typography sx={{ fontSize: 14 }}>Marca</Typography>
              )}
              <TextField
                size="small"
                value={product.brand}
                onChange={(e) =>
                  handleFieldChange(index, "brand", e.target.value)
                }
                required
                sx={{ width: 100 }}
              />
            </Grid>
            <Grid item sx={{ ml: 1 }}>
              {index === 0 && (
                <Typography sx={{ fontSize: 14 }}>Tipo</Typography>
              )}
              <TextField
                size="small"
                value={product.type}
                onChange={(e) =>
                  handleFieldChange(index, "type", e.target.value)
                }
                required
                variant="outlined"
                sx={{ width: 100 }}
              />
            </Grid>
            <Grid item sx={{ ml: 1 }}>
              {index === 0 && (
                <Typography sx={{ fontSize: 14 }}>Tamanho</Typography>
              )}
              <TextField
                size="small"
                value={product.size}
                onChange={(e) =>
                  handleFieldChange(index, "size", e.target.value)
                }
                required
                variant="outlined"
                sx={{ width: 100 }}
              />
            </Grid>
            <Grid item sx={{ ml: 1 }}>
              {index === 0 && (
                <Typography sx={{ fontSize: 14 }}>Cor</Typography>
              )}
              <TextField
                size="small"
                value={product.color}
                onChange={(e) =>
                  handleFieldChange(index, "color", e.target.value)
                }
                required
                variant="outlined"
                sx={{ width: 100 }}
              />
            </Grid>
            <Grid item sx={{ mx: 1 }}>
              {index === 0 && (
                <Typography sx={{ fontSize: 14 }}>Modelo</Typography>
              )}
              <TextField
                size="small"
                value={product.model}
                onChange={(e) =>
                  handleFieldChange(index, "model", e.target.value)
                }
                required
                variant="outlined"
                sx={{ width: 100 }}
              />
            </Grid>
            <Grid item>
              {index === 0 && (
                <Typography sx={{ fontSize: 14 }}>Agrupamento</Typography>
              )}
              <Select
                size="small"
                value={product.groupingType}
                onChange={(e) =>
                  handleFieldChange(index, "groupingType", e.target.value)
                }
                required
                sx={{ width: 110 }}
              >
                <MenuItem value="Unidade">
                  <Typography>Unidade</Typography>
                </MenuItem>
                <MenuItem value="Caixa">
                  <Typography>Caixa</Typography>
                </MenuItem>
                <MenuItem value="Kit">
                  <Typography>Kit</Typography>
                </MenuItem>
              </Select>
            </Grid>
            <Grid item sx={{ ml: 1 }}>
              {index === 0 && (
                <Typography sx={{ fontSize: 14 }}>Valor de Compra</Typography>
              )}
              <TextField
                type="number"
                size="small"
                value={product.buyValue}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mr: 0 }}>
                      R$
                    </InputAdornment>
                  ),
                }}
                onChange={(e) =>
                  handleFieldChange(index, "buyValue", e.target.value)
                }
                required
                variant="outlined"
                sx={{ width: 120 }}
              />
            </Grid>
            <Grid item sx={{ ml: 1 }}>
              {index === 0 && (
                <Typography sx={{ fontSize: 14 }}>Valor de Venda</Typography>
              )}
              <TextField
                type="number"
                size="small"
                value={product.sellValue}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mr: 0 }}>
                      R$
                    </InputAdornment>
                  ),
                }}
                onChange={(e) =>
                  handleFieldChange(index, "sellValue", e.target.value)
                }
                required
                variant="outlined"
                sx={{ width: 120 }}
              />
            </Grid>
            <Grid item sx={{ ml: 2, mb: index !== 0 && 2 }}>
              {product.image ? (
                <Grid container direction="row">
                  <img
                    src={
                      product.image instanceof File
                        ? URL.createObjectURL(product.image)
                        : product.image
                    }
                    alt="Prévia da Imagem"
                    style={{
                      maxWidth: "60px",
                      maxHeight: "60px",
                    }}
                  />
                  <IconButton
                    sx={{ ml: 1 }}
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleFieldChange(index, "image", "")}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              ) : (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    id={`fileInput${index}`}
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const selectedImage = e.target.files[0];
                      // Crie uma cópia do productList para evitar a mutação direta do estado
                      const updatedProductList = [...productList];
                      // Atualize o campo 'image' do item correspondente no productList
                      updatedProductList[index] = {
                        ...updatedProductList[index],
                        image: selectedImage,
                      };
                      // Atualize o estado com o novo productList
                      setProductList(updatedProductList);
                    }}
                    required
                  />

                  {!product.image && (
                    <label htmlFor={`fileInput${index}`}>
                      <Button
                        sx={{ mt: 2 }}
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
              )}
            </Grid>
          </Grid>
        ))}

        <Grid
          id="addProductLine"
          container
          sx={{ my: 2 }}
          justifyContent="flex-end"
        >
          <Button variant="contained" onClick={handleAddProductLine}>
            + NOVO
          </Button>
        </Grid>
      </DialogContent>
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
