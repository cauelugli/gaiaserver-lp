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
  Tooltip,
  Typography,
} from "@mui/material";

import DepartmentTableActions from "../small/buttons/tableActionButtons/DepartmentTableActions";
import EditDepartmentForm from "../../forms/edit/EditDepartmentForm";
import GroupTableActions from "../small/buttons/tableActionButtons/GroupTableActions";
import EditGroupMembersForm from "../../forms/edit/EditGroupMembersForm";
import EditGroupRenameForm from "../../forms/edit/EditGroupRenameForm";

export default function DepartmentCard({
  configData,
  department,
  group,
  users,
  managers,
  refreshData,
  setRefreshData,
  allUsers
}) {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openRename, setRename] = React.useState(false);
  const [openEditMembers, setOpenEditMembers] = React.useState(false);

  return (
    <Card elevation={3}>
      <CardContent>
        {/* title */}
        {department && (
          <>
            <Grid container direction="row" alignItems="center" sx={{ mb: 1 }}>
              <Paper
                elevation={0}
                sx={{
                  mr: 1,
                  width: 18,
                  height: 18,
                  borderRadius: 50,
                  backgroundColor: department.color,
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: "bold", mt: 0.5 }}>
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
        <Grid container justifyContent="center">
          {department && (
            <DepartmentTableActions
              configData={configData.departments}
              setOpenEdit={setOpenEdit}
              selectedItem={department}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
            />
          )}
          {group && (
            <GroupTableActions
              configData={configData.groups}
              setRename={setRename}
              setOpenEditMembers={setOpenEditMembers}
              selectedItem={group}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
            />
          )}
        </Grid>
      </CardActions>
      {openEdit && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openEdit}
          onClose={() => setOpenEdit(!openEdit)}
        >
          <EditDepartmentForm
            openEdit={openEdit}
            users={users}
            managers={managers}
            selectedDepartment={department}
            setOpenEdit={setOpenEdit}
            setRefreshData={setRefreshData}
            refreshData={refreshData}
            toast={toast}
          />
        </Dialog>
      )}
      {openRename && (
        <Dialog
          fullWidth
          maxWidth="xs"
          open={openRename}
          onClose={() => setRename(!openRename)}
        >
          <EditGroupRenameForm
            setRename={setRename}
            selectedGroup={group}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}
      {openEditMembers && (
        <Dialog
          fullWidth
          maxWidth="xs"
          open={openEditMembers}
          onClose={() => setOpenEditMembers(!openEditMembers)}
        >
          <EditGroupMembersForm
            openEdit={openEditMembers}
            users={allUsers}
            selectedGroup={group}
            setOpenEditMembers={setOpenEditMembers}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}
    </Card>
  );
}
