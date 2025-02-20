/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Avatar, Grid2, Typography } from "@mui/material";

const GroupMembers = ({ members, users, managers }) => {
  const allUsers = [...users, ...managers];
  const [userDetails, setUserDetails] = React.useState({});

  React.useEffect(() => {
    const fetchUserDetails = async () => {
      const details = {};
      for (const member of members) {
        const user = allUsers.find(
          (user) => user._id.toString() === member._id.toString()
        );
        if (user) {
          details[member._id] = user;
        }
      }
      setUserDetails(details);
    };

    fetchUserDetails();
  }, [members]);

  const displayedMembers = members.slice(0, 6);
  const remainingMembersCount = members.length - displayedMembers.length;

  return (
    <Grid2 container direction="row" alignItems="center" justifyContent="center">
      {displayedMembers.map((member) => {
        const user = userDetails[member._id];
        if (user) {
          return (
            <Avatar
              key={user._id}
              alt={user.name}
              src={`http://localhost:3000/static/${user.image}`}
              sx={{ width: 30, height: 30, ml: 0.5 }}
            />
          );
        } else {
          return null;
        }
      })}
      {remainingMembersCount > 0 && (
        <Typography sx={{ fontSize: 13, ml: 0.5 }}>
          ...+{remainingMembersCount}
        </Typography>
      )}
    </Grid2>
  );
};

export default GroupMembers;
