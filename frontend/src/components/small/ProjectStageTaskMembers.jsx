/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Avatar,
  Button,
  Checkbox,
  Grid,
  IconButton,
  Paper,
  Popover,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";

const ProjectStageTaskMembers = ({
  handleClick,
  setNewTaskAssignees,
  allocatedMembersForTask,
  index,
  title,
  openedPopoverIndex,
  anchorElArray,
  handleClose,
  members,
}) => {
  const [selectedMembers, setSelectedMembers] = React.useState([]);

  React.useEffect(() => {
    setSelectedMembers(allocatedMembersForTask || []);
  }, [allocatedMembersForTask]);

  const handleAddMember = (member) => {
    setSelectedMembers((prevSelectedMembers) => [
      ...prevSelectedMembers,
      member,
    ]);
    setNewTaskAssignees((prevSelectedMembers) => [
      ...prevSelectedMembers,
      member,
    ]);
  };

  const handleRemoveMember = (member) => {
    setSelectedMembers((prevSelectedMembers) =>
      prevSelectedMembers.filter((m) => m !== member)
    );
    setNewTaskAssignees((prevSelectedMembers) =>
      prevSelectedMembers.filter((m) => m !== member)
    );
  };

  return (
    <>
      <Tooltip
        title={<Typography sx={{ fontSize: 12 }}>Designados</Typography>}
      >
        <IconButton onClick={(event) => handleClick(event, index)}>
          <Avatar sx={{ width: 32, height: 32 }} />
        </IconButton>
      </Tooltip>
      <Popover
        elevation={0}
        open={
          openedPopoverIndex === index && anchorElArray[index] !== undefined
        }
        anchorEl={anchorElArray[index]}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        disableRestoreFocus
      >
        <Grid sx={{ p: 2, border: "1px solid #555" }}>
          <Grid container direction="row">
            <Typography sx={{ fontSize: 14 }}>
              Alocar Membros para a Tarefa&nbsp;
            </Typography>
            <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>
              {title || `Sem título`}
            </Typography>
          </Grid>
          <Grid
            sx={{
              p: 1,
              border: "1px solid #555",
              borderRadius: 1,
              height: 150,
              overflow: "auto",
            }}
          >
            <Typography sx={{ fontSize: 13, color: "#555" }}>
              Disponíveis
            </Typography>
            {members.map((member, index) => {
              const isMemberAllocated = selectedMembers.some(
                (allocatedMember) => allocatedMember.id === member.id
              );

              if (!isMemberAllocated) {
                return (
                  <Grid
                    key={index}
                    container
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    sx={{ mx: 1, mb: 1 }}
                  >
                    <Avatar
                      alt="Imagem do Colaborador"
                      src={`http://localhost:3000/static/${member.image}`}
                      sx={{ width: 24, height: 24 }}
                    />
                    <Typography sx={{ mx: 0.5, fontSize: 13 }}>
                      {member.name}
                    </Typography>
                    <IconButton
                      sx={{
                        height: 18,
                        maxWidth: 18,
                        color: "white",
                        backgroundColor: "green",
                        borderRadius: 3,
                        "&:hover": {
                          color: "white",
                          backgroundColor: "green",
                        },
                      }}
                      onClick={() => handleAddMember(member)}
                    >
                      <Typography sx={{ fontWeight: "bold" }}>+</Typography>
                    </IconButton>
                  </Grid>
                );
              }
              return null;
            })}
          </Grid>
          <Grid id="phantomDiv" sx={{ my: 1 }} />
          <Grid
            sx={{
              p: 1,
              border: "1px solid #555",
              borderRadius: 1,
              height: 150,
              overflow: "auto",
            }}
          >
            <Typography sx={{ fontSize: 13, color: "#555" }}>
              Alocados
            </Typography>
            {selectedMembers.map((member, index) => (
              <Grid
                key={index}
                container
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{ mx: 1, mb: 1 }}
              >
                <Avatar
                  alt="Imagem do Colaborador"
                  src={`http://localhost:3000/static/${member.image}`}
                  sx={{ width: 24, height: 24 }}
                />
                <Typography sx={{ mx: 0.5, fontSize: 13 }}>
                  {member.name}
                </Typography>
                <IconButton
                  sx={{
                    height: 18,
                    maxWidth: 18,
                    color: "white",
                    backgroundColor: "red",
                    borderRadius: 3,
                    "&:hover": {
                      color: "white",
                      backgroundColor: "red",
                    },
                  }}
                  onClick={() => handleRemoveMember(member)}
                >
                  <Typography sx={{ fontWeight: "bold" }}>-</Typography>
                </IconButton>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Popover>
    </>
  );
};

export default ProjectStageTaskMembers;
