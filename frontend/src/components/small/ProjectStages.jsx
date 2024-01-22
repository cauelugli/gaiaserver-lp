/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import dayjs from "dayjs";

import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Popover,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";

const ProjectStages = () => {
  const [colorSchema, setColorSchema] = useState(0);
  const [stages, setStages] = useState(1);
  const [stagesList, setStagesList] = useState([
    {
      title: "",
      startAt: dayjs(),
      dueTo: dayjs(),
    },
  ]);

  const [colorPopoverAnchorEl, setColorPopoverAnchorEl] = useState(null);
  const colorPopoverOpen = Boolean(colorPopoverAnchorEl);

  const handleColorClick = (event) => {
    setColorPopoverAnchorEl(event.currentTarget);
  };
  const handleColorClose = () => {
    setColorPopoverAnchorEl(null);
  };

  const handleStagesChange = (newStages) => {
    setStages(newStages);
    const newStagesList = Array.from({ length: newStages }, (_, index) => {
      return (
        stagesList[index] || {
          title: "",
          startAt: dayjs(),
          dueTo: dayjs(),
          expanded: false,
        }
      );
    });
    setStagesList(newStagesList);
  };

  const handleStageChange = (index, field, value) => {
    const newStagesList = [...stagesList];
    newStagesList[index][field] = value;
    setStagesList(newStagesList);
  };

  const handleExpandClick = (index) => {
    const newStagesList = [...stagesList];
    newStagesList[index].expanded = !newStagesList[index].expanded;
    setStagesList(newStagesList);
  };

  const normalColors = [
    "#ff0000",
    "#ff3300",
    "#ff6600",
    "#ff9900",
    "#ffcc00",
    "#ffff00",
    "#ccff00",
    "#99ff00",
    "#66ff00",
    "#33ff00",
  ];

  const pastelColors = [
    "#ff5555",
    "#ff8855",
    "#ffbb55",
    "#ffdd55",
    "#ffff55",
    "#ccff55",
    "#99ff55",
    "#66ff55",
    "#33ff55",
    "#00ff55",
  ];

  const renderColorGrid = (colors) => (
    <Grid container spacing={0.3} sx={{ mt: 1 }}>
      {colors.map((color, index) => (
        <Grid key={index} item>
          <div
            style={{
              width: 16,
              height: 16,
              backgroundColor: color,
              border: "1px solid #aaa",
              borderRadius: 3,
            }}
          />
        </Grid>
      ))}
    </Grid>
  );

  const renderCardHeader = (index, title) => {
    const backgroundColor =
      colorSchema !== 0
        ? (colorSchema === 1 ? normalColors : pastelColors)[index]
        : undefined;
    return (
      <CardHeader
        title={
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography sx={{ fontSize: 18 }}>
              {title ? title : `Etapa #${index + 1}`}
            </Typography>
            <IconButton>
              <ExpandMoreIcon />
            </IconButton>
          </Grid>
        }
        sx={{ backgroundColor: backgroundColor }}
      />
    );
  };

  return (
    <>
      <Grid>
        <Typography sx={{ textAlign: "center", fontSize: 28 }}>
          Etapas do Projeto X
        </Typography>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{ my: 2 }}
          >
            <Button
              onClick={() => handleStagesChange(stages - 1)}
              disabled={stages === 1}
            >
              <Typography sx={{ fontSize: 22 }}>-</Typography>
            </Button>
            <Typography
              sx={{
                border: "1px solid #666",
                borderRadius: 1,
                p: 2,
                fontSize: 28,
                mx: 1,
              }}
            >
              {stages}
            </Typography>
            <Button
              onClick={() => handleStagesChange(stages + 1)}
              disabled={stages === 10}
            >
              <Typography sx={{ fontSize: 28 }} disabled={stages === 10}>
                +
              </Typography>
            </Button>
          </Grid>
        </Grid>
        <Typography sx={{ textAlign: "center", fontSize: 14 }}>
          <Button
            sx={{ color: "inherit", backgroundColor: "lightgrey" }}
            onClick={handleColorClick}
          >
            Habilitar Cores
          </Button>
          <Popover
            open={colorPopoverOpen}
            anchorEl={colorPopoverAnchorEl}
            onClose={handleColorClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <Grid sx={{ width: 350, height: 150, p: 1 }}>
              <RadioGroup
                value={colorSchema}
                onChange={(e) => setColorSchema(Number(e.target.value))}
              >
                <FormControlLabel
                  value={0}
                  control={<Radio sx={{ mt: -0.25, mr: -0.5 }} />}
                  label={
                    <Typography sx={{ fontSize: 13 }}>Desabilitado</Typography>
                  }
                />

                <FormControlLabel
                  value={1}
                  control={<Radio sx={{ mt: -0.25, mr: -0.5 }} />}
                  label={
                    <Grid container direction="row">
                      <Grid sx={{ m: "auto" }}>
                        <Typography sx={{ fontSize: 13 }}>Padrão</Typography>
                      </Grid>
                      <Grid sx={{ ml: 1, mb: 1 }}>
                        {renderColorGrid(normalColors)}
                      </Grid>
                    </Grid>
                  }
                />
                <FormControlLabel
                  value={2}
                  control={<Radio sx={{ mt: -0.25, mr: -0.5 }} />}
                  label={
                    <Grid container direction="row">
                      <Grid sx={{ m: "auto" }}>
                        <Typography sx={{ fontSize: 13 }}>
                          Tons Pastéis
                        </Typography>
                      </Grid>
                      <Grid sx={{ ml: 1, mb: 1 }}>
                        {renderColorGrid(pastelColors)}
                      </Grid>
                    </Grid>
                  }
                />
              </RadioGroup>
            </Grid>
          </Popover>
        </Typography>
      </Grid>

      <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        alignItems="center"
      >
        {stagesList.map((stage, index) => (
          <Card key={index} sx={{ my: 2, width: 220 }}>
            <CardActionArea onClick={() => handleExpandClick(index)}>
              {renderCardHeader(index, stage.title)}
            </CardActionArea>
            <Collapse in={stage.expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <TextField
                  label="Nome da Etapa"
                  value={stage.title}
                  onChange={(e) =>
                    handleStageChange(index, "title", e.target.value)
                  }
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Início em"
                    value={stage.startAt}
                    format="DD/MM/YYYY"
                    onChange={(date) =>
                      handleStageChange(index, "startAt", date)
                    }
                    renderInput={(params) => <TextField {...params} />}
                    sx={{ my: 2 }}
                  />
                  <DatePicker
                    label="Término"
                    value={stage.dueTo}
                    format="DD/MM/YYYY"
                    onChange={(date) => handleStageChange(index, "dueTo", date)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </CardContent>
            </Collapse>
          </Card>
        ))}
      </Grid>
    </>
  );
};

export default ProjectStages;
