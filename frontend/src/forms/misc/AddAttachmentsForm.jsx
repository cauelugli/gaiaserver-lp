/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import dayjs from "dayjs";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

import { Button, Dialog, Grid, Typography } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";

import ViewDialog from "../../components/small/ViewDialog";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const AddAttachmentsForm = ({
  userName,
  userId,
  setOpenAddAttachments,
  selectedJob,
  refreshData,
  setRefreshData,
  toast,
  endpoint,
  usePageNotEndpoint,
  page,
}) => {
  const [attachments, setAttachments] = React.useState([]);
  const [selectedItem, setSelectedItem] = React.useState("");
  const [openViewDialog, setOpenViewDialog] = React.useState(false);

  const handleAddAttachments = async (e) => {
    e.preventDefault();
    try {
      const uploadResponses = [];
      for (const file of attachments) {
        const formData = new FormData();
        formData.append("attachment", file);
        formData.append("itemId", selectedJob._id);

        const uploadResponse = await api.post(
          "/uploads/singleAttachment",
          formData
        );
        uploadResponses.push(uploadResponse.data.attachmentPath);
      }

      const res = await api.put(`/${endpoint}/addAttachments`, {
        jobId: selectedJob._id,
        itemId: selectedJob._id,
        attachments: uploadResponses,
        userName: userName,
        date: dayjs().format("DD/MM HH:mm"),
      });
      if (res.data) {
        toast.success("Anexos Adicionados!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        socket.emit("newDataRefreshButton", {
          page: usePageNotEndpoint ? page : endpoint,
          userId: userId,
        });
      }
      setOpenAddAttachments(false);
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

  const handleFileChange = (event) => {
    setAttachments([...attachments, ...event.target.files]);
  };

  const removeFile = (indexToRemove) => {
    setAttachments(attachments.filter((_, index) => index !== indexToRemove));
  };

  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".tiff",
    ".webp",
  ];

  const isImage = (filename) =>
    imageExtensions.some((extension) => filename.endsWith(extension));

  const isPdf = (filename) => filename.endsWith(".pdf");

  return (
    <>
      <form onSubmit={handleAddAttachments}>
        <>
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item>
              <Grid
                container
                direction="row"
                alignItems="center"
                sx={{ my: 3 }}
              >
                <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
                  Anexar Arquivos
                </Typography>
                <input
                  type="file"
                  multiple
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <label htmlFor="fileInput">
                  <Button
                    variant="outlined"
                    color="primary"
                    component="span"
                    size="small"
                    startIcon={<FileUploadIcon />}
                    sx={{ ml: 1 }}
                  >
                    Enviar
                  </Button>
                </label>
              </Grid>
            </Grid>

            <Grid item>
              <Grid container direction="row">
                {attachments.length !== 0 && (
                  <Grid
                    container
                    direction="row"
                    wrap="wrap"
                    justifyContent="center"
                    alignItems="center"
                    rowSpacing={2}
                  >
                    {attachments.map((attachment, index) => (
                      <Grid key={index} item sx={{ mr: 1 }}>
                        <Grid
                          container
                          direction="column"
                          alignItems="center"
                          justifyContent="center"
                          sx={{
                            border: "1px solid darkgrey",
                            borderRadius: 2,
                            padding: 1,
                          }}
                        >
                          {isPdf(attachment.name) ? (
                            <img
                              src={`http://localhost:3000/static/pdf.png`}
                              alt="PDF"
                              style={{
                                width: "80px",
                                height: "80px",
                                marginBottom: "8px",
                              }}
                            />
                          ) : isImage(attachment.name) ? (
                            <img
                              src={URL.createObjectURL(attachment)}
                              alt="Pré-visualização"
                              style={{
                                width: "80px",
                                height: "80px",
                                marginBottom: "8px",
                              }}
                            />
                          ) : (
                            <img
                              src={`http://localhost:3000/static/doc.png`}
                              alt="Other"
                              style={{
                                width: "80px",
                                height: "80px",
                                marginBottom: "8px",
                              }}
                            />
                          )}
                          <Typography
                            sx={{
                              fontSize: 10,
                              color: "#777",
                              maxWidth: "75px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {attachment.name}
                          </Typography>

                          <Grid item>
                            <Grid
                              container
                              direction="row"
                              justifyContent="space-around"
                            >
                              <Button
                                size="small"
                                onClick={() => {
                                  setSelectedItem(attachment);
                                  setOpenViewDialog(true);
                                }}
                              >
                                <VisibilityIcon />
                              </Button>
                              <Button
                                size="small"
                                color="error"
                                onClick={() => removeFile(index)}
                              >
                                <DeleteIcon />
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>

          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            sx={{ pr: 2 }}
          >
            <Button
              type="submit"
              variant="contained"
              color="success"
              sx={{ my: 2, mr: 2 }}
            >
              Enviar
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => setOpenAddAttachments(false)}
              sx={{ my: 2 }}
            >
              X
            </Button>
          </Grid>
        </>
      </form>
      {openViewDialog && (
        <Dialog
          open={openViewDialog}
          onClose={() => setOpenViewDialog(false)}
          fullWidth
          maxWidth="lg"
        >
          <ViewDialog
            setOpenViewDialog={setOpenViewDialog}
            selectedItem={selectedItem.name}
            createObjectURLItem={selectedItem}
            createObjectURL
          />
        </Dialog>
      )}
    </>
  );
};

export default AddAttachmentsForm;
