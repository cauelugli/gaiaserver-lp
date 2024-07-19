/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import { toast } from "react-toastify";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  Grid,
  Table,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import DialogHeader from "../../components/small/DialogHeader";
import FormEndLineTenant from "../../components/small/FormEndLineTenant";
import DateTableCell from "../../components/small/tableCells/DateTableCell";
import DynamicDataTableCell from "../../components/small/tableCells/DynamicDataTableCell";
import ProductsTableCell from "../../components/small/tableCells/ProductsTableCell";
import SelectTableCell from "../../components/small/tableCells/SelectTableCell";
import StringTableCell from "../../components/small/tableCells/StringTableCell";
import IdDocTableCell from "../../components/small/tableCells/IdDocTableCell";

import CurrencyTableCell from "../../components/small/tableCells/CurrencyTableCell";
import ColorPicker from "../../components/small/ColorPicker";
import PhoneTableCell from "../../components/small/tableCells/PhoneTableCell";
import ImageTableCell from "../../components/small/tableCells/ImageTableCell";

export default function AddFormModel(props) {
  const [fields, setFields] = React.useState({});
  const [image, setImage] = React.useState("");
  const [selectedProducts, setSelectedProducts] = React.useState([]);

  const modalOptions = props.options.find(
    (option) => option.label === props.selectedOptionLabel
  ).modal;

  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleChange = (fieldName) => (e) => {
    setFields({
      ...fields,
      [fieldName]: e.target.value,
    });
  };

  const handleProductChange = (product, count) => {
    setSelectedProducts((prev) => {
      const existingProductIndex = prev.findIndex(
        (p) => p.name === product.name
      );

      let newState;
      if (existingProductIndex !== -1) {
        if (count > 0) {
          const updatedProducts = [...prev];
          updatedProducts[existingProductIndex].count = count;
          newState = updatedProducts;
        } else {
          newState = prev.filter((p) => p.name !== product.name);
        }
      } else {
        if (count > 0) {
          newState = [...prev, { ...product, count }];
        } else {
          newState = prev;
        }
      }

      return newState;
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);

    try {
      const uploadResponse = await api.post("/uploads/singleFile", formData);
      const imagePath = uploadResponse.data.imagePath;
      const res = await api.post(`${modalOptions.endpoint}`, {
        fields,
        image: imagePath,
        model: modalOptions.model,
        selectedProducts,
        createdBy: props.userName || "Admin",
        isManager: modalOptions.label === "Gerente",
        price:
          selectedProducts
            .reduce(
              (sum, product) => sum + product.sellValue * product.count,
              0
            )
            .toFixed(2) || 0,
      });
      if (res.data) {
        toast.success(`${props.selectedOptionLabel} Adicionado!`, {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      props.setOpenAdd(!props.openAdd);
      !props.setRefreshData(!props.refreshData);
    } catch (err) {
      if (
        (err && err.response && err.response.status === 422) ||
        (err && err.response && err.response.status === 420)
      ) {
        toast.error(err.response.data.error, {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      } else {
        console.log("err", err);
        toast.error("Houve algum erro...", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
    }
  };

  return (
    <form onSubmit={handleAdd}>
      <DialogHeader
        title={modalOptions.label}
        femaleGender={modalOptions.femaleGender}
        extraSmall
      />
      <DialogContent>
        {modalOptions.fieldsSections.map((section, sectionIndex) => (
          <Box key={sectionIndex} sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: 16, fontWeight: "bold", mb: 0.5 }}>
              {section.name !== "image" && section.label}
            </Typography>
            {section.name === "image" && (
              <ImageTableCell
                image={image}
                onImageChange={(e) => {
                  const selectedImage = e.target.files[0];
                  setImage(selectedImage);
                }}
                onImageRemove={() => setImage("")}
                onImageClick={handleImageClick}
              />
            )}
            <Grid container direction="row">
              {modalOptions.fields
                .filter(
                  (field) =>
                    field.fieldSection ===
                    modalOptions.fieldsSections[sectionIndex].name
                )
                .map((field, fieldIndex) => (
                  <Grid
                    key={fieldIndex}
                    item
                    sx={{
                      mr: 1,
                      mb: fieldIndex === 0 ? 1 : 0,
                      width: field.type === "productList" ? "100%" : "auto",
                    }}
                  >
                    <Typography sx={{ fontSize: 14 }}>{field.label}</Typography>
                    {field.type === "string" && (
                      <StringTableCell
                        fields={fields}
                        field={field}
                        handleChange={handleChange}
                        modalOptions={modalOptions}
                        required={field.required}
                      />
                    )}
                    {field.type === "idDoc" && (
                      <IdDocTableCell
                        fields={fields}
                        field={field}
                        handleChange={handleChange}
                        modalOptions={modalOptions}
                        required={field.required}
                      />
                    )}
                    {field.type === "phone" && (
                      <PhoneTableCell
                        fields={fields}
                        field={field}
                        handleChange={handleChange}
                        modalOptions={modalOptions}
                        required={field.required}
                      />
                    )}
                    {field.type === "currency" && (
                      <CurrencyTableCell
                        fields={fields}
                        field={field}
                        setFields={setFields}
                        modalOptions={modalOptions}
                        required={field.required}
                      />
                    )}
                    {field.type === "password" && (
                      <StringTableCell
                        fields={fields}
                        field={field}
                        handleChange={handleChange}
                        modalOptions={modalOptions}
                        required={field.required}
                        isPassword
                      />
                    )}
                    {field.type === "fullWidth" && (
                      <StringTableCell
                        fields={fields}
                        field={field}
                        handleChange={handleChange}
                        modalOptions={modalOptions}
                        required={field.required}
                        isFullWidth
                      />
                    )}
                    {field.type === "select" && (
                      <SelectTableCell
                        fields={fields}
                        field={field}
                        menuOptions={field.options}
                        handleChange={handleChange}
                        modalOptions={modalOptions}
                        required={field.required}
                        isFullWidth
                      />
                    )}
                    {field.type === "multipleSelect" && (
                      <SelectTableCell
                        fields={fields}
                        field={field}
                        menuOptions={field.options}
                        handleChange={handleChange}
                        modalOptions={modalOptions}
                        required={field.required}
                        multiple
                      />
                    )}
                    {field.type === "date" && (
                      <DateTableCell
                        fields={fields}
                        field={field}
                        handleChange={handleChange}
                        modalOptions={modalOptions}
                        required={field.required}
                      />
                    )}
                    {field.type === "dynamicData" && (
                      <DynamicDataTableCell
                        fields={fields}
                        field={field}
                        handleChange={handleChange}
                        modalOptions={modalOptions}
                        required={field.required}
                        multiple={field.multiple}
                      />
                    )}
                    {field.type === "productList" && (
                      <Grid
                        ontainer
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <ProductsTableCell
                          value={fields[field.name] || ""}
                          onChange={handleChange(field.name)}
                          size="small"
                          required={field.required}
                          handleProductChange={handleProductChange}
                        />
                        {selectedProducts.length !== 0 && (
                          <Grid
                            sx={{
                              m: 2,
                              mt: 4,
                              border: "1px solid #ccc",
                              borderRadius: 4,
                            }}
                          >
                            <Table size="small">
                              <TableRow>
                                <TableCell>
                                  <Typography
                                    sx={{ fontWeight: "bold", fontSize: 14 }}
                                  >
                                    Nome
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography
                                    sx={{ fontWeight: "bold", fontSize: 14 }}
                                  >
                                    Quantidade
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography
                                    sx={{ fontWeight: "bold", fontSize: 14 }}
                                  >
                                    Valor por Item
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography
                                    sx={{ fontWeight: "bold", fontSize: 14 }}
                                  >
                                    Total
                                  </Typography>
                                </TableCell>
                              </TableRow>
                              {selectedProducts.map((product, index) => (
                                <TableRow key={index} sx={{ mt: 3 }}>
                                  <TableCell>
                                    <Typography sx={{ fontSize: 14 }}>
                                      {product.name}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="right">
                                    <Typography sx={{ fontSize: 14 }}>
                                      {product.count}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="right">
                                    <Typography sx={{ fontSize: 14 }}>
                                      R${product.sellValue.toFixed(2)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="right">
                                    <Typography sx={{ fontSize: 14 }}>
                                      R$
                                      {(
                                        product.sellValue * product.count
                                      ).toFixed(2)}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              ))}
                              {selectedProducts.length > 1 && (
                                <TableRow sx={{ mt: 3 }}>
                                  <TableCell id="ghost" />
                                  <TableCell id="ghost" />
                                  <TableCell id="ghost" />
                                  <TableCell align="right">
                                    <Typography
                                      sx={{ fontSize: 16, fontWeight: "bold" }}
                                    >
                                      R$
                                      {selectedProducts
                                        .reduce(
                                          (sum, product) =>
                                            sum +
                                            product.sellValue * product.count,
                                          0
                                        )
                                        .toFixed(2)}{" "}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              )}
                            </Table>
                          </Grid>
                        )}
                      </Grid>
                    )}
                    {field.type === "list" && (
                      <TextField
                        value={fields[field.name] || ""}
                        onChange={handleChange(field.name)}
                        sx={{ width: "336%" }}
                        size="small"
                        required={field.required}
                      />
                    )}
                    {field.type === "checkbox" && (
                      <Checkbox
                        value={fields[field.name] || ""}
                        onChange={handleChange(field.name)}
                        size="small"
                        required={field.required}
                      />
                    )}
                    {field.type === "color" && (
                      <ColorPicker
                        fields={fields}
                        field={field}
                        handleChange={handleChange}
                        modalOptions={modalOptions}
                        required={field.required}
                      />
                    )}
                  </Grid>
                ))}
            </Grid>
          </Box>
        ))}
      </DialogContent>
      <FormEndLineTenant
        configCustomization={props.configCustomization}
        extraSmall
      />
      <DialogActions>
        <Button type="submit" variant="contained" color="success">
          OK
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => props.setOpenAdd(!props.openAdd)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
}
