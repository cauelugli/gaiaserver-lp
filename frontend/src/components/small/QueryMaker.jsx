/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, MenuItem, Select, Typography } from "@mui/material";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const QueryMaker = () => {
  const [jobs, setJobs] = useState([]);
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [services, setServices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [groups, setGroups] = useState([]);

  const [firstOption, setFirstOption] = useState("");
  const [secondOptionList, setSecondOptionList] = useState([]);
  const [secondOption, setSecondOption] = useState("");
  const [thirdOptionList, setThirdOptionList] = useState([]);
  const [thirdOption, setThirdOption] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUsers = await api.get("/users");
        const resManagers = await api.get("/managers");
        setUsers(resUsers.data);
        setManagers(resManagers.data);

        const resJobs = await api.get("/jobs");
        const resSales = await api.get("/sales");
        setJobs(resJobs.data);
        setSales(resSales.data);

        const resCustomers = await api.get("/customers");
        const resClients = await api.get("/clients");
        setCustomers(resCustomers.data);
        setClients(resClients.data);

        const departments = await api.get("/departments");
        const services = await api.get("/services");
        const groups = await api.get("/groups");
        setGroups(groups.data);
        setDepartments(departments.data);
        setServices(services.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSelectedFirstOption = (e) => {
    const value = e.target.value;
    setFirstOption(value);
    setSecondOption("");

    setThirdOption("");
    setThirdOptionList([]);

    switch (value) {
      case "user":
        setSecondOptionList(users);
        break;
      case "manager":
        setSecondOptionList(managers);
        break;
      case "customer":
        setSecondOptionList(customers);
        break;
      case "group":
        setSecondOptionList(groups);
        break;
      case "client":
        setSecondOptionList(clients);
        break;
      case "department":
        setSecondOptionList(departments);
        break;
      case "services":
        setSecondOptionList(services);
        break;
      case "job":
        setSecondOptionList(jobs);
        break;
      case "sale":
        setSecondOptionList(sales);
        break;
      default:
        setSecondOptionList([]);
    }
  };

  const handleSelectedSecondOption = (e) => {
    setThirdOption("");
    setSecondOption(e.target.value);
    setThirdOptionList;
  };

  return (
    <>
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="flex-start"
      >
        <Typography>Buscar por</Typography>
        <Grid item sx={{ mx: 2 }}>
          <Select
            size="small"
            value={firstOption}
            onChange={(e) => handleSelectedFirstOption(e)}
          >
            <MenuItem value={"customer"}>Cliente Empresa</MenuItem>
            <MenuItem value={"client"}>Cliente Pessoa Física</MenuItem>
            <MenuItem value={"department"}>Departamento</MenuItem>
            <MenuItem value={"manager"}>Gerente</MenuItem>
            <MenuItem value={"group"}>Grupo</MenuItem>
            <MenuItem value={"job"}>Job</MenuItem>
            <MenuItem value={"service"}>Serviço</MenuItem>
            <MenuItem value={"user"}>Usuário</MenuItem>
            <MenuItem value={"sale"}>Venda</MenuItem>
          </Select>
        </Grid>
        {firstOption && (
          <>
            <Typography sx={{ mx: 1 }}>selecionar</Typography>
            <Grid item sx={{ mx: 2 }}>
              <Select
                size="small"
                value={secondOption}
                onChange={(e) => handleSelectedSecondOption(e)}
              >
                {secondOptionList.map((item) => (
                  <MenuItem key value={item}>
                    {item.name || item.title}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default QueryMaker;
