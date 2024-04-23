/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";
import dayjs from "dayjs";

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

export default function DepartmentCard({ department, group, users }) {
  console.log("users", users);
  return (
    <Card sx={{ width: 290, height: 300 }} elevation={3}>
      <CardContent>
        {/* title */}
        {department && (
          <>
            <Grid container direction="row" alignItems="center" sx={{ my: 1 }}>
              <Paper
                elevation={0}
                sx={{
                  m: 1,
                  width: 18,
                  height: 18,
                  borderRadius: 50,
                  backgroundColor: department.color,
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {department.name}
              </Typography>
            </Grid>
            <Typography variant="body1">{department.email}</Typography>
            <Typography variant="body2">{department.phone}</Typography>
          </>
        )}

        {group && (
          <Typography variant="h6" sx={{ my: 1, fontWeight: "bold" }}>
            {group.name}
          </Typography>
        )}
        {/* title */}
        {/* content */}

        {department && (
          <>
            {department.manager && (
              <Grid sx={{ mt: 1.5 }}>
                <Typography sx={{ fontSize: 13 }}>Gerência</Typography>
                <Grid container direction="row" alignItems="center">
                  <Tooltip key title={department.manager.name}>
                    <Avatar
                      alt="Imagem"
                      src={`http://localhost:3000/static/${department.manager.image}`}
                      sx={{ width: 32, height: 32, mr: 1 }}
                    />
                  </Tooltip>
                </Grid>
              </Grid>
            )}
            <Grid sx={{ mt: 1.5 }}>
              <Typography sx={{ fontSize: 13 }}>
                Membros ({department.members.length})
              </Typography>
              {department.members.length !== 0 && (
                <Grid container direction="row" alignItems="center">
                  {department.members.map((member) => (
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
          </>
        )}
        {group && (
          <Grid sx={{ mt: 1.5 }}>
            <Typography sx={{ fontSize: 13 }}>
              Membros ({group.members.length})
            </Typography>
            {group.members.length !== 0 && (
              <Grid container direction="row" alignItems="center">
                {group.members.map((member) => {
                  const memberUser = users.find(
                    (user) => user._id === member._id
                  );
                  return (
                    <Tooltip key={member._id} title={member.name}>
                      <Avatar
                        alt="Imagem"
                        src={`http://localhost:3000/static/${memberUser?.image}`}
                        sx={{ width: 32, height: 32, mr: 1 }}
                      />
                    </Tooltip>
                  );
                })}
              </Grid>
            )}
          </Grid>
        )}

        {/* content */}
      </CardContent>
      <CardActions sx={{ mt: -1 }}>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}
