/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import {
  Avatar,
  Grid,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  OutlinedInput,
  Tooltip,
} from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const MembersTableCell = (props) => {
  const [options, setOptions] = React.useState([]);

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

  const [memberList, setMemberList] = React.useState(props.selectedMembers);

  return (
    <>
      <InputLabel>Membros</InputLabel>
      <Select
        sx={{ width: 200 }}
        size="small"
        multiple
        value={memberList}
        onChange={(event) => {
          const selectedMembers = event.target.value;
          setMemberList(selectedMembers);
          props.handleMemberChange(selectedMembers);
        }}
        input={<OutlinedInput />}
        renderValue={(selected) => (
          <Grid container spacing={1}>
            {selected.map((member) => (
              <Grid item key={member._id}>
                <Tooltip title={member.name}>
                  <Avatar
                    alt="Imagem"
                    src={`http://localhost:3000/static/${member.image}`}
                    sx={{ width: 24, height: 24 }}
                  />
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        )}
      >
        {options.map((option, index) => (
          <MenuItem value={option} key={index}>
            <Grid container direction="row" alignItems="center">
              <Avatar
                alt="Imagem"
                src={`http://localhost:3000/static/${option.image}`}
                sx={{ width: 24, height: 24, marginRight: 2 }}
              />
              <Typography>{option.name}</Typography>
            </Grid>
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default MembersTableCell;
