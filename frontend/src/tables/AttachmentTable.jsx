/* eslint-disable react/prop-types */
import * as React from "react";
import axios from "axios";
import { toast } from "react-toastify";

import {
  Box,
  Button,
  Checkbox,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";

import NoDataText from "../components/small/NoDataText";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function AttachmentTable({ topBar }) {
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
      const response = await api.get("/uploads/listAttachments");
      setAttachments(response.data.docs);
      setTotalSpaceOccupiedMB(response.data.totalSpaceMB);
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
      const response = await api.delete(
        `/uploads/deleteAttachment/${filename}`
      );
      if (response.status === 200) {
        toast.error("Arquivo Deletado", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
          icon: <DeleteIcon />,
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
      const response = await api.post("/uploads/deleteMultipleAttachments", {
        files: imagesToDelete,
      });

      if (response.status === 200) {
        toast.error("Arquivos Deletados", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
          icon: <DeleteIcon />,
        });
        fetchFiles();
        closeMultipleDeletionDialog();
        setSelectedImages([]);
      }
    } catch (error) {
      console.error("Erro ao excluir as imagens:", error);
    }
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
      {attachments.length === 0 ? (
        <NoDataText option="Anexos" />
      ) : (
        <>
          <Box sx={{ width: topBar ? "105%" : "100%" }}>
            <Grid container direction="row" sx={{ py: 2 }}>
              <Typography sx={{ my: "auto" }}>
                Tamanho em Disco: {totalSpaceOccupiedMB}MB
              </Typography>
              <Grid item sx={{ mt: -1 }}>
                {selectedImages.length > 0 && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ClearIcon sx={{ mt: -0.5, p: 0 }} />}
                    onClick={() => setSelectedImages([])}
                    sx={{ mx: 1 }}
                  >
                    Limpar Seleção
                  </Button>
                )}
              </Grid>
              <Grid item sx={{ mt: -1 }}>
                {selectedImages.length > 0 && (
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon sx={{ mt: -0.5 }} />}
                    onClick={handleDeleteMultiple}
                  >
                    Excluir Selecionados
                  </Button>
                )}
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              {attachments.map((file) => {
                return (
                  <Grid key={file._id} item xs={2}>
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
                    <Grid container direction="row" sx={{ ml: 2 }}>
                      <Checkbox
                        checked={selectedImages.includes(file)}
                        onChange={() => handleCheckboxChange(file)}
                        sx={{ p: 0, m: 0 }}
                      />
                      <DeleteIcon
                        color="error"
                        onClick={() => deleteFile(file)}
                        style={{ cursor: "pointer" }}
                      />
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </>
      )}

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
    </>
  );
}
