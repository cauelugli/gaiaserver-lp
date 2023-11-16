/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

import {
  Box,
  Button,
  Dialog,
  FormControlLabel,
  Grid,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import LanIcon from "@mui/icons-material/Lan";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

import DepartmentTable from "../tables/DepartmentTable";
import PositionTable from "../tables/PositionTable";
import AddPositionForm from "../forms/add/AddPositionForm";
import AddDepartmentForm from "../forms/add/AddDepartmentForm";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

function CustomTabPanel(props) {
  const { children, value, index } = props;

  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <Box sx={{ p: 1 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Departments({ user }) {
  const [refreshData, setRefreshData] = React.useState(false);
  const [value, setValue] = React.useState(0);

  const [openAddDepartment, setOpenAddDepartment] = React.useState(false);
  const [openAddPosition, setOpenAddPosition] = React.useState(false);

  const [searchValue, setSearchValue] = React.useState("");
  const [searchOption, setSearchOption] = React.useState("name");

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchOptionChange = (event) => {
    setSearchOption(event.target.value);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openAddButton = Boolean(anchorEl);
  const handleClickAddButton = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseAddButton = () => {
    setAnchorEl(null);
  };

  const [users, setUsers] = React.useState([]);
  const [managers, setManagers] = React.useState([]);
  const [serviceDepartments, setServiceDepartments] = React.useState([]);
  const [saleDepartments, setSaleDepartments] = React.useState([]);
  const [internalDepartments, setInternalDepartments] = React.useState([]);
  const [positions, setPositions] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await api.get("/users");
        const managers = await api.get("/managers");
        const departments = await api.get("/departments");
        const positions = await api.get("/positions");
        setUsers(users.data);
        setManagers(managers.data);
        setServiceDepartments(
          departments.data.filter(
            (department) => department.type === "Serviços"
          )
        );
        setSaleDepartments(
          departments.data.filter((department) => department.type === "Vendas")
        );
        setInternalDepartments(
          departments.data.filter((department) => department.type === "Interno")
        );
        setPositions(positions.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refreshData]);

  // const fetchData = async () => {
  //   try {
  //     const users = await api.get("/users");
  //     const managers = await api.get("/managers");
  //     const departments = await api.get("/departments");
  //     const positions = await api.get("/positions");
  //     setUsers(users.data);
  //     setManagers(managers.data);
  //     setServiceDepartments(
  //       departments.data.filter((department) => department.type === "Serviços")
  //     );
  //     setSaleDepartments(
  //       departments.data.filter((department) => department.type === "Vendas")
  //     );
  //     setInternalDepartments(
  //       departments.data.filter((department) => department.type === "Interno")
  //     );
  //     setPositions(positions.data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Typography
          sx={{ fontSize: 23, mt: 0.5, ml: 1, mr: 2, fontWeight: "bold" }}
        >
          Departamentos
        </Typography>
        <div>
          <Button
            id="basic-button"
            aria-controls={openAddButton ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openAddButton ? "true" : undefined}
            onClick={handleClickAddButton}
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 3,
              bottom: 3,
              "&:hover": { borderColor: "#eee" },
            }}
          >
            <Typography variant="h6">+</Typography>
            <Typography sx={{ fontSize: 16, mt: 0.5, ml: 0.5 }}>
              Novo
            </Typography>
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openAddButton}
            onClick={handleCloseAddButton}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuList sx={{ width: 170 }}>
              <MenuItem onClick={() => setOpenAddDepartment(true)}>
                <ListItemIcon>
                  <LanIcon />
                </ListItemIcon>
                <ListItemText>Departamento</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => setOpenAddPosition(true)}>
                <ListItemIcon>
                  <AssignmentIndIcon />
                </ListItemIcon>
                <ListItemText>Cargo</ListItemText>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ style: { backgroundColor: "black" } }}
        >
          <Tab
            label="Serviços"
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label="Vendas"
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label="Internos"
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          <Tab
            label="Cargos"
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Grid container direction="row" justifyContent="flex-start">
          <Grid item>
            <TextField
              placeholder="Pesquise aqui..."
              size="small"
              sx={{ mb: 1, ml: "2%", width: 350 }}
              value={searchValue}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment:
                  searchValue.length > 0 ? (
                    <InputAdornment position="end">
                      <ClearIcon
                        cursor="pointer"
                        sx={{ color: "#d21404" }}
                        onClick={() => setSearchValue("")}
                      />
                    </InputAdornment>
                  ) : (
                    ""
                  ),
              }}
            />
          </Grid>
          <Grid item sx={{ ml: "2%", pt: 0.5 }}>
            <RadioGroup
              row
              value={searchOption}
              onChange={handleSearchOptionChange}
            >
              <FormControlLabel
                value="name"
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 13,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                    Nome
                  </Typography>
                }
              />
              <FormControlLabel
                value="email"
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 13,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                    E-mail
                  </Typography>
                }
              />

              <FormControlLabel
                value="manager.name"
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 13,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                    Gerente
                  </Typography>
                }
              />
            </RadioGroup>
          </Grid>
        </Grid>
        <DepartmentTable
          users={users}
          managers={managers}
          searchValue={searchValue}
          searchOption={searchOption}
          departments={serviceDepartments}
          openAdd={openAddDepartment}
          setOpenAdd={setOpenAddDepartment}
          refreshData={refreshData}
          setRefreshData={setRefreshData}
          toast={toast}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Grid container direction="row" justifyContent="flex-start">
          <Grid item>
            <TextField
              placeholder="Pesquise aqui..."
              size="small"
              sx={{ mb: 1, ml: "2%", width: 350 }}
              value={searchValue}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment:
                  searchValue.length > 0 ? (
                    <InputAdornment position="end">
                      <ClearIcon
                        cursor="pointer"
                        sx={{ color: "#d21404" }}
                        onClick={() => setSearchValue("")}
                      />
                    </InputAdornment>
                  ) : (
                    ""
                  ),
              }}
            />
          </Grid>
          <Grid item sx={{ ml: "2%", pt: 0.5 }}>
            <RadioGroup
              row
              value={searchOption}
              onChange={handleSearchOptionChange}
            >
              <FormControlLabel
                value="name"
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 13,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                    Nome
                  </Typography>
                }
              />
              <FormControlLabel
                value="email"
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 13,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                    E-mail
                  </Typography>
                }
              />

              <FormControlLabel
                value="manager.name"
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 13,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                    Gerente
                  </Typography>
                }
              />
            </RadioGroup>
          </Grid>
        </Grid>
        <DepartmentTable
          toast={toast}
          users={users}
          managers={managers}
          searchValue={searchValue}
          searchOption={searchOption}
          departments={saleDepartments}
          openAdd={openAddDepartment}
          setOpenAdd={setOpenAddDepartment}
          refreshData={refreshData}
          setRefreshData={setRefreshData}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Grid container direction="row" justifyContent="flex-start">
          <Grid item>
            <TextField
              placeholder="Pesquise aqui..."
              size="small"
              sx={{ mb: 1, ml: "2%", width: 350 }}
              value={searchValue}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment:
                  searchValue.length > 0 ? (
                    <InputAdornment position="end">
                      <ClearIcon
                        cursor="pointer"
                        sx={{ color: "#d21404" }}
                        onClick={() => setSearchValue("")}
                      />
                    </InputAdornment>
                  ) : (
                    ""
                  ),
              }}
            />
          </Grid>
          <Grid item sx={{ ml: "2%", pt: 0.5 }}>
            <RadioGroup
              row
              value={searchOption}
              onChange={handleSearchOptionChange}
            >
              <FormControlLabel
                value="name"
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 13,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                    Nome
                  </Typography>
                }
              />
              <FormControlLabel
                value="email"
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 13,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                    E-mail
                  </Typography>
                }
              />

              <FormControlLabel
                value="manager.name"
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 13,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                    Gerente
                  </Typography>
                }
              />
            </RadioGroup>
          </Grid>
        </Grid>
        <DepartmentTable
          toast={toast}
          users={users}
          managers={managers}
          searchValue={searchValue}
          searchOption={searchOption}
          departments={internalDepartments}
          openAdd={openAddDepartment}
          setOpenAdd={setOpenAddDepartment}
          refreshData={refreshData}
          setRefreshData={setRefreshData}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <Grid container direction="row" justifyContent="flex-start">
          <Grid item>
            <TextField
              placeholder="Pesquise aqui..."
              size="small"
              sx={{ mb: 1, ml: "2%", width: 350 }}
              value={searchValue}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment:
                  searchValue.length > 0 ? (
                    <InputAdornment position="end">
                      <ClearIcon
                        cursor="pointer"
                        sx={{ color: "#d21404" }}
                        onClick={() => setSearchValue("")}
                      />
                    </InputAdornment>
                  ) : (
                    ""
                  ),
              }}
            />
          </Grid>
          <Grid item sx={{ ml: "2%", pt: 0.5 }}>
            <RadioGroup
              row
              value={searchOption}
              onChange={handleSearchOptionChange}
            >
              <FormControlLabel
                value="name"
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 13,
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 13, mx: -1, mt: 0.5 }}>
                    Nome
                  </Typography>
                }
              />
            </RadioGroup>
          </Grid>
        </Grid>
        <PositionTable
          toast={toast}
          searchValue={searchValue}
          searchOption={searchOption}
          positions={positions}
          openAdd={openAddPosition}
          setOpenAdd={setOpenAddPosition}
          refreshData={refreshData}
          setRefreshData={setRefreshData}
        />
      </CustomTabPanel>
      {openAddDepartment && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={openAddDepartment}
          onClose={() => setOpenAddDepartment(!openAddDepartment)}
        >
          <AddDepartmentForm
            openAdd={openAddDepartment}
            users={users}
            managers={managers}
            setOpenAdd={setOpenAddDepartment}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}
      {openAddPosition && (
        <Dialog
          fullWidth
          maxWidth="xs"
          open={openAddPosition}
          onClose={() => setOpenAddPosition(!openAddPosition)}
        >
          <AddPositionForm
            user={user}
            openAdd={openAddPosition}
            setOpenAdd={setOpenAddPosition}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}
    </Box>
  );
}
