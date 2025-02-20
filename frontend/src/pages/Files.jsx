/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Worker, Viewer } from "@react-pdf-viewer/core";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import { icons } from "../icons";

import NoDataText from "../components/small/NoDataText";

function CustomTabPanel(props) {
  const { children, value, index } = props;

  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <Box sx={{ p: 1 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Files({ topBar }) {
  const [value, setValue] = React.useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [documents, setDocuments] = React.useState([]);
  const [images, setImages] = React.useState([]);
  const [attachments, setAttachments] = React.useState([]);
  const [totalSpaceOccupiedMB, setTotalSpaceOccupiedMB] = React.useState(0);
  const [confirmationDialogOpen, setConfirmationDialogOpen] =
    React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [selectedImages, setSelectedImages] = React.useState([]);

  const handleCheckboxChange = (file) => {
    if (selectedImages.includes(file)) {
      setSelectedImages(selectedImages.filter((image) => image !== file));
    } else {
      setSelectedImages([...selectedImages, file]);
    }
  };

  const [multipleDeletionDialogOpen, setMultipleDeletionDialogOpen] =
    React.useState(false);

  const openMultipleDeletionDialog = () => {
    setMultipleDeletionDialogOpen(true);
  };

  const closeMultipleDeletionDialog = () => {
    setMultipleDeletionDialogOpen(false);
  };

  const handleDeleteMultiple = () => {
    if (selectedImages.length > 0) {
      openMultipleDeletionDialog();
    }
  };

  const fetchFiles = async () => {
    try {
      const responseDocs = await api.get("/uploads/listDocs");
      const responseImages = await api.get("/uploads/listFiles");
      const responseAttachments = await api.get("/uploads/listAttachments");
      setDocuments(responseDocs.data.docs);
      setImages(responseImages.data.files);
      setAttachments(responseAttachments.data.docs);
      setTotalSpaceOccupiedMB(responseDocs.data.totalSpaceMB);
    } catch (error) {
      console.error("Erro ao buscar a lista de arquivos:", error);
    }
  };

  React.useEffect(() => {
    fetchFiles();
  }, []);

  const deleteFile = async (file) => {
    setSelectedFile(file.name);
    openConfirmationDialog();
  };

  const openConfirmationDialog = () => {
    setConfirmationDialogOpen(true);
  };

  const closeConfirmationDialog = () => {
    setConfirmationDialogOpen(false);
  };

  const confirmDelete = async (filename) => {
    console.log("filename", filename);
    try {
      const response = await api.delete(`/uploads/deleteFile/${filename}`);
      if (response.status === 200) {
        toast.error("Arquivo Deletado", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
          icon: <icons.DeleteIcon />,
        });
        fetchFiles();
        closeConfirmationDialog();
      }
    } catch (error) {
      console.error("Erro ao excluir o arquivo:", error);
    }
  };

  const confirmDeleteMultiple = async (imagesToDelete) => {
    try {
      const response = await api.post("/uploads/deleteMultipleFiles", {
        files: imagesToDelete,
      });

      if (response.status === 200) {
        toast.error("Arquivos Deletados", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
          icon: <icons.DeleteIcon />,
        });
        fetchFiles();
        closeMultipleDeletionDialog();
        setSelectedImages([]);
      }
    } catch (error) {
      console.error("Erro ao excluir as imagens:", error);
    }
  };

  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [pdfUrl, setPdfUrl] = React.useState("");

  const openViewDialog = (file) => {
    setPdfUrl(`http://localhost:3000/static/docs/${file.name}`);
    setViewDialogOpen(true);
  };

  const closeViewDialog = () => {
    setViewDialogOpen(false);
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
      <Box>
        <Typography sx={{ fontSize: 25, ml: 2, fontWeight: "bold" }} id="title">
          Arquivos
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            TabIndicatorProps={{ style: { backgroundColor: "black" } }}
            sx={{ width: topBar ? "103%" : "102%" }}
          >
            <Tab
              label={<Typography sx={{ fontSize: 13 }}>Documentos</Typography>}
              sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
            />
            <Tab
              label={<Typography sx={{ fontSize: 13 }}>Imagens</Typography>}
              sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
            />
            <Tab
              label={<Typography sx={{ fontSize: 13 }}>Anexos</Typography>}
              sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          {documents.length === 0 ? (
            <NoDataText option="Documentos" />
          ) : (
            <>
              <Box sx={{ width: topBar ? "105%" : "100%", minHeight: "50vw" }}>
                <Grid2 container direction="row" sx={{ py: 2 }}>
                  <Typography sx={{ my: "auto" }}>
                    Tamanho em Disco: {totalSpaceOccupiedMB}MB
                  </Typography>
                  <Grid2 item sx={{ mt: -1 }}>
                    {selectedImages.length > 0 && (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<icons.ClearIcon sx={{ mt: -0.5, p: 0 }} />}
                        onClick={() => setSelectedImages([])}
                        sx={{ mx: 1 }}
                      >
                        Limpar Seleção
                      </Button>
                    )}
                  </Grid2>
                  <Grid2 item sx={{ mt: -1 }}>
                    {selectedImages.length > 0 && (
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        startIcon={<icons.DeleteIcon sx={{ mt: -0.5 }} />}
                        onClick={handleDeleteMultiple}
                      >
                        Excluir Selecionados
                      </Button>
                    )}
                  </Grid2>
                </Grid2>
                <Grid2 container spacing={2}>
                  {documents.map((file) => {
                    return (
                      <Grid2 key={file._id} item xs={2}>
                        <img
                          alt="Imagem do Documento"
                          src={`http://localhost:3000/static/pdf.png`}
                          style={{
                            width: 100,
                            height: 100,
                          }}
                        />
                        <Typography sx={{ fontSize: 10 }}>
                          {file.name} - {file.sizeKB}KB
                        </Typography>
                        <Grid2 container direction="row" sx={{ ml: 2 }}>
                          <Checkbox
                            checked={selectedImages.includes(file)}
                            onChange={() => handleCheckboxChange(file)}
                            sx={{ p: 0, m: 0 }}
                          />
                          <icons.VisibilityIcon
                            color="inherit"
                            onClick={() => openViewDialog(file)}
                            sx={{ mx: 1, py: 0 }}
                            style={{ cursor: "pointer" }}
                          />
                          <icons.DeleteIcon
                            color="error"
                            onClick={() => deleteFile(file)}
                            style={{ cursor: "pointer" }}
                          />
                        </Grid2>
                      </Grid2>
                    );
                  })}
                </Grid2>
              </Box>
            </>
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          {images.length === 0 ? (
            <NoDataText option="Imagens" />
          ) : (
            <Box sx={{ width: topBar ? "105%" : "100%", minHeight: "50vw" }}>
              <Grid2 container direction="row" sx={{ py: 2 }}>
                <Typography sx={{ my: "auto" }}>
                  Tamanho em Disco: {totalSpaceOccupiedMB}MB
                </Typography>
                <Grid2 item sx={{ mt: -1 }}>
                  {selectedImages.length > 0 && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<icons.ClearIcon sx={{ mt: -0.5, p: 0 }} />}
                      onClick={() => setSelectedImages([])}
                      sx={{ mx: 1 }}
                    >
                      Limpar Seleção
                    </Button>
                  )}
                </Grid2>
                <Grid2 item sx={{ mt: -1 }}>
                  {selectedImages.length > 0 && (
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      startIcon={<icons.DeleteIcon sx={{ mt: -0.5 }} />}
                      onClick={handleDeleteMultiple}
                    >
                      Excluir Selecionados
                    </Button>
                  )}
                </Grid2>
              </Grid2>
              <Grid2 container spacing={2}>
                {images.map((file) => {
                  return (
                    <Grid2 key={file._id} item xs={2}>
                      <img
                        alt="Imagem do Produto"
                        src={`http://localhost:3000/static/images/${file.name}`}
                        style={{
                          width: 100,
                          height: 100,
                        }}
                      />
                      <Typography sx={{ fontSize: 10 }}>
                        {file.name} - {file.sizeKB}KB
                      </Typography>
                      <Grid2 container direction="row" sx={{ ml: 1 }}>
                        <Checkbox
                          checked={selectedImages.includes(file)}
                          onChange={() => handleCheckboxChange(file)}
                          sx={{ mr: 1, py: 0 }}
                        />
                        <icons.DeleteIcon
                          color="error"
                          onClick={() => deleteFile(file)}
                          style={{ cursor: "pointer" }}
                        />
                      </Grid2>
                    </Grid2>
                  );
                })}
              </Grid2>
            </Box>
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          {attachments.length === 0 ? (
            <NoDataText option="Anexos" />
          ) : (
            <Box sx={{ width: topBar ? "105%" : "100%", minHeight: "50vw" }}>
              <Grid2 container direction="row" sx={{ py: 2 }}>
                <Typography sx={{ my: "auto" }}>
                  Tamanho em Disco: {totalSpaceOccupiedMB}MB
                </Typography>
                <Grid2 item sx={{ mt: -1 }}>
                  {selectedImages.length > 0 && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<icons.ClearIcon sx={{ mt: -0.5, p: 0 }} />}
                      onClick={() => setSelectedImages([])}
                      sx={{ mx: 1 }}
                    >
                      Limpar Seleção
                    </Button>
                  )}
                </Grid2>
                <Grid2 item sx={{ mt: -1 }}>
                  {selectedImages.length > 0 && (
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      startIcon={<icons.DeleteIcon sx={{ mt: -0.5 }} />}
                      onClick={handleDeleteMultiple}
                    >
                      Excluir Selecionados
                    </Button>
                  )}
                </Grid2>
              </Grid2>
              <Grid2 container spacing={2}>
                {attachments.map((file) => {
                  return (
                    <Grid2 key={file._id} item xs={2}>
                      {isPdf(file.name) ? (
                        <img
                          src={`http://localhost:3000/static/pdf.png`}
                          alt="PDF"
                          style={{
                            width: "80px",
                            height: "80px",
                            marginBottom: "8px",
                          }}
                        />
                      ) : isImage(file.name) ? (
                        <img
                          src={`http://localhost:3000/static/attachments/${file.name}`}
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
                      <Typography sx={{ fontSize: 10 }}>
                        {file.name} - {file.sizeKB}KB
                      </Typography>
                      <Grid2 container direction="row" sx={{ ml: 2 }}>
                        <Checkbox
                          checked={selectedImages.includes(file)}
                          onChange={() => handleCheckboxChange(file)}
                          sx={{ p: 0, m: 0 }}
                        />
                        <icons.DeleteIcon
                          color="error"
                          onClick={() => deleteFile(file)}
                          style={{ cursor: "pointer" }}
                        />
                      </Grid2>
                    </Grid2>
                  );
                })}
              </Grid2>
            </Box>
          )}{" "}
        </CustomTabPanel>
      </Box>

      <>
        <Dialog open={confirmationDialogOpen} onClose={closeConfirmationDialog}>
          <DialogTitle>Confirmação</DialogTitle>
          <DialogContent>
            <Typography>
              Tem certeza de que deseja excluir este documento?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeConfirmationDialog} color="primary">
              Cancelar
            </Button>
            <Button onClick={() => confirmDelete(selectedFile)}>OK</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={multipleDeletionDialogOpen}
          onClose={closeMultipleDeletionDialog}
        >
          <DialogTitle>Confirmação de Deleção Múltipla</DialogTitle>
          <DialogContent>
            <Typography>
              Confirma a deleção de {selectedImages.length} documentos?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeMultipleDeletionDialog} color="primary">
              Cancelar
            </Button>
            <Button
              onClick={() => confirmDeleteMultiple(selectedImages)}
              color="secondary"
            >
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={viewDialogOpen}
          onClose={closeViewDialog}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Visualização do Orçamento</DialogTitle>
          <DialogContent>
            <Box style={{ height: "600px" }}>
              <Worker
                workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
              >
                <Viewer fileUrl={pdfUrl} />
              </Worker>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeViewDialog} color="primary">
              Fechar
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </>
  );
}
