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
  Typography,
} from "@mui/material";

import DialogHeader from "../../components/small/DialogHeader";
import ColorPicker from "../../components/small/ColorPicker";

import AttachmentsTableCell from "../../components/tableCells/AttachmentsTableCell";
import CurrencyTableCell from "../../components/tableCells/CurrencyTableCell";
import DateTableCell from "../../components/tableCells/DateTableCell";
import DynamicDataTableCell from "../../components/tableCells/DynamicDataTableCell";
import IdDocTableCell from "../../components/tableCells/IdDocTableCell";
import ImageTableCell from "../../components/tableCells/ImageTableCell";
import PhoneTableCell from "../../components/tableCells/PhoneTableCell";
import ProductsTableCell from "../../components/tableCells/ProductsTableCell";
import SelectTableCell from "../../components/tableCells/SelectTableCell";
import ServicesTableCell from "../../components/tableCells/ServicesTableCell";
import StringTableCell from "../../components/tableCells/StringTableCell";

import { isButtonDisabled } from "../../../../controllers/functions/overallFunctions";

export default function AddFormModel(props) {
  const [fields, setFields] = React.useState({});
  const [image, setImage] = React.useState("");
  const [selectedProducts, setSelectedProducts] = React.useState([]);
  const [selectedServices, setSelectedServices] = React.useState([]);
  const [priceDifference, setPriceDifference] = React.useState({});
  const [finalPrice, setFinalPrice] = React.useState(0);
  const [attachments, setAttachments] = React.useState([]);
  const [okToDispatch, setOkToDispatch] = React.useState(false);

  // updating value from child modifications
  React.useEffect(() => {}, [priceDifference]);

  const modalOptions = props.options.find(
    (option) => option.label === props.selectedOptionLabel
  ).modal;

  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileUpload = (files) => {
    setAttachments((prev) => [...prev, ...files]);
  };

  const handleFileRemove = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (fieldName) => (e) => {
    setFields({
      ...fields,
      [fieldName]: e.target.value,
    });
  };

  const handleProductChange = (product) => {
    setSelectedProducts((prev) => {
      const existingProductIndex = prev?.findIndex(
        (p) => p._id === product._id
      );

      let newState;
      if (existingProductIndex !== -1) {
        // Se o produto já está na lista, remove-o
        newState = prev.filter((p) => p._id !== product._id);
      } else {
        // Se o produto não está na lista, adiciona com count inicial de 1
        newState = [...prev, { ...product, count: 1 }];
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
    const uploadResponses = [];
    for (const file of attachments) {
      const formData = new FormData();
      formData.append("attachment", file);

      const uploadResponse = await api.post(
        "/uploads/singleAttachment",
        formData
      );
      uploadResponses.push(uploadResponse.data.attachmentPath);
    }

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
        attachments: uploadResponses,
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
                        //need 'target' for cases like changing department for Managers
                      />
                    )}
                    {field.type === "productList" && (
                      <Grid
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <ProductsTableCell
                          selectedProducts={selectedProducts}
                          handleProductChange={handleProductChange}
                          setSelectedProducts={setSelectedProducts}
                          value={fields[field.name] || ""}
                          onChange={handleChange(field.name)}
                          size="small"
                          required={field.required}
                          fieldType={field.type}
                          finalPrice={finalPrice}
                          setFinalPrice={setFinalPrice}
                          priceDifference={priceDifference}
                          setPriceDifference={setPriceDifference}
                          okToDispatch={okToDispatch}
                          setOkToDispatch={setOkToDispatch}
                          servicePrice={fields["price"]}
                        />
                      </Grid>
                    )}
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
                    {field.type === "attachments" && (
                      <AttachmentsTableCell
                        attachments={attachments}
                        onUpload={handleFileUpload}
                        onRemove={handleFileRemove}
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
          disabled={isButtonDisabled(
            modalOptions,
            okToDispatch,
            selectedServices,
            selectedProducts,
            priceDifference
          )}
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
