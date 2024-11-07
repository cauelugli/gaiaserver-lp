/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { Avatar, Tooltip, Badge, Box, InputLabel } from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const MembersTableCell = (props) => {
  const { isEditing, fields, handleMemberChange } = props;

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
    }
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
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, my: 1 }}>
        {memberList.map((member) => (
          <Box key={member._id}>
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
                  sx={{ width: 40, height: 40 }}
                />
              </Badge>
            </Tooltip>
          </Box>
        ))}
      </Box>

      <InputLabel>Adicionar Membro</InputLabel>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, my: 1 }}>
        {options
          .filter(
            (option) => !memberList.some((member) => member._id === option._id)
          )
          .map((option) => (
            <Box key={option._id} onClick={() => handleAddMember(option)}>
              <Tooltip title={`Adicionar ${option.name}`}>
                <Avatar
                  alt={option.name}
                  src={`http://localhost:3000/static/${option.image}`}
                  sx={{ width: 40, height: 40, cursor: "pointer" }}
                />
              </Tooltip>
            </Box>
          ))}
      </Box>
    </>
  );
};

export default MembersTableCell;
