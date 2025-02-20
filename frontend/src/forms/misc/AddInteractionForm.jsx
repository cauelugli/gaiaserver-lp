/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import dayjs from "dayjs";
import { io } from "socket.io-client";

const socket = io("http://localhost:5002");

import {
  Box,
  Button,
  Dialog,
  Grid2,
  IconButton,
  InputBase,
  Paper,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { icons } from "../../icons";

import DialogHeader from "../../components/small/DialogHeader";
import ViewDialog from "../../components/small/ViewDialog";
import InteractionReactions from "../../components/small/InteractionReactions";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const AddInteractionForm = ({
  userId,
  userName,
  openEditJob,
  setOpenEditJob,
  selectedJob,
  refreshData,
  setRefreshData,
  toast,
  fromSales,
  addInteraction,
  updateSelectedJobInteractions,
  updateSelectedSaleInteractions,
}) => {
  const [userReactions, setUserReactions] = React.useState({});
  const [activity, setActivity] = React.useState("");
  const [attachments, setAttachments] = React.useState([]);
  const [endpoint, setEndpoint] = React.useState(fromSales ? "sales" : "jobs");
  const [openViewDialog, setOpenViewDialog] = React.useState(false);
  const [openViewDialog2, setOpenViewDialog2] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openPopoverIndex, setOpenPopoverIndex] = React.useState(null);

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

  const handleAddInteraction = async (e) => {
    e.preventDefault();
    try {
      let uploadResponses = [];
      if (attachments.length !== 0) {
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

        await api.put(`/${endpoint}/addAttachments`, {
          itemId: selectedJob._id,
          attachments: uploadResponses,
          userName,
          date: dayjs().format("DD/MM HH:mm"),
        });
      }

      const requestBody = {
        jobId: selectedJob._id,
        activity,
        attachments: uploadResponses,
        userName,
        date: dayjs().format("DD/MM HH:mm"),
      };

      const res = await api.put(`/${endpoint}/interaction`, requestBody);
      if (res.data) {
        addInteraction(res.data);
        setActivity("");
        setAttachments([]);
        toast.success("Interação Adicionada!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
        socket.emit("newDataRefreshButton", {
          page: "requests",
          userId: userId,
        });
      }
      setRefreshData(!refreshData);
      api.post("/log", {
        source: userId,
        target: res.data,
        label: "Interação",
        type: "interaction",
      });
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

  const handlePopoverOpen = (index) => (event) => {
    setAnchorEl(event.currentTarget);
    setOpenPopoverIndex(index);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setOpenPopoverIndex(null);
  };

  return (
    <>
      <form onSubmit={handleAddInteraction}>
        <DialogHeader
          special
          specialTitle={`Histórico ${fromSales ? "da Venda" : "do Job"}`}
          femaleGender={false}
        />
        <Grid2 container>
          <Grid2 container direction="column" sx={{ mx: 3 }}>
            <Grid2 item>
              <Typography
                sx={{ mt: 3, mb: 1, fontSize: 18, fontWeight: "bold" }}
              >
                Atividades
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography sx={{ fontSize: 13 }}>Colaborador</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13 }}>Atividade</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13 }}>Anexos</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13 }}>Data</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13 }}>Reações</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedJob.interactions.map((interaction, index) => (
                    <TableRow key={index}>
                      <TableCell align="left">
                        <Typography sx={{ fontSize: 13 }}>
                          {interaction.user}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography sx={{ fontSize: 13 }}>
                          {interaction.activity}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        {interaction.attachments &&
                          interaction.attachments.length !== 0 && (
                            <Grid2>
                              <icons.AttachFileIcon
                                sx={{
                                  fontSize: 16,
                                  cursor: "pointer",
                                }}
                                onClick={handlePopoverOpen(index)}
                              />
                              {openPopoverIndex === index && (
                                <Popover
                                  open={Boolean(anchorEl)}
                                  anchorEl={anchorEl}
                                  onClose={handlePopoverClose}
                                  anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                  }}
                                >
                                  <Box
                                    p={2}
                                    sx={{
                                      width: "auto",
                                      maxWidth: 460,
                                      height: "auto",
                                      maxHeight: 280,
                                    }}
                                  >
                                    <Typography
                                      variant="h6"
                                      sx={{ color: "#555" }}
                                    >
                                      Anexos
                                    </Typography>
                                    <Grid2 container direction="row">
                                      {interaction.attachments.map(
                                        (attachment, attachmentIndex) => (
                                          <Grid2
                                            key={attachmentIndex}
                                            sx={{
                                              mr: 2,
                                              mb: 2,
                                              cursor: "pointer",
                                              border: "1px solid darkgrey",
                                              borderRadius: 2,
                                              padding: 1,
                                            }}
                                            onClick={() => {
                                              setSelectedItem(attachment);
                                              setOpenViewDialog(true);
                                            }}
                                          >
                                            {isPdf(attachment) ? (
                                              <img
                                                src={`http://localhost:3000/static/pdf.png`}
                                                alt="PDF"
                                                style={{
                                                  width: "80px",
                                                  height: "80px",
                                                  marginBottom: "8px",
                                                }}
                                              />
                                            ) : isImage(attachment) ? (
                                              <img
                                                src={`http://localhost:3000/static/${attachment}`}
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
                                          </Grid2>
                                        )
                                      )}
                                    </Grid2>
                                  </Box>
                                </Popover>
                              )}
                            </Grid2>
                          )}
                      </TableCell>
                      <TableCell align="left">
                        <Typography sx={{ fontSize: 13 }}>
                          {interaction.date}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        {interaction.activity !== "Job aprovado" && (
                          <Typography sx={{ fontSize: 13 }}>
                            <InteractionReactions
                              userId={userId}
                              userName={userName}
                              itemId={selectedJob._id}
                              refreshData={refreshData}
                              setRefreshData={setRefreshData}
                              interaction={interaction}
                              number={interaction.number}
                              userReactions={
                                userReactions[selectedJob._id] || []
                              }
                              setUserReactions={(reactions) =>
                                setUserReactions({
                                  ...userReactions,
                                  [selectedJob._id]: reactions,
                                })
                              }
                              updateInteractions={
                                fromSales
                                  ? updateSelectedSaleInteractions
                                  : updateSelectedJobInteractions
                              }
                              fromSales={fromSales}
                            />
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid2>

            <Grid2 item>
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
                    <icons.AttachFileIcon />
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
                  <Grid2 item>
                    <Grid2 container direction="row">
                      {attachments.map((attachment, index) => (
                        <Grid2 key={index} item sx={{ mr: 1 }}>
                          <Grid2
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
                                maxWidth: "75px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {attachment.name}
                            </Typography>

                            <Grid2 item>
                              <Grid2
                                container
                                direction="row"
                                justifyContent="space-around"
                              >
                                <Button
                                  size="small"
                                  onClick={() => {
                                    setSelectedItem(attachment);
                                    setOpenViewDialog2(true);
                                  }}
                                >
                                  <icons.VisibilityIcon />
                                </Button>
                                <Button
                                  size="small"
                                  color="error"
                                  onClick={() => removeFile(index)}
                                >
                                  <icons.DeleteIcon />
                                </Button>
                              </Grid2>
                            </Grid2>
                          </Grid2>
                        </Grid2>
                      ))}
                    </Grid2>
                  </Grid2>
                </Paper>
              )}

              <Grid2 item>
                <Grid2 container direction="row" justifyContent="flex-end">
                  <Button
                    type="submit"
                    disabled={activity === ""}
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
                </Grid2>
              </Grid2>
            </Grid2>
          </Grid2>
        </Grid2>
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
          />
        </Dialog>
      )}
      {openViewDialog2 && (
        <Dialog
          open={openViewDialog2}
          onClose={() => setOpenViewDialog2(false)}
          fullWidth
          maxWidth="lg"
        >
          <ViewDialog
            selectedItem={selectedItem.name}
            setOpenViewDialog={setOpenViewDialog2}
            createObjectURL
            createObjectURLItem={selectedItem}
          />
        </Dialog>
      )}
    </>
  );
};

export default AddInteractionForm;
