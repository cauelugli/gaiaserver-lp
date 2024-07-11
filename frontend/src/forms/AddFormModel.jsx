/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import { toast } from "react-toastify";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  Avatar,
  Box,
  Button,
  DialogActions,
  DialogContent,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import DialogHeader from "../components/small/DialogHeader";
import FormEndLineTenant from "../components/small/FormEndLineTenant";

export default function AddFormModel(props) {
  // const [name, setName] = React.useState("");
  const [image, setImage] = React.useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/roles", {
        name,
      });
      if (res.data) {
        toast.success("Perfil de Acesso Adicionado!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
      props.setOpenAdd(!!props.openAdd);
      !props.setRefreshData(!props.refreshData);
    } catch (err) {
      if (
        (err.response && err.response.status === 422) ||
        err.response.status === 420
      ) {
        toast.error(err.response.data.error, {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      } else {
        toast.error("Houve algum erro...", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      }
    }
  };

  const modalOptions = props.options.find(
    (option) => option.label === props.selectedOptionLabel
  ).modal;

  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <form onSubmit={handleAdd}>
      <DialogHeader
        title={modalOptions.label}
        femaleGender={modalOptions.femaleGender}
        extraSmall
      />
      <DialogContent>
        {modalOptions.fieldsSections.map((section, sectionIndex) => (
          <Box key={sectionIndex} sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: 16, fontWeight: "bold", mb: 0.5 }}>
              {section.name !== "image" && section.label}
            </Typography>
            {section.name === "image" && (
              <Grid item>
                <Grid
                  container
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <input
                    type="file"
                    accept="image/*"
                    id="fileInput"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const selectedImage = e.target.files[0];
                      setImage(selectedImage);
                    }}
                  />
                  <label htmlFor="fileInput">
                    <Avatar
                      alt="Imagem do Usuário"
                      value={image}
                      sx={{ width: 80, height: 80, cursor: "pointer" }}
                      onClick={handleImageClick}
                    >
                      {image ? (
                        <img
                          src={URL.createObjectURL(image)}
                          alt="Prévia da Imagem"
                          style={{ width: "100%", height: "100%" }}
                        />
                      ) : null}
                    </Avatar>
                  </label>
                  {image && (
                    <FormHelperText>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => setImage("")}
                        sx={{ mt: 1 }}
                      >
                        Remover
                      </Button>
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
            )}
            <Grid container direction="row">
              {modalOptions.fields
                .filter(
                  (field) =>
                    field.fieldSection ===
                    modalOptions.fieldsSections[sectionIndex].name
                )
                .map((field, fieldIndex) => (
                  <Grid key={fieldIndex} item sx={{ mr: 1 }}>
                    <Typography sx={{ fontSize: 14 }}>{field.label}</Typography>
                    {field.type === "string" && (
                      <TextField
                        // value={name}
                        // onChange={(e) => setName(e.target.value)}
                        sx={{ width: 200 }}
                        size="small"
                        required={field.required}
                      />
                    )}

                    {field.type === "select" && (
                      <Select
                        sx={{ width: 200 }}
                        size="small"
                        required={field.required}
                        // value={firstOption}
                        // onChange={(e) => handleSelectedFirstOption(e)}
                      >
                        {field.options.map((option, index) => (
                          <MenuItem value={option} key={index}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                    {field.type === "date" && (
                      <TextField
                        // value={name}
                        // onChange={(e) => setName(e.target.value)}
                        sx={{ width: 200 }}
                        size="small"
                        required={field.required}
                      />
                    )}
                  </Grid>
                ))}
            </Grid>
          </Box>
        ))}
      </DialogContent>
      <FormEndLineTenant
        configCustomization={props.configCustomization}
        extraSmall
      />
      <DialogActions>
        <Button type="submit" variant="contained" color="success">
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
