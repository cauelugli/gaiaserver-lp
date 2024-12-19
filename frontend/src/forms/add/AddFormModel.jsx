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
  Grid,
  Typography,
} from "@mui/material";

import {
  isButtonDisabled,
  loadPage,
} from "../../../../controllers/functions/overallFunctions";

import DialogHeader from "../../components/small/DialogHeader";
import ImageTableCell from "../../components/tableCells/ImageTableCell";
import ScheduleTableCell from "../../components/tableCells/ScheduleTableCell";

import { renderField } from "../../options/formFieldOptions";

export default function AddFormModel(props) {
  const [fields, setFields] = React.useState({});
  const [image, setImage] = React.useState("");
  const [selectedMembers, setSelectedMembers] = React.useState([]);
  const [selectedSchedule, setSelectedSchedule] = React.useState("");
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

  const handleMemberChange = (members) => {
    setSelectedMembers(members);
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

  const handleCheck = (event) => {
    setFields({
      ...fields,
      ["scheduledToAssignee"]: event.target.checked,
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
      const res = await props.api.post(`${modalOptions.endpoint}`, {
        sourceId: props.userId,
        fields,
        label: modalOptions.label,
        image: imagePath,
        model: modalOptions.model,
        selectedMembers: selectedMemberIds,
        selectedProducts,
        selectedSchedule,
        services: selectedServices,
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
      if (res.data) {
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

  const handlers = {
    setFields,
    handleCheck,
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
                    {renderField(
                      field,
                      fields,
                      handleChange,
                      modalOptions,
                      handlers,
                      okToDispatch,
                      selectedMembers,
                      selectedProducts,
                      selectedServices
                    )}
                  </Grid>
                ))}
              {section.name === "scheduling" &&
                (fields.worker || fields.seller) &&
                fields.scheduledToAssignee === true &&
                fields.service && (
                  <ScheduleTableCell
                    api={props.api}
                    assignee={fields.worker._id || fields.seller._id}
                    selectedDate={fields.scheduledTo}
                    serviceLength={{
                      executionTime: fields.service.executionTime,
                      sessions: fields.service.sessions,
                    }}
                    selectedSchedule={selectedSchedule}
                    setSelectedSchedule={setSelectedSchedule}
                  />
                )}
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
