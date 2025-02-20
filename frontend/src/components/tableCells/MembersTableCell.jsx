/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { Avatar, Tooltip, Badge, Box, InputLabel, Grid2 } from "@mui/material";
import { useAppData } from "../../../src/AppDataContext";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const MembersTableCell = (props) => {
  const appData = useAppData();
  const idIndexList = appData.idIndexList;
  const { isEditing, fields, handleMemberChange, targetId } = props;

  const [options, setOptions] = React.useState([]);
  const [memberList, setMemberList] = React.useState(
    props.selectedMembers || []
  );

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await api.get("/get", {
          params: { model: "User" },
        });
        setOptions(users.data.filter((user) => !user.isManager));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    if (isEditing && fields["members"] && fields["members"].length > 0) {
      setMemberList(fields["members"]);
      props.handleMemberChange(fields["members"]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, fields]);

  const handleAddMember = (member) => {
    if (!memberList.some((m) => m._id === member._id)) {
      const updatedMembers = [...memberList, member];
      setMemberList(updatedMembers);
      handleMemberChange(updatedMembers);
    }
  };

  const handleRemoveMember = (member) => {
    const updatedMembers = memberList.filter((m) => m._id !== member._id);
    setMemberList(updatedMembers);
    handleMemberChange(updatedMembers);
  };

  return (
    <>
      <InputLabel>Membros</InputLabel>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          mb: 1,
          px: 1,
          border: "1px solid #aaa",
          borderRadius: 1,
          height: 38,
          minWidth: 200,
          maxWidth: 400,
        }}
      >
        <Grid2
          container
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
        >
          {memberList.map((member, index) => (
            <Box key={index} sx={{ mr: 1 }}>
              <Tooltip title={`Remover ${member.name}`}>
                <Badge
                  badgeContent="X"
                  color="error"
                  onClick={() => handleRemoveMember(member)}
                  sx={{
                    cursor: "pointer",
                    "& .MuiBadge-dot": {
                      cursor: "pointer",
                      backgroundColor: "red",
                    },
                  }}
                >
                  <Avatar
                    alt={member.name}
                    src={`http://localhost:3000/static/${member.image}`}
                    sx={{ width: 28, height: 28 }}
                  />
                </Badge>
              </Tooltip>
            </Box>
          ))}
        </Grid2>
      </Box>

      <InputLabel>Adicionar Membro</InputLabel>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          mb: 1,
          px: 1,
          border: "1px solid #aaa",
          borderRadius: 1,
          minHeight: 38,
          maxHeight: 76,
          minWidth: 200,
          maxWidth: 400,
        }}
      >
        <Grid2
          container
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
        >
          {options
            .filter(
              (option) =>
                !memberList.some((member) => member._id === option._id)
            )
            .map((option, index) => (
              <Box
                key={index}
                onClick={() =>
                  !option.department ||
                  option.department === "" ||
                  option.department === targetId
                    ? handleAddMember(option)
                    : ""
                }
                sx={{ mr: 1 }}
              >
                <Tooltip
                  title={
                    option.department
                      ? option.department !== ""
                        ? option.department === targetId
                          ? `Adicionar ${option.name}`
                          : `Alocado em ${
                              idIndexList.find(
                                (item) => item.id === option.department
                              )?.name || ""
                            }`
                        : `Adicionar ${option.name}`
                      : `Adicionar ${option.name}`
                  }
                >
                  <Avatar
                    alt={option.name}
                    src={`http://localhost:3000/static/${option.image}`}
                    sx={{
                      width: 28,
                      height: 28,
                      cursor: "pointer",
                      filter: option.department
                        ? option.department === targetId
                          ? "none"
                          : "grayscale(100%)"
                        : "grayscale(100%)",
                    }}
                  />
                </Tooltip>
              </Box>
            ))}
        </Grid2>
      </Box>
    </>
  );
};

export default MembersTableCell;
