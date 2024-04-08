/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import dayjs from "dayjs";

import {
  Button,
  Dialog,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import DialogHeader from "../../components/small/DialogHeader";
import ViewDialog from "../../components/small/ViewDialog";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const AddJobInteractionForm = ({
  user,
  openEditJob,
  setOpenEditJob,
  selectedJob,
  refreshData,
  setRefreshData,
  toast,
  fromSales,
}) => {
  const [activity, setActivity] = React.useState("");
  const [attachments, setAttachments] = React.useState([]);
  const [endpoint, setEndpoint] = React.useState(fromSales ? "sales" : "jobs");
  const [openViewDialog, setOpenViewDialog] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState("");

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

  // Função para verificar se o anexo é um PDF
  const isPdf = (filename) => filename.endsWith(".pdf");

  const handleAddInteraction = async (e) => {
    e.preventDefault();
    
    try {
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

      await api.put(`/${endpoint}/addAttachments`, {
        jobId: selectedJob._id,
        attachments: uploadResponses,
      });

      const requestBody = {
        jobId: selectedJob._id,
        activity,
        attachments: uploadResponses,
        user,
        worker: selectedJob.worker,
        manager: selectedJob.manager,
        date: dayjs().format("DD/MM/YYYY HH:mm"),
      };

      const res = await api.put(`/${endpoint}/interaction`, requestBody);
      if (res.data) {
        toast.success("Interação Adicionada!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      setOpenEditJob(!openEditJob);
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
    <>
      <form onSubmit={handleAddInteraction}>
        <DialogHeader title="Histórico do Job" femaleGender={false} />
        <Grid container>
          <Grid container direction="column" sx={{ mx: 3 }}>
            <Grid item>
              <Typography
                sx={{ mt: 3, mb: 1, fontSize: 18, fontWeight: "bold" }}
              >
                Interações
              </Typography>
              <Table>
                <TableBody>
                  <TableRow
                    sx={{
                      backgroundColor: "#eee",
                    }}
                  >
                    <TableCell align="left">
                      <Typography sx={{ fontSize: 13, fontWeight: "bold" }}>
                        Colaborador
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography sx={{ fontSize: 13, fontWeight: "bold" }}>
                        Atividade
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography sx={{ fontSize: 13, fontWeight: "bold" }}>
                        Data
                      </Typography>
                    </TableCell>
                  </TableRow>

                  {selectedJob.interactions.map((interaction) => (
                    <TableRow
                      key={interaction.number}
                      sx={{
                        backgroundColor:
                          interaction.number % 2 === 0 ? "#eee" : "white",
                      }}
                    >
                      <TableCell align="left">
                        <Typography sx={{ fontSize: 12 }}>
                          {interaction.user}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography sx={{ fontSize: 12 }}>
                          {interaction.activity}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography sx={{ fontSize: 12 }}>
                          {interaction.date}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>

            <Grid item>
              <Typography
                sx={{ mb: 2, mt: 4, fontSize: 18, fontWeight: "bold" }}
              >
                Nova Interação
              </Typography>
              <Paper
                elevation={1}
                component="form"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  mx: "15%",
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Atividade"
                  inputProps={{ "aria-label": "search google maps" }}
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                />
                <input
                  type="file"
                  multiple
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <label htmlFor="fileInput">
                  <IconButton
                    component="span"
                    aria-label="upload picture"
                    sx={{ p: "10px" }}
                  >
                    <AttachFileIcon />
                  </IconButton>
                </label>
              </Paper>

              {attachments.length !== 0 && (
                <Paper
                  elevation={1}
                  component="form"
                  sx={{
                    p: "2px 4px",
                    display: "flex",
                    alignItems: "center",
                    mx: "15%",
                    mt: 2,
                  }}
                >
                  <Grid item>
                    <Grid container direction="row">
                      {attachments.map((attachment, index) => (
                        <Grid key={index} item sx={{ mr: 1 }}>
                          <Grid
                            container
                            direction="column"
                            alignItems="center"
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
                  </Grid>
                </Paper>
              )}

              <Grid item>
                <Grid container direction="row" justifyContent="flex-end">
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    sx={{ my: 2, mr: 2 }}
                  >
                    Adicionar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setOpenEditJob(!openEditJob)}
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
      {openViewDialog && (
        <Dialog
          open={openViewDialog}
          onClose={() => setOpenViewDialog(false)}
          fullWidth
          maxWidth="lg"
        >
          <ViewDialog
            selectedItem={selectedItem}
            setOpenViewDialog={setOpenViewDialog}
            fromInteractionForm
          />
        </Dialog>
      )}
    </>
  );
};

export default AddJobInteractionForm;
