/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";

import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import ServiceTableActions from "../small/buttons/tableActionButtons/ServiceTableActions";
import EditServiceForm from "../../forms/edit/EditServiceForm";

export default function ServiceCard({
  configData,
  service,
  servicePlan,
  refreshData,
  setRefreshData,
  departments,
  stockItems,
  toast,
  userId,
}) {
  const [openEdit, setOpenEdit] = React.useState(false);

  return (
    <Card elevation={3}>
      <CardContent>
        <>
          {service && (
            <Grid container direction="column">
              <Grid>
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      mr: 1,
                      width: 18,
                      height: 18,
                      borderRadius: 50,
                      backgroundColor: service.color,
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: "bold", mt: 0.5 }}>
                    {service.name}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                alignItems="center"
                sx={{ mt: 1 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    mr: 0.5,
                    mb: 0.5,
                    width: 9,
                    height: 9,
                    borderRadius: 50,
                    backgroundColor: service.department.color,
                  }}
                />
                <Typography variant="body2" gutterBottom>
                  {service.department.name}
                </Typography>
              </Grid>
              <Grid item>
                <Grid container>
                  {service.materials.length !== 0 &&
                    service.materials.map((material) => (
                      <Grid
                        key
                        direction="column"
                        alignItems="center"
                        sx={{ mr: 1 }}
                      >
                        <Avatar
                          alt="Imagem do Produto"
                          src={`http://localhost:3000/static/${material.image}`}
                          sx={{ width: 30, height: 30, mx: "auto" }}
                        />
                        <Typography sx={{ fontSize: 11 }}>
                          x{material.quantity} {material.name}
                        </Typography>
                      </Grid>
                    ))}
                </Grid>
              </Grid>
              <Grid sx={{ mt: 2 }} container direction="column">
                <Grid item>
                  <Typography variant="body2">
                    Valor do Serviço: R${service.value.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    Valor dos Materiais: R${service.materialsCost.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Valor Total: R$
                    {service.materialsCost
                      ? (service.materialsCost + service.value).toFixed(2)
                      : service.value.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          )}
          {servicePlan && (
            <>
              <Typography gutterBottom variant="h6">
                {servicePlan.name}
              </Typography>
            </>
          )}
        </>
      </CardContent>
      {service && (
        <CardActions sx={{ mt: -1 }}>
          <Grid container justifyContent="center">
            <ServiceTableActions
              userId={userId}
              configData={configData}
              setOpenEdit={setOpenEdit}
              selectedItem={service}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
            />
          </Grid>
        </CardActions>
      )}
      {openEdit && service && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openEdit}
          onClose={() => setOpenEdit(!openEdit)}
        >
          <EditServiceForm
            userId={userId}
            openEdit={openEdit}
            selectedService={service}
            previousMaterials={service.materials}
            departments={departments}
            stockItems={stockItems}
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
