/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";

import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";

export default function ProjectCard({ project }) {
  return (
    <Card elevation={3}>
      <CardContent>
        <Grid container direction="column">
          <>
            <Typography variant="h6" sx={{ fontWeight: "bold", mt: 0.5 }}>
              {project.name}
            </Typography>
            <Grid sx={{ my: 1 }}>
              <Typography sx={{ fontSize: 13 }}>
                Membros ({project.members.length})
              </Typography>
              {project.members.length !== 0 && (
                <Grid container direction="row" alignItems="center">
                  {project.members.map((member) => (
                    <Tooltip key title={member.name}>
                      <Avatar
                        alt="Imagem"
                        src={`http://localhost:3000/static/${member.image}`}
                        sx={{ width: 32, height: 32, mr: 1 }}
                      />
                    </Tooltip>
                  ))}
                </Grid>
              )}
            </Grid>

            <Typography variant="body2" sx={{ mt: 1, fontSize: 13 }}>
              Tipo: {project.type}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, fontSize: 13 }}>
              Cliente: {project.customer.name}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, fontSize: 13 }}>
              <Grid container direction="row" alignItems="center">
                Fase Atual:
                <Paper
                  elevation={0}
                  sx={{
                    mx: 0.5,
                    mb: 0.5,
                    width: 9,
                    height: 9,
                    borderRadius: 50,
                    backgroundColor:
                      project.definedStagesColors[0] !== null
                        ? project.definedStagesColors[project.currentStage]
                        : "black",
                  }}
                />
                {project.stages.length > project.currentStage
                  ? `${project.stages[project.currentStage].title}
                                  (${project.currentStage + 1}/${
                      project.stages.length
                    })`
                  : "Resolvido"}
              </Grid>
            </Typography>
            <Typography sx={{ mt: 1, fontSize: 13 }}>
              Criador: {project.creator.name}
            </Typography>
            <Typography sx={{ mt: 1, fontSize: 13 }}>
              Status: {project.status}
            </Typography>
          </>
        </Grid>
      </CardContent>
      <CardActions sx={{ mt: -1 }}>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}
