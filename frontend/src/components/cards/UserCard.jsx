/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";
import { toast } from "react-toastify";

import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  Dialog,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import UserTableActions from "../small/buttons/tableActionButtons/UserTableActions";

import EditUserForm from "../../forms/edit/EditUserForm";
import ViewUserDetails from "../../forms/misc/ViewUserDetails";

export default function UserCard({
  user,
  departments,
  positions,
  type,
  refreshData,
  setRefreshData,
  configData,
  userId,
}) {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDetails, setOpenDetails] = React.useState(false);

  return (
    <Card sx={{ maxWidth: 290 }} elevation={3}>
      <Avatar
        sx={{
          width: 100,
          height: 100,
          margin: "auto",
          mt: 2,
        }}
        src={
          user.image
            ? `http://localhost:3000/static/${user.image}`
            : `http://localhost:3000/static/images/default_userPicture.png`
        }
        alt={user.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h6">
          {user.name}
        </Typography>
        <Typography gutterBottom variant="body1">
          {user.phone}
        </Typography>
        <Typography variant="body2">{user.email}</Typography>
        <Grid container direction="row" alignItems="center" sx={{ mt: 1 }}>
          <Paper
            elevation={0}
            sx={{
              mr: 0.5,
              mb: 0.5,
              width: 9,
              height: 9,
              borderRadius: 50,
              backgroundColor: user.department.color,
            }}
          />
          <Typography variant="body2">
            {user.department ? user.department.name : "-"}
          </Typography>
        </Grid>
        <Typography variant="body2">
          {user.position ? user.position.name : "-"}
        </Typography>
      </CardContent>
      <CardActions>
        <Grid container justifyContent="center">
          <UserTableActions
            fromCard
            userId={userId}
            userIsActive={user.isActive}
            configData={configData}
            setOpenEdit={setOpenEdit}
            setOpenDetails={setOpenDetails}
            selectedItem={user}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
          />
        </Grid>
      </CardActions>
      {openEdit && type === "user" && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openEdit}
          onClose={() => setOpenEdit(!openEdit)}
        >
          <EditUserForm
            userId={userId}
            openEdit={openEdit}
            selectedUser={user}
            departments={departments}
            positions={positions}
            setOpenEdit={setOpenEdit}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}
      {openDetails && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openDetails}
          onClose={() => setOpenDetails(!openDetails)}
        >
          <ViewUserDetails
            selectedUser={user}
            setOpenDetails={setOpenDetails}
          />
        </Dialog>
      )}
    </Card>
  );
}
