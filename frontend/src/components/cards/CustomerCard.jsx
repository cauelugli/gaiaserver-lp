/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";
import { toast } from "react-toastify";

import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  Grid,
  Typography,
} from "@mui/material";

import CustomerTableActions from "../small/buttons/tableActionButtons/CustomerTableActions";
import ViewDialog from "../small/ViewDialog";
import EditClientForm from "../../forms/edit/EditClientForm";
import EditCustomerForm from "../../forms/edit/EditCustomerForm";

export default function CustomerCard({
  customer,
  type,
  userName,
  configData,
  configAgenda,
  configNotifications,
  configNotificationsBooleans,
  refreshData,
  setRefreshData,
}) {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openViewDialog, setOpenViewDialog] = React.useState(false);

  return (
    <Card elevation={3}>
      {type === "client" ? (
        <Avatar
          sx={{
            width: 100,
            height: 100,
            margin: "auto",
            mt: 2,
          }}
          src={
            customer.image
              ? `http://localhost:3000/static/${customer.image}`
              : `http://localhost:3000/static/images/default_userPicture.png`
          }
        />
      ) : (
        <CardMedia
          sx={{
            height: 100,
            width: "100%",
            objectFit: "contain",
          }}
          image={
            customer.image
              ? `http://localhost:3000/static/${customer.image}`
              : `http://localhost:3000/static/images/default_userPicture.png`
          }
          component="img"
        />
      )}

      <CardContent>
        <Typography gutterBottom variant="h6">
          {customer.name}
        </Typography>
        <Typography gutterBottom variant="body1">
          {customer.phone}
        </Typography>
        {type === "customer" ? (
          <>
            <Typography variant="body2">
              {customer.mainContactName} ({customer.mainContactPosition})
            </Typography>
            <Typography variant="body2">{customer.mainContactEmail}</Typography>
          </>
        ) : (
          <>
            <Typography variant="body2">{customer.email}</Typography>
          </>
        )}
      </CardContent>
      <CardActions>
        <Grid container justifyContent="center">
          <CustomerTableActions
            userName={userName}
            customer={customer}
            selectedItem={customer}
            configAgenda={configAgenda}
            configNotifications={configNotifications}
            configNotificationsBooleans={configNotificationsBooleans}
            setOpenEdit={setOpenEdit}
            setOpenViewDialog={setOpenViewDialog}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            fromCard
          />
        </Grid>
      </CardActions>
      {openViewDialog && (
        <Dialog
          open={openViewDialog}
          onClose={() => setOpenViewDialog(false)}
          fullWidth
          maxWidth="lg"
        >
          <ViewDialog
            setOpenViewDialog={setOpenViewDialog}
            selectedItem={customer.recentRequests}
            list
            listTitle="do Cliente"
            search
          />
        </Dialog>
      )}
      {openEdit && type === "client" && (
        <Dialog
          fullWidth
          maxWidth="xs"
          open={openEdit}
          onClose={() => setOpenEdit(!openEdit)}
        >
          <EditClientForm
            openEdit={openEdit}
            selectedClient={customer}
            setOpenEdit={setOpenEdit}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}
      {openEdit && type === "customer" && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openEdit}
          onClose={() => setOpenEdit(!openEdit)}
        >
          <EditCustomerForm
            openEdit={openEdit}
            config={configData}
            selectedCustomer={customer}
            setOpenEdit={setOpenEdit}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}
    </Card>
  );
}
