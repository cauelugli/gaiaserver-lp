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
import DateTableCell from "../../components/tableCells/DateTableCell";
import DynamicDataTableCell from "../../components/tableCells/DynamicDataTableCell";
import ProductsTableCell from "../../components/tableCells/ProductsTableCell";
import SelectTableCell from "../../components/tableCells/SelectTableCell";
import StringTableCell from "../../components/tableCells/StringTableCell";
import IdDocTableCell from "../../components/tableCells/IdDocTableCell";

import CurrencyTableCell from "../../components/tableCells/CurrencyTableCell";
import ColorPicker from "../../components/small/ColorPicker";
import PhoneTableCell from "../../components/tableCells/PhoneTableCell";
import ImageTableCell from "../../components/tableCells/ImageTableCell";
import ServicesTableCell from "../../components/tableCells/ServicesTableCell";

export default function AddFormModel(props) {
  const [fields, setFields] = React.useState({});
  const [image, setImage] = React.useState("");
  const [selectedProducts, setSelectedProducts] = React.useState([]);
  const [selectedServices, setSelectedServices] = React.useState([]);
  const [priceDifference, setPriceDifference] = React.useState({});
  const [finalPrice, setFinalPrice] = React.useState(0);
  // eslint-disable-next-line no-unused-vars
  const [okToDispatch, setOkToDispatch] = React.useState(false);

  // updating value from child modifications
  React.useEffect(() => {}, [priceDifference]);

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

  const handleServiceChange = (service, count) => {
    setSelectedServices((prev) => {
      const existingServiceIndex = prev.findIndex(
        (s) => s.name === service.name
      );

      let newState;
      if (existingServiceIndex !== -1) {
        if (count > 0) {
          const updatedServices = [...prev];
          updatedServices[existingServiceIndex].count = count;
          newState = updatedServices;
        } else {
          newState = prev.filter((p) => p.name !== service.name);
        }
      } else {
        if (count > 0) {
          newState = [...prev, { ...service, count }];
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
        label: modalOptions.label,
        image: imagePath,
        model: modalOptions.model,
        selectedProducts,
        services: selectedServices,
        createdBy: props.userName || "Admin",
        isManager: modalOptions.label === "Gerente",
        price:
          modalOptions.label === "Venda"
            ? selectedProducts
                .reduce(
                  (sum, product) => sum + product.sellValue * product.count,
                  0
                )
                .toFixed(2) || 0
            : modalOptions.label === "Job"
            ? fields.service.price
            : modalOptions.label === "Plano de Serviços"
            ? selectedServices
                .reduce(
                  (sum, service) => sum + service.price * service.count,
                  0
                )
                .toFixed(2) || 0
            : fields.price,
        finalPrice,
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
        palette={props.palette}
        title={modalOptions.label}
        femaleGender={modalOptions.femaleGender}
        extraSmall
      />
      <DialogContent>
        {modalOptions.fieldsSections.map((section, sectionIndex) => (
          <Box key={sectionIndex} sx={{ mb: 1 }}>
            <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
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
                    item
                    key={fieldIndex}
                    sx={{
                      mr: field.type === "servicesList" ? 0 : 1,
                      mb: fieldIndex === 0 ? 1 : 0,
                      width:
                        field.type === "productList" ||
                        field.type === "materialList"
                          ? "100%"
                          : "auto",
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
                    {field.type === "productList" ||
                      (field.type === "materialList" && (
                        <Grid
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
                                        R$
                                        {field.type === "productList"
                                          ? product.sellValue
                                          : product.buyValue.toFixed(2)}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                      <Typography sx={{ fontSize: 14 }}>
                                        R$
                                        {(field.type === "productList"
                                          ? product.sellValue * product.count
                                          : product.buyValue * product.count
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
                                        sx={{
                                          fontSize: 16,
                                          fontWeight: "bold",
                                        }}
                                      >
                                        R$
                                        {field.type === "productList"
                                          ? selectedProducts
                                              .reduce(
                                                (sum, product) =>
                                                  sum +
                                                  product.sellValue *
                                                    product.count,
                                                0
                                              )
                                              .toFixed(2)
                                          : 0.0}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                )}
                                {field.type === "materialList" && (
                                  <Grid sx={{ mx: 2, my: 1, width: "180%" }}>
                                    <Typography sx={{ fontWeight: "bold" }}>
                                      Observação:
                                    </Typography>{" "}
                                    <Typography sx={{ fontSize: 12 }}>
                                      Durante o cadastro do Serviço, os valor
                                      dos materiais{" "}
                                      <strong>não é acrescido.</strong> É
                                      possível selecionar a opção de cobrar ou
                                      não pelos materiais{" "}
                                      <strong>na criação de um novo Job</strong>
                                      .
                                    </Typography>
                                  </Grid>
                                )}
                              </Table>
                            </Grid>
                          )}
                        </Grid>
                      ))}
                    {field.type === "servicesList" && (
                      <ServicesTableCell
                        value={fields[field.name] || ""}
                        onChange={handleChange(field.name)}
                        size="small"
                        required={field.required}
                        handleServiceChange={handleServiceChange}
                        selectedServices={selectedServices}
                        priceDifference={priceDifference}
                        setPriceDifference={setPriceDifference}
                        setFinalPrice={setFinalPrice}
                        setOkToDispatch={setOkToDispatch}
                      />
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
      <DialogActions>
        <Button
          type="submit"
          variant="contained"
          color="success"
          disabled={
            modalOptions.label === "Plano de Serviços" &&
            (selectedServices.length === 0 ||
              (Object.keys(priceDifference).length !== 0 && !okToDispatch))
          }
        >
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
