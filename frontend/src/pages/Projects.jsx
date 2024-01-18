/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import {
  Box,
  Button,
  Dialog,
  Grid,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

import NoDataText from "../components/small/NoDataText";
import RefreshButton from "../components/small/buttons/RefreshButton";
import TableFilters from "../components/TableFilters";

import AddProjectForm from "../forms/add/AddProjectForm";
import ProjectsTable from "../tables/ProjectsTable";

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

export default function Projects({ user }) {
  const [refreshData, setRefreshData] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [configData, setConfigData] = React.useState([]);
  const [projects, setProjects] = React.useState([]);
  const [customers, setCustomers] = React.useState([]);
  const [clients, setClients] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);

  const [openAddProject, setOpenAddProject] = React.useState(false);

  const [searchOption, setSearchOption] = React.useState("quote");
  const [searchOptionLabel, setSearchOptionLabel] = React.useState("Orçamento");
  const [searchValue, setSearchValue] = React.useState("");

  const searchOptionList = [{ options: [{ value: "name", label: "Nome" }] }];

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openAddButton = Boolean(anchorEl);
  const handleClickAddButton = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseAddButton = () => {
    setAnchorEl(null);
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSearchValue("");
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const projects = await api.get("/projects");
        const customers = await api.get("/customers");
        const clients = await api.get("/clients");
        const departments = await api.get("/departments");
        const config = await api.get("/config");
        setConfigData(config.data[0].projects);
        setProjects(projects.data);
        setCustomers(customers.data);
        setClients(clients.data);
        setDepartments(departments.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refreshData]);

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
          Projetos
        </Typography>
        <div>
          <Button
            id="basic-button"
            aria-controls={openAddButton ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openAddButton ? "true" : undefined}
            onClick={handleClickAddButton}
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
              <MenuItem onClick={() => setOpenAddProject(true)}>
                <ListItemIcon>
                  <RocketLaunchIcon />
                </ListItemIcon>
                <ListItemText>Novo Projeto</ListItemText>
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
            label={<Typography sx={{ fontSize: 13 }}>Em execução</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          />
          {/* <Tab
            label={<Typography sx={{ fontSize: 13 }}>Concluidos</Typography>}
            sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
          /> */}
          <RefreshButton
            refreshData={refreshData}
            setRefreshData={setRefreshData}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {projects.length === 0 ? (
          <NoDataText option="Projetos" femaleGender={false} />
        ) : (
          <>
            <TableFilters
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              searchOption={"quote"}
              searchOptionList={searchOptionList[0]}
              setSearchOption={setSearchOption}
              searchOptionLabel={searchOptionLabel}
              setSearchOptionLabel={setSearchOptionLabel}
              handleSearchChange={handleSearchChange}
            />

            <ProjectsTable
              projects={projects}
              configData={configData}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              toast={toast}
              searchValue={searchValue}
              searchOption={searchOption}
            />
          </>
        )}
      </CustomTabPanel>

      {/* <CustomTabPanel value={value} index={1}>
        {outcoming.length === 0 ? (
          <NoDataText option="Contas a Pagar" femaleGender={true} />
        ) : (
          <>
            <TableFilters
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              searchOption={searchOption}
              searchOptionList={searchOptionList[1]}
              setSearchOption={setSearchOption}
              searchOptionLabel={searchOptionLabel}
              setSearchOptionLabel={setSearchOptionLabel}
              handleSearchChange={handleSearchChange}
            />

            <FinanceOutcomeTable
              outcoming={outcoming}
              configData={configData}
              user={user}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              toast={toast}
              searchValue={searchValue}
              searchOption={searchOption}
            />
          </>
        )}
      </CustomTabPanel> */}
      {openAddProject && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={openAddProject}
          onClose={() => setOpenAddProject(!openAddProject)}
        >
          <AddProjectForm
            configData={configData}
            openAdd={openAddProject}
            user={user}
            customers={customers}
            clients={clients}
            departments={departments}
            // users={users}
            // managers={managers}
            setOpenAdd={setOpenAddProject}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            toast={toast}
          />
        </Dialog>
      )}
    </Box>
  );
}
