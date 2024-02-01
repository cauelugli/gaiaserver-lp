/* eslint-disable react/prop-types */
import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 200,
      width: 200,
    },
  },
};

export default function MultipleServicesSelect({
  services,
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
    <div>
      <FormControl sx={{ width: 160 }}>
        <InputLabel>Serviços</InputLabel>
        <Select
          multiple
          value={selectedServices}
          onChange={handleChange}
          input={<OutlinedInput label="Serviços" />}
          renderValue={() => (
            <Typography sx={{ fontSize: 12 }}>
              {selectedServices[0].name}
              {selectedServices.length > 1 &&
                `, ... +${selectedServices.length - 1}`}
            </Typography>
          )}
          MenuProps={MenuProps}
        >
          {services.map((service) => (
            <MenuItem key={service} value={service} sx={{ p: 0 }}>
              <Checkbox checked={selectedServices.indexOf(service) > -1} />
              <ListItemText primary={<Typography sx={{fontSize:13}}>{service.name}</Typography>} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
