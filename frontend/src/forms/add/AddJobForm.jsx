/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import dayjs from "dayjs";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

import {
  Avatar,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import CreateIcon from "@mui/icons-material/Create";
import CheckIcon from "@mui/icons-material/Check";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import TaskIcon from "@mui/icons-material/Task";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import MaterialList from "../../components/small/MaterialList";
import DialogHeader from "../../components/small/DialogHeader";
import FormEndLineTenant from "../../components/small/FormEndLineTenant";
import CustomerSelect from "../../components/small/selects/CustomerSelect";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const AddJobForm = ({
  userName,
  configAgenda,
  configNotifications,
  configNotificationsBooleans,
  selectedItem,
  setOpenAddJob,
  refreshData,
  setRefreshData,
  toast,
  fromShortcut,
  addFromShortcut,
}) => {
  const [configRequests, setConfigRequests] = React.useState([]);
  const [configCustomization, setConfigCustomization] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [services, setServices] = React.useState([]);
  const [stockItems, setStockItems] = React.useState([]);

  let selectedCustomer = {};
  if (selectedItem || fromShortcut) {
    selectedCustomer = selectedItem;
  }

  const [customerType, setCustomerType] = React.useState(
    selectedCustomer.cnpj
      ? "Empresa"
      : selectedCustomer.cpf
      ? "Pessoa Física"
      : ""
  );
  const [customer, setCustomer] = React.useState(
    selectedItem ? selectedCustomer : ""
  );
  const [requester, setRequester] = React.useState(
    selectedCustomer.mainContactName
      ? selectedCustomer.mainContactName
      : selectedCustomer.name
      ? selectedCustomer.name
      : ""
  );
  const [local, setLocal] = React.useState(
    selectedCustomer.address
      ? selectedCustomer.address
      : selectedCustomer.addressHome
      ? selectedCustomer.addressHome
      : ""
  );
  const [scheduledTo, setScheduledTo] = React.useState(dayjs());
  const [department, setDepartment] = React.useState("");
  const [service, setService] = React.useState({});
  const [worker, setWorker] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [materials, setMaterials] = React.useState([]);
  const [materialsCost, setMaterialsCost] = React.useState(0);
  const [editQuote, setEditQuote] = React.useState(false);
  const [approvedQuote, setApprovedQuote] = React.useState(false);
  const [scheduleToWorker, setScheduleToWorker] = React.useState(false);
  const [selectedSchedule, setSelectedSchedule] = React.useState(null);
  const [scheduleOptions, setScheduleOptions] = React.useState([]);
  const [attachedFiles, setAttachedFiles] = React.useState([]);

  React.useEffect(() => {
    const options = generateScheduleOptions();
    setScheduleOptions(options);
  }, [scheduledTo, service, worker]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const config = await api.get("/config");
        const departments = await api.get("/departments");
        const services = await api.get("/services");
        const stockItems = await api.get("/stockItems");
        setConfigCustomization(config.data[0].customization);
        setConfigRequests(config.data[0].requests);
        setDepartments(
          departments.data.filter(
            (department) => department.type === "Serviços"
          )
        );
        setServices(services.data);
        setStockItems(stockItems.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleServiceChange = (service) => {
    setService(service);
    setMaterials(service.materials);
    setMaterialsCost(service.materialsCost);
  };

  const handleApproveQuote = () => {
    setApprovedQuote(true);
  };

  const handleEditQuote = () => {
    setEditQuote(!editQuote);
    setApprovedQuote(true);
  };

  const handleCustomerTypeChange = (type) => {
    setCustomerType(type);
    setCustomer("");
    setRequester("");
    setLocal("");
  };

  const handleCustomerChange = (customer) => {
    setCustomer(customer);
    setRequester(customer.mainContactName || customer.name);
    setLocal(customer.address || customer.addressHome);
  };

  const generateScheduleOptions = () => {
    const workingHoursStart = configAgenda.minTime;
    const workingHoursEnd = configAgenda.maxTime;

    const executionTimeHours = service.executionTime;

    const dayEvents = [];
    const availableTimes = [];

    let currentTime = workingHoursStart * 60;
    const endTime = workingHoursEnd * 60;

    while (currentTime + executionTimeHours * 60 <= endTime) {
      let isTimeAvailable = true;
      const currentTimeEnd = currentTime + executionTimeHours * 60;

      dayEvents.forEach((event) => {
        const eventStart = event.start.hour() * 60 + event.start.minute();
        const eventEnd = event.end.hour() * 60 + event.end.minute();

        if (
          (currentTime >= eventStart && currentTime < eventEnd) ||
          (currentTimeEnd > eventStart && currentTimeEnd <= eventEnd)
        ) {
          isTimeAvailable = false;
        }
      });

      if (isTimeAvailable) {
        const startHour = Math.floor(currentTime / 60);
        const startMinute = currentTime % 60;
        const endHour = Math.floor(currentTimeEnd / 60);
        const endMinute = currentTimeEnd % 60;

        const timeString = `${startHour
          .toString()
          .padStart(2, "0")}:${startMinute
          .toString()
          .padStart(2, "0")} - ${endHour
          .toString()
          .padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`;

        availableTimes.push(timeString);
      }

      currentTime += 30;
    }

    return availableTimes;
  };

  const handleScheduleSelection = (event) => {
    const schedule = event.target.value;
    setSelectedSchedule(schedule);
  };

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 250,
        width: 250,
      },
    },
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/jobs", {
        title,
        description,
        customer: {
          id: customer._id,
          name: customer.name,
          image: customer.image,
          cnpj: customer.cnpj || null,
          cpf: customer.cpf || null,
          type: customer.cnpj ? "Customer" : "Client",
        },
        requester,
        department: {
          id: department._id,
          name: department.name,
          phone: department.phone,
          color: department.color,
        },
        worker,
        manager: department.manager || {},
        status: configRequests.requestsNeedApproval ? "Aberto" : "Aprovado",
        service: {
          _id: service._id || service.id,
          name: service.name,
          value: service.value,
          department: service.department,
        },
        materials,
        materialsCost,
        price: service.value + materialsCost,
        local,
        scheduledTo,
        createdBy: userName,
        selectedSchedule: scheduleToWorker ? selectedSchedule : null,
      });

      if (res.data) {
        const itemId = res.data.savedRequest._id;
        const uploadResponses = [];

        for (const file of attachedFiles) {
          const formData = new FormData();
          formData.append("attachment", file);
          formData.append("itemId", itemId);

          const uploadResponse = await api.post(
            "/uploads/singleAttachment",
            formData
          );
          uploadResponses.push(uploadResponse.data.attachmentPath);
        }

        await api.put(`/jobs/addAttachments`, {
          itemId: res.data.savedRequest._id,
          attachments: uploadResponses,
          userName,
          date: dayjs().format("DD/MM HH:mm"),
        });
        toast.success(
          `Solicitação Adicionada! Orçamento #${res.data.savedQuote.number}`,
          {
            closeOnClick: true,
            pauseOnHover: false,
            theme: "colored",
            autoClose: 1200,
          }
        );
        await api.post("/recentActivity", {
          activity: `Colaborador ${userName} criou um Job para ${customer.name}`,
          createdAt: dayjs().format("DD/MM/YYYY HH:mm:ss"),
        });
        socket.emit("recentActivityRefresh");
        if (configNotificationsBooleans.whenJobIsCreated) {
          socket.emit("whenJobIsCreated", {
            sender: userName,
            title,
            list: configNotifications.whenJobIsCreated,
            date: dayjs(Date.now()).format("DD/MM/YYYY"),
          });
        }
      }
      setOpenAddJob(false);
      if (!addFromShortcut) {
        if (!fromShortcut) {
          setRefreshData(!refreshData);
        }
      }
    } catch (err) {
      toast.error("Houve algum erro...", {
        closeOnClick: true,
        pauseOnHover: false,
        theme: "colored",
        autoClose: 1200,
      });
      console.log("err", err);
    }
  };

  const handleAutofillTitleAndDescription = () => {
    setTitle(`${service.name} - ${requester}`);
    setDescription(
      `Realizar o serviço de ${service.name} para ${requester} (${
        customer.name
      }) na data de ${dayjs(scheduledTo).format("DD/MM/YYYY")} em ${local}.`
    );
  };

  const handleFileChange = (event) => {
    setAttachedFiles([...attachedFiles, ...event.target.files]);
  };

  const removeFile = (indexToRemove) => {
    setAttachedFiles(
      attachedFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <form onSubmit={handleAdd}>
      <Grid sx={{ ml: 5 }}>
        <DialogHeader title="Job" femaleGender={false} />
        <DialogContent>
          <Grid container>
            <Typography sx={{ mb: 1, fontSize: 18, fontWeight: "bold" }}>
              Informações do Cliente
            </Typography>
            <CheckCircleOutlineOutlinedIcon
              sx={{
                color:
                  customerType && customer && requester && local && scheduledTo
                    ? "#50C878"
                    : "lightgrey",
                ml: 1,
              }}
            />
          </Grid>
          <Grid
            container
            sx={{ mt: 2 }}
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <Grid item>
              <FormControl>
                <Select
                  onChange={(e) => handleCustomerTypeChange(e.target.value)}
                  value={customerType}
                  required
                  disabled={selectedCustomer.isActive || fromShortcut}
                  displayEmpty
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return <Typography>Tipo de Cliente</Typography>;
                    }

                    return selected;
                  }}
                  sx={{ width: 180 }}
                >
                  <MenuItem disabled value="">
                    Tipo de Cliente
                  </MenuItem>
                  <MenuItem value={"Empresa"}>Empresa</MenuItem>
                  <MenuItem value={"Pessoa Fisica"}>Pessoa Física</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {customerType && (
              <CustomerSelect
                marginAddJobForm
                handleCustomerChange={handleCustomerChange}
                setCustomer={setCustomer}
                customerType={customerType}
                selectedCustomer={customer}
                fromShortcut={fromShortcut}
              />
            )}
            {customer && (
              <Grid item>
                <TextField
                  label="Solicitante"
                  value={requester}
                  onChange={(e) => setRequester(e.target.value)}
                  required
                  variant="outlined"
                  sx={{ width: 190 }}
                />
              </Grid>
            )}
            {requester && (
              <Grid item>
                <TextField
                  label="Local de Execução"
                  value={local}
                  onChange={(e) => setLocal(e.target.value)}
                  required
                  variant="outlined"
                  sx={{ width: 220, mx: 1 }}
                />
              </Grid>
            )}
            {local && (
              <Grid item sx={{ mt: -1 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      value={scheduledTo}
                      format="DD/MM/YYYY"
                      onChange={(newValue) => setScheduledTo(newValue)}
                      label="Agendar para"
                      sx={{ width: 180 }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>
            )}
          </Grid>

          {local && (
            <Grid sx={{ mr: 10 }}>
              <Divider sx={{ my: 3 }} />
              <Grid container>
                <Typography sx={{ mb: 2, fontSize: 18, fontWeight: "bold" }}>
                  Departamento
                </Typography>
                <CheckCircleOutlineOutlinedIcon
                  sx={{
                    color:
                      department && service && worker ? "#50C878" : "lightgrey",
                    ml: 1,
                  }}
                />
              </Grid>

              <Grid
                container
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between"
              >
                <Grid item>
                  <Select
                    onChange={(e) => {
                      setDepartment(e.target.value),
                        setService(""),
                        setWorker(""),
                        setMaterials([]),
                        setMaterialsCost(0);
                    }}
                    value={department}
                    disabled={approvedQuote}
                    size="small"
                    displayEmpty
                    required
                    renderValue={(selected) => {
                      if (!selected) {
                        return (
                          <Typography>Selecione o Departamento</Typography>
                        );
                      } else {
                        return (
                          <Grid container direction="row">
                            <Paper
                              elevation={0}
                              sx={{
                                mr: 1,
                                mt: 0.5,
                                width: 15,
                                height: 15,
                                borderRadius: 50,
                                backgroundColor: selected.color,
                              }}
                            />
                            <Typography>{selected.name}</Typography>
                          </Grid>
                        );
                      }
                    }}
                    sx={{ minWidth: "200px" }}
                  >
                    {departments.map((item) => (
                      <MenuItem value={item} key={item.id}>
                        <Grid container direction="row">
                          <Paper
                            elevation={0}
                            sx={{
                              mr: 1,
                              mt: 0.5,
                              width: 15,
                              height: 15,
                              borderRadius: 50,
                              backgroundColor: item.color,
                            }}
                          />
                          <Typography>{item.name}</Typography>
                        </Grid>
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item sx={{ mt: -7, mx: -10 }}>
                  {department && (
                    <Grid sx={{ mt: 4 }}>
                      <Typography>Serviço</Typography>
                      <Select
                        disabled={approvedQuote}
                        onChange={(e) => {
                          handleServiceChange(e.target.value);
                        }}
                        required
                        value={service}
                        size="small"
                        renderValue={(selected) => {
                          if (!selected) {
                            return <Typography>Escolha um Serviço</Typography>;
                          } else {
                            return <Typography>{selected.name}</Typography>;
                          }
                        }}
                        sx={{ width: 250 }}
                      >
                        {services
                          .filter(
                            (service) =>
                              service.department &&
                              service.department.id === department._id
                          )

                          .map((item) => (
                            <MenuItem value={item} key={item.id}>
                              {item.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </Grid>
                  )}
                </Grid>

                <Grid item sx={{ mt: -7 }}>
                  {department && service && (
                    <Grid sx={{ mt: 4 }}>
                      <Typography>Colaborador</Typography>
                      <Select
                        onChange={(e) => {
                          setWorker(e.target.value);
                          handleAutofillTitleAndDescription();
                        }}
                        value={worker}
                        size="small"
                        displayEmpty
                        required
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return (
                              <Typography>Selecione o Colaborador</Typography>
                            );
                          } else {
                            return (
                              <Grid container direction="row">
                                <Avatar
                                  alt="Imagem do Colaborador"
                                  src={`http://localhost:3000/static/${selected.image}`}
                                  sx={{ width: 22, height: 22, mr: 1 }}
                                />
                                <Typography>{selected.name}</Typography>
                              </Grid>
                            );
                          }
                        }}
                      >
                        <MenuItem disabled value="">
                          Colaboradores
                        </MenuItem>
                        {department.members.map((item) => (
                          <MenuItem value={item} key={item.id}>
                            <Avatar
                              alt="Imagem do Colaborador"
                              src={`http://localhost:3000/static/${item.image}`}
                              sx={{ width: 22, height: 22, mr: 2 }}
                            />
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          )}

          {worker && (
            <Grid sx={{ mr: 10 }}>
              <Divider sx={{ my: 3 }} />
              <Grid container>
                <Typography sx={{ mb: 1, fontSize: 18, fontWeight: "bold" }}>
                  Solicitação
                </Typography>
                <CheckCircleOutlineOutlinedIcon
                  sx={{
                    color: title && description ? "#50C878" : "lightgrey",
                    ml: 1,
                  }}
                />
              </Grid>
              <Grid container sx={{ mt: 2 }} direction="column">
                <Grid item>
                  <TextField
                    label="Título"
                    size="small"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    label="Descrição"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 1 }}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}

          {description && (
            <Grid sx={{ mr: 10 }}>
              <Divider sx={{ my: 3 }} />
              <Grid container>
                <Typography sx={{ mb: 1, fontSize: 18, fontWeight: "bold" }}>
                  Orçamento
                </Typography>
                <CheckCircleOutlineOutlinedIcon
                  sx={{ color: approvedQuote ? "#50C878" : "lightgrey", ml: 1 }}
                />
              </Grid>
              {!editQuote ? (
                <div style={{ color: approvedQuote ? "#777" : "black" }}>
                  {service && (
                    <>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <Typography sx={{ fontSize: 13, color: "#777" }}>
                                Serviço
                              </Typography>
                            </TableCell>
                            <TableCell align="left">
                              <Typography sx={{ fontSize: 13, color: "#777" }}>
                                Itens
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography sx={{ fontSize: 13, color: "#777" }}>
                                Valores
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {service && (
                            <TableRow>
                              <TableCell>
                                <Typography>
                                  {service && `${service.name}`}
                                </Typography>
                              </TableCell>
                              <TableCell align="left">
                                <Typography>
                                  {materials.length > 0 ? (
                                    materials.map((material) => (
                                      <Typography
                                        sx={{ fontSize: 13 }}
                                        key={material.id}
                                      >
                                        {material.name} x{material.quantity} =
                                        R$
                                        {(
                                          material.sellValue * material.quantity
                                        ).toFixed(2)}
                                      </Typography>
                                    ))
                                  ) : (
                                    <Typography>Não há materiais</Typography>
                                  )}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Grid container direction="column">
                                  <Grid>
                                    <Typography>
                                      Serviço{" "}
                                      {service.value
                                        ? `R$ ${service.value.toFixed(2)}`
                                        : "R$0.00"}
                                    </Typography>
                                  </Grid>
                                  {materialsCost && (
                                    <Grid>
                                      <Typography>
                                        Materiais{" "}
                                        {service
                                          ? `R$ ${materialsCost.toFixed(2)}`
                                          : "R$0.00"}
                                      </Typography>
                                    </Grid>
                                  )}
                                  {/* <Grid></Grid> */}
                                </Grid>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                      <span style={{ float: "right" }}>
                        <Typography sx={{ m: 2 }}>
                          Total{" "}
                          {service &&
                            `R$ ${(materialsCost + service.value).toFixed(2)}`}
                        </Typography>
                      </span>
                      {!approvedQuote ? (
                        <Grid
                          container
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ mt: 2, px: 2 }}
                        >
                          <Grid item />
                          <Grid item>
                            <Button
                              sx={{ mr: 2 }}
                              variant="contained"
                              color="success"
                              startIcon={<TaskIcon />}
                              onClick={handleApproveQuote}
                            >
                              Aprovar
                            </Button>
                            <Button
                              variant="contained"
                              color="warning"
                              startIcon={<CreateIcon />}
                              onClick={handleEditQuote}
                            >
                              Editar
                            </Button>
                          </Grid>
                          <Grid item></Grid>
                        </Grid>
                      ) : (
                        <Typography
                          sx={{
                            mt: 2,
                            ml: 2,
                            color: "green",
                            textAlign: "center",
                          }}
                        >
                          Este Orçamento foi Aprovado!
                        </Typography>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid item>
                    <MaterialList
                      stockItems={stockItems}
                      materials={materials}
                      materialsEditCost={materialsCost}
                      setMaterials={setMaterials}
                      setMaterialsFinalCost={setMaterialsCost}
                    />
                  </Grid>
                  <Grid item sx={{ m: 2 }}>
                    <Button
                      sx={{ mx: 2 }}
                      variant="contained"
                      color="success"
                      startIcon={<CheckIcon />}
                      onClick={handleEditQuote}
                    >
                      Alterar e Aprovar
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Grid>
          )}

          {approvedQuote && (
            <Grid>
              <Divider sx={{ my: 3, mr: 10 }} />
              <Grid
                container
                direction="row"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
                  Anexar Arquivos
                </Typography>
                <input
                  type="file"
                  multiple
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <label htmlFor="fileInput">
                  <Button
                    variant="outlined"
                    color="primary"
                    component="span"
                    size="small"
                    startIcon={<FileUploadIcon />}
                    sx={{ ml: 1 }}
                  >
                    Enviar
                  </Button>
                </label>
                <Grid item>
                  <Grid container direction="row">
                    {attachedFiles.map((file, index) => (
                      <Grid key={index} item sx={{ ml: 1 }}>
                        <Grid
                          container
                          direction="row"
                          alignItems="center"
                          sx={{
                            border: "1px solid darkgrey",
                            borderRadius: 2,
                          }}
                        >
                          <Typography
                            sx={{ fontSize: 13, ml: 1, color: "#777" }}
                          >
                            {file.name}
                          </Typography>

                          <Button
                            size="small"
                            color="error"
                            onClick={() => removeFile(index)}
                            sx={{ mx: -1 }}
                          >
                            <DeleteIcon />
                          </Button>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
              <Grid container>
                <Typography sx={{ mt: 1.5, fontSize: 18, fontWeight: "bold" }}>
                  Agendar para o Colaborador
                </Typography>
                <Checkbox
                  sx={{ ml: 1 }}
                  checked={scheduleToWorker}
                  onChange={(e) => setScheduleToWorker(e.target.checked)}
                  inputProps={{ "aria-label": "controlled" }}
                />
                {scheduleToWorker && service && (
                  <Select
                    onChange={handleScheduleSelection}
                    value={selectedSchedule}
                    sx={{ width: 250 }}
                    MenuProps={MenuProps}
                  >
                    {scheduleOptions.map((timeOption, index) => (
                      <MenuItem
                        key={index}
                        value={`${scheduledTo.format(
                          "DD/MM/YYYY"
                        )} - ${timeOption}`}
                      >
                        {`${scheduledTo.format("DD/MM/YYYY")} - ${timeOption}`}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <FormEndLineTenant configCustomization={configCustomization} />

        <DialogActions sx={{ pr: "4%" }}>
          <Button type="submit" variant="contained" color="success">
            OK
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenAddJob(false)}
          >
            X
          </Button>
        </DialogActions>
      </Grid>
    </form>
  );
};

export default AddJobForm;
