/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  Avatar,
  Grid,
  MenuItem,
  Select,
  Typography,
  // Chip,
  InputLabel,
} from "@mui/material";

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

  // const renderValue = (selected) => {
  //   if (selected) {
  //     return (
  //       <div style={{ display: "flex", flexWrap: "wrap" }}>
  //         {props
  //           ? props.fields[props.field.name].map((value, index) =>
  //               value ? (
  //                 <Chip
  //                   size="small"
  //                   key={index}
  //                   label={value.name}
  //                   sx={{ mr: 1 }}
  //                 />
  //               ) : null
  //             )
  //           : selected.map((value, index) => (
  //               <Chip
  //                 size="small"
  //                 key={index}
  //                 label={value.name}
  //                 style={{ margin: 2 }}
  //               />
  //             ))}
  //       </div>
  //     );
  //   }
  // };

  return (
    <>
      <InputLabel>Membros</InputLabel>
      <Select
        value={props.selectedMembers}
        onChange={props.handleChange}
        sx={{ width: 200 }}
        size="small"
        multiple
      >
        {options.map((option, index) => (
          <MenuItem
            value={option}
            key={index}
          >
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
