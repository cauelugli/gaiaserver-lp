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
  CircularProgress,
  DialogActions,
  DialogContent,
  Grid2,
  Typography,
} from "@mui/material";

import ImageTableCell from "../../components/tableCells/ImageTableCell";
import DialogHeader from "../../components/small/DialogHeader";

import TableCellOptions from "../../options/tableCellOptions";
import { loadPage } from "../../../../controllers/functions/overallFunctions";
import ProductFields from "./ProductFields";

export default function EditFormModel(props) {
  const [fields, setFields] = React.useState(props.options.fields);
  const [image, setImage] = React.useState(
    props.target.image
      ? `http://localhost:8080/static/${props.target.image}`
      : ""
  );
  //fix this
  // eslint-disable-next-line no-unused-vars
  const [selectedProducts, setSelectedProducts] = React.useState([]);
  const [selectedServices, setSelectedServices] = React.useState([]);
  const [customers, setCustomers] = React.useState([]);
  const [services, setServices] = React.useState([]);
  const [priceDifference, setPriceDifference] = React.useState({});
  const [finalPrice, setFinalPrice] = React.useState(0);
  const [okToDispatch, setOkToDispatch] = React.useState(false);
  const [refreshData, setRefreshData] = React.useState(false);

  // updating value from child modifications (basic refresh)
  React.useEffect(() => {}, [priceDifference, refreshData]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const services = await api.get("/get", {
          params: { model: "Service" },
        });
        const customers = await api.get("/get", {
          params: { model: "Customer" },
        });
        const clients = await api.get("/get", {
          params: { model: "Client" },
        });
        const allCustomers = [...customers.data, ...clients.data];
        setCustomers(allCustomers);
        setServices(services.data);
      } catch (error) {
        toast.error("Erro ao buscar dados. Tente novamente.", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
    };

    fetchData();
  }, []);

  // Initializing form with target data
  React.useEffect(() => {
    const initializeFields = () => {
      const initialFields = {};
      props.options.fields.forEach((field) => {
        const fieldValue = props.target[field.name] || "";

        if (field.name === "service") {
          const service = services.find(
            (service) => service._id === fieldValue
          );
          initialFields[field.name] = service ? service : "";
        } else if (field.name === "customer") {
          const customer = customers.find(
            (customer) => customer._id === fieldValue
          );
          initialFields[field.name] = customer ? customer : "";
        } else {
          initialFields[field.name] = fieldValue;
        }
      });
      setFields(initialFields);
    };

    initializeFields();
  }, [props.options.fields, props.target, customers, services]);

  const modalOptions = props.options;

  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleImageRemove = () => {
    setImage("");
  };

  const handleChange = (fieldName) => (e) => {
    setFields({
      ...fields,
      [fieldName]: e.target.value,
    });
  };

  const handleProductChange = (product, count) => {
    const existingProductIndex = fields.products.findIndex(
      (p) => p._id === product._id
    );

    if (existingProductIndex !== -1) {
      if (count > 0) {
        fields.products[existingProductIndex].count = count;
      } else {
        fields.products.splice(existingProductIndex, 1);
      }
    } else {
      fields.products.push({ ...product, count: 0 });
    }

    setSelectedProducts([...fields.products]);
    setRefreshData(!refreshData);
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

  const handleEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);


    try {
      const uploadResponse = await api.post("/uploads/singleFile", formData);
      const imagePath = uploadResponse.data.imagePath;

      const updatedFields = {
        ...fields,
        // Inclui os campos dinâmicos de Product apenas se productFields existir
        ...(props.productFields && {
          fields: props.productFields.map((field) => ({
            ...field,
            value: fields[field.name] || field.value,
          })),
        }),
      };

      const res = await api.put("/edit", {
        sourceId: props.userId,
        targetId: props.target._id.toString(),
        fields: updatedFields,
        label: modalOptions.label,
        image: imagePath ? imagePath : props.target.image,
        model: modalOptions.model,
        selectedProducts,
        services: selectedServices,
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
        toast.success(`${modalOptions.label} Editado!`, {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      props.setOpenDialog(!props.openDialog);
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

  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    loadPage().then(() => {
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress sx={{ color: props.mainColor }} />
      </Box>
    );
  }

  return (
    <form onSubmit={handleEdit}>
      <DialogHeader
        title={modalOptions.label}
        femaleGender={modalOptions.femaleGender}
        extraSmall
        isEditing
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
                onImageRemove={handleImageRemove}
                onImageClick={handleImageClick}
              />
            )}
            <Grid2 container direction="row">
              {modalOptions.fields
                .filter(
                  (field) =>
                    field.fieldSection ===
                    modalOptions.fieldsSections[sectionIndex].name
                )
                .map((field, fieldIndex) => (
                  <Grid2
                    item
                    key={fieldIndex}
                    sx={{
                      mr: field.type === "servicesList" ? 0 : 1,
                      mb: fieldIndex === 0 ? 1 : 0,
                      width: field.type === "productList" ? "100%" : "auto",
                    }}
                  >
                    <TableCellOptions
                      field={field}
                      fields={fields}
                      handleChange={handleChange}
                      modalOptions={modalOptions}
                      setFields={setFields}
                      handleProductChange={handleProductChange}
                      handleServiceChange={handleServiceChange}
                      selectedProducts={selectedProducts}
                      selectedServices={selectedServices}
                      color={props.target["color"]}
                      priceDifference={priceDifference}
                      setPriceDifference={setPriceDifference}
                      setFinalPrice={setFinalPrice}
                      setOkToDispatch={setOkToDispatch}
                      serviceLength={{
                        executionTime:
                          fields.service && fields.service.executionTime,
                        sessions: fields.service && fields.service.sessions,
                      }}
                      refreshData={refreshData}
                      setRefreshData={setRefreshData}
                      targetId={props.target._id.toString()}
                      tabIndex={props.tabIndex}
                    />
                  </Grid2>
                ))}
            </Grid2>
          </Box>
        ))}
        {props.productFields && (
          <ProductFields
            productFields={props.productFields}
            handleChange={handleChange}
            fields={fields}
          />
        )}
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
          onClick={() => props.setOpenDialog(!props.openDialog)}
        >
          X
        </Button>
      </DialogActions>
    </form>
  );
}
