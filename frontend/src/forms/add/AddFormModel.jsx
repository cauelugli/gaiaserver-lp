/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import { toast } from "react-toastify";

import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  Grid2,
  Typography,
} from "@mui/material";

import {
  isButtonDisabled,
  loadPage,
} from "../../../../controllers/functions/overallFunctions";

import DialogHeader from "../../components/small/DialogHeader";
import ImageTableCell from "../../components/tableCells/ImageTableCell";

import { renderField } from "../../options/formFieldOptions";
import dayjs from "dayjs";

export default function AddFormModel(props) {
  const [fields, setFields] = React.useState({});
  const [image, setImage] = React.useState("");
  const [selectedMembers, setSelectedMembers] = React.useState([]);
  const [selectedProducts, setSelectedProducts] = React.useState([]);
  const [selectedServices, setSelectedServices] = React.useState([]);
  const [priceDifference, setPriceDifference] = React.useState({});
  const [finalPrice, setFinalPrice] = React.useState(0);
  const [attachments, setAttachments] = React.useState([]);
  const [okToDispatch, setOkToDispatch] = React.useState(false);

  const [refreshData, setRefreshData] = React.useState(false);

  // updating value from child modifications (basic refresh)
  React.useEffect(() => {
    if (fields.worker) {
      //setting Title and Description conveniently for user
      setFields({
        ...fields,
        ["title"]: `${fields.service ? fields.service.name : "Serviço"} - ${
          fields.customer ? fields.customer.name : "Cliente"
        }`,
        ["description"]: `${fields.worker.name}: Realizar ${
          fields.service ? fields.service.name : "Serviço"
        } para ${
          fields.customer ? fields.customer.name : "Cliente"
        } na data ${dayjs().add(1, "day").format("DD/MM/YYYY")} (${dayjs()
          .add(1, "day")
          .format("dddd")}).`,
      });
    }
    if (fields.customer) {
      // setting deliveryAddress conveniently for user
      setFields({
        ...fields,
        ["deliveryAddress"]: `${
          fields.customer?.address ||
          fields.customer?.addressHome ||
          fields.customer?.addressDelivery ||
          ""
        }`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    priceDifference,
    refreshData,
    fields.worker,
    fields.customer,
    fields.service,
  ]);

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

  const handleMemberChange = (members) => {
    setSelectedMembers(members);
  };

  const handleProductChange = (product) => {
    if (product) {
      setSelectedProducts((prev) => {
        const existingProductIndex = prev?.findIndex(
          (p) => p._id === product._id
        );

        let newState;
        if (existingProductIndex !== -1) {
          newState = prev.filter((p) => p._id !== product._id);
        } else {
          newState = [...prev, { ...product, count: 0 }];
        }

        return newState;
      });
    }
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

      const uploadResponse = await props.api.post(
        "/uploads/singleAttachment",
        formData
      );
      uploadResponses.push(uploadResponse.data.attachmentPath);
    }

    const selectedMemberIds = selectedMembers.map((member) => member._id);

    try {
      const uploadResponse = await props.api.post(
        "/uploads/singleFile",
        formData
      );
      const imagePath = uploadResponse.data.imagePath;
      const res = await props.api.post("/add", {
        sourceId: props.userId,
        fields: {
          ...fields,
          members: fields.members?.map((member) => member._id || member.id),
          customer: fields.customer?._id,
          department: fields.department?._id,
          service: fields.service?._id,
          worker: fields.worker?._id,
          seller: fields.seller?._id,
          scheduledTo: fields.scheduledTo
            ? fields.scheduledTo
            : dayjs().add(1, "day").format("DD/MM/YYYY"),
          deliveryScheduledTo: fields.deliveryScheduledTo
            ? fields.deliveryScheduledTo
            : dayjs().add(1, "day").format("DD/MM/YYYY"),
        },
        label: modalOptions.label,
        image: imagePath,
        model: modalOptions.model,
        selectedMembers: selectedMemberIds,
        selectedProducts,
        services: selectedServices?.map((service) => service._id || service.id),
        createdBy: props.isAdmin ? "admin" : props.userId,
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
      if (res.data || res.status === 200) {
        toast.success(`${props.selectedOptionLabel} Adicionado!`, {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        props.socket.emit("newDataRefreshButton", {
          page: props.page,
          userId: props.userId,
        });
      }

      props.setOpenAdd(!props.openAdd);
      !props.setRefreshData(!props.refreshData);
      props.api.post("/log", {
        source: props.userId,
        target: res.data,
        label: modalOptions.label,
        type: "add",
      });
    } catch (err) {
      if (
        (err && err.response && err.response.status === 406) ||
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

  const handlers = {
    setFields,
    handleMemberChange,
    handleProductChange,
    handleServiceChange,
    handleFileUpload,
    handleFileRemove,
    finalPrice,
    setFinalPrice,
    priceDifference,
    setPriceDifference,
    setOkToDispatch,
    attachments,
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
    <form onSubmit={handleAdd}>
      <DialogHeader
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
                    {renderField(
                      field,
                      fields,
                      handleChange,
                      modalOptions,
                      handlers,
                      okToDispatch,
                      selectedMembers,
                      selectedProducts,
                      selectedServices,
                      refreshData,
                      setRefreshData
                    )}
                  </Grid2>
                ))}
            </Grid2>
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
