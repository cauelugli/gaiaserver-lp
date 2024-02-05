/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";

import {
  Avatar,
  Badge,
  Typography,
  Checkbox,
  Select,
  MenuItem,
  ListItemText,
  IconButton,
  Popover,
  Tooltip,
  Grid,
  Button,
} from "@mui/material";

import BuildIcon from "@mui/icons-material/Build";

export default function MultipleServicesSelect({
  services,
  handleClickServices,
  index,
  openedPopoverServicesIndex,
  anchorElArray,
  handleClose,
  allocatedServicesForTask,
  setNewTaskServices,
}) {
  const [selectedServices, setSelectedServices] = React.useState([]);

  React.useEffect(() => {
    setSelectedServices(allocatedServicesForTask || []);
  }, [allocatedServicesForTask]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedServices(value);
    setNewTaskServices(value);
  };

  return (
    <Grid>
      <Tooltip title={<Typography sx={{ fontSize: 12 }}>Serviços</Typography>}>
        <Badge
          key
          color={selectedServices.length === 0 ? "error" : "success"}
          overlap="circular"
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          variant="dot"
        >
          <IconButton onClick={(event) => handleClickServices(event, index)}>
            <Avatar sx={{ mt: 0.5, width: 32, height: 32 }}>
              <BuildIcon />
            </Avatar>
          </IconButton>
        </Badge>
      </Tooltip>
      <Popover
        elevation={0}
        open={
          openedPopoverServicesIndex === index &&
          anchorElArray[index] !== undefined
        }
        anchorEl={anchorElArray[index]}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        disableRestoreFocus
      >
        <Grid sx={{ p: 2, border: "1px solid #555", height: 350 }}>
          <Select
            multiple
            value={selectedServices}
            onChange={handleChange}
            displayEmpty
            renderValue={() => {
              return <Typography> Escolha os Serviços</Typography>;
            }}
          >
            {services.map((service) => (
              <MenuItem key={service} value={service} sx={{ p: 0 }}>
                <Checkbox checked={selectedServices.indexOf(service) > -1} />
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: 13 }}>
                      {service.name}
                    </Typography>
                  }
                />
              </MenuItem>
            ))}
          </Select>
          <Grid container direction="column">
            {selectedServices.map((service) => (
              <Typography key sx={{ mt: 1 }}>
                • {service.name}
              </Typography>
            ))}
          </Grid>
          {selectedServices.length > 0 && (
            <Button
              onClick={handleClose}
              variant="contained"
              color="success"
              size="small"
              sx={{ ml: "70%", mt: 1 }}
            >
              OK
            </Button>
          )}
        </Grid>
      </Popover>
    </Grid>
  );
}
