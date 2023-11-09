import * as React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Worker, Viewer } from "@react-pdf-viewer/core";

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
import VisibilityIcon from "@mui/icons-material/Visibility";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default function DocumentTable() {
  const [files, setFiles] = React.useState([]);
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
      const response = await api.get("/uploads/listDocs");
      setFiles(response.data.docs);
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
      const response = await api.delete(`/uploads/deleteFile/${filename}`);
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
      const response = await api.post("/uploads/deleteMultipleFiles", {
        files: imagesToDelete,
      });

      if (response.status === 200) {
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

  return (
    <>
      <Box sx={{ minWidth: "1050px" }}>
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
          {files.map((file) => {
            return (
              <Grid key={file._id} item xs={2}>
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
                <Grid container direction="row" sx={{ ml: 2 }}>
                  <Checkbox
                    checked={selectedImages.includes(file)}
                    onChange={() => handleCheckboxChange(file)}
                    sx={{ p: 0, m: 0 }}
                  />
                  <VisibilityIcon
                    color="inherit"
                    onClick={() => openViewDialog(file)}
                    sx={{ mx: 1, py: 0 }}
                    style={{ cursor: "pointer" }}
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
            Confirma deletar {selectedImages.length} imagem(s)?
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
  );
}
