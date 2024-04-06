/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import dayjs from "dayjs";

import { Button, Divider, Grid, Typography } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/FileUpload";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const AddAttachmentsForm = ({
  setOpenAddAttachments,
  selectedJob,
  refreshData,
  setRefreshData,
  toast,
  endpoint
}) => {
  const [attachments, setAttachments] = React.useState([]);

  const handleAddAttachments = async (e) => {
    e.preventDefault();
    try {
      const uploadResponses = [];
      for (const file of attachments) {
        const formData = new FormData();
        formData.append("attachment", file);

        // Faça o upload para cada item, arrays não funcionam bem
        const uploadResponse = await api.post(
          "/uploads/singleAttachment",
          formData
        );
        uploadResponses.push(uploadResponse.data.attachmentPath);
      }

      const res = await api.put(`/${endpoint}/addAttachments`, {
        jobId: selectedJob._id,
        attachments: uploadResponses,
      });
      if (res.data) {
        toast.success("Anexos Adicionados!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
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

  return (
    <form onSubmit={handleAddAttachments}>
      <Grid container>
        <Grid container direction="column" sx={{ mx: 3 }}>
          <Grid item>
            <Typography sx={{ mb: 2, mt: 4, fontSize: 18, fontWeight: "bold" }}>
              Anexos
            </Typography>

            <Grid>
              <Divider sx={{ my: 3, mr: 10 }} />
              <Grid
                container
                direction="row"
                alignItems="center"
                sx={{ mb: 2 }}
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
                <Grid item>
                  <Grid container direction="row">
                    {attachments.map((file, index) => (
                      <Grid key={index} item sx={{ ml: 1 }}>
                        <Grid
                          container
                          direction="row"
                          alignItems="center"
                          sx={{
                            border: "1px solid darkgrey",
                            borderRadius: 2,
                          }}
                        >
                          <Typography
                            sx={{ fontSize: 13, ml: 1, color: "#777" }}
                          >
                            {file.name}
                          </Typography>

                          <Button
                            size="small"
                            color="error"
                            onClick={() => removeFile(index)}
                            sx={{ mx: -1 }}
                          >
                            <DeleteIcon />
                          </Button>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item>
              <Grid container direction="row" justifyContent="flex-end">
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
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default AddAttachmentsForm;
