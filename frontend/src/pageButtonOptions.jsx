/* eslint-disable no-unused-vars */
import React from "react";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import ApartmentIcon from "@mui/icons-material/Apartment";
import BuildIcon from "@mui/icons-material/Build";
import EngineeringIcon from "@mui/icons-material/Engineering";
import GroupsIcon from "@mui/icons-material/Groups";
import HubIcon from "@mui/icons-material/Hub";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LanIcon from "@mui/icons-material/Lan";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonIcon from "@mui/icons-material/Person";
import Person4Icon from "@mui/icons-material/Person4";
import RecyclingIcon from "@mui/icons-material/Recycling";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SellIcon from "@mui/icons-material/Sell";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const pageButtonOptions = [
  {
    page: "dashboard",
    label: "Dashboard",
  },
  {
    page: "customers",
    pageButtonOptions: [
      {
        label: "Empresa",
        icon: <ApartmentIcon />,
        modal: {
          name: "AddCustomer",
          label: "Cliente Empresa",
          femaleGender: false,
          maxWidth: "md",
          fieldsSections: [
            { name: "image", label: "Logotipo" },
            { name: "mainInfo", label: "Informações Gerais" },
            { name: "mainContact", label: "Contato Principal" },
            { name: "secondaryInfo", label: "Informações Adicionais" },
          ],
          fields: [
            {
              fieldSection: "mainInfo",
              name: "name",
              label: "Nome",
              type: "string",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "phone",
              label: "Telefone",
              type: "string",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "cnpj",
              label: "CNPJ",
              type: "string",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "address",
              label: "Endereço",
              type: "string",
              required: true,
            },

            {
              fieldSection: "mainContact",
              name: "mainContactName",
              label: "Nome",
              type: "string",
              required: true,
            },

            {
              fieldSection: "mainContact",
              name: "mainContactPhone",
              label: "Telefone",
              type: "string",
              required: true,
            },
            {
              fieldSection: "mainContact",
              name: "mainContactEmail",
              label: "E-mail",
              type: "string",
              required: true,
            },
            {
              fieldSection: "mainContact",
              name: "mainContactPosition",
              label: "Posição",
              type: "select",
              options: ["Propietário", "Sócio", "Gerente", "Colaborador"],
              required: false,
            },
            {
              fieldSection: "secondaryInfo",
              name: "website",
              label: "Website",
              type: "string",
              required: false,
            },
            {
              fieldSection: "secondaryInfo",
              name: "segment",
              label: "Ramo de Atividade",
              type: "string",
              required: false,
            },
            {
              fieldSection: "secondaryInfo",
              name: "employees",
              label: "Nº de Empregados",
              type: "select",
              options: [
                "1 à 5",
                "6 à 15",
                "16 à 50",
                "51 à 100",
                "+100",
                "+1000",
                "+10000",
              ],
              required: false,
            },
            {
              fieldSection: "secondaryInfo",
              name: "companyType",
              label: "Tipo de Empresa",
              type: "select",
              options: [
                "Individual (EI/MEI)",
                "LTDA",
                "EPP / EIRELI",
                "Coop",
                "S/A",
                "ONG",
                "ORG",
              ],
              required: false,
            },
          ],
        },
      },
      {
        label: "Pessoa Física",
        icon: <PersonIcon />,
        modal: {
          name: "AddClient",
          label: "Cliente Pessoa Física",
          femaleGender: false,
          maxWidth: "md",
          fieldsSections: [
            { name: "image", label: "Imagem" },
            { name: "mainInfo", label: "Informações Gerais" },
            { name: "secondaryInfo", label: "Informações Adicionais" },
          ],
          fields: [
            {
              fieldSection: "image",
              name: "image",
              type: "image",
              required: false,
            },
            {
              fieldSection: "mainInfo",
              name: "name",
              label: "Nome",
              type: "string",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "cpf",
              label: "CPF",
              type: "string",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "email",
              label: "E-mail",
              type: "string",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "phone",
              label: "Telefone",
              type: "string",
              required: true,
            },
            {
              fieldSection: "secondaryInfo",
              name: "birthdate",
              label: "Data de Nascimento",
              type: "date",
              required: false,
            },
            {
              fieldSection: "secondaryInfo",
              name: "gender",
              label: "Gênero",
              type: "select",
              required: false,
              options: ["Masculino", "Feminino", "Outro", "Não Informar"],
            },
            {
              fieldSection: "secondaryInfo",
              name: "addressHome",
              label: "Endereço Residencial",
              type: "string",
              required: true,
            },
            {
              fieldSection: "secondaryInfo",
              name: "addressDelivery",
              label: "Endereço de Entrega",
              type: "string",
              required: true,
            },
          ],
        },
      },
      {
        label: "Importar Contatos",
        icon: <UploadFileIcon />,
        modal: {
          name: "ImportContacts",
          label: "Importação de Clientes",
          femaleGender: true,
          fields: [{ name: "", label: "", type: "" }],
        },
      },
    ],
  },
  {
    page: "requests",
    pageButtonOptions: [
      {
        label: "Job / Atendimento",
        icon: <EngineeringIcon />,
        modal: "AddJob",
      },
      { label: "Venda", icon: <SellIcon />, modal: "AddSale" },
    ],
  },
  {
    page: "users",
    pageButtonOptions: [
      { label: "Colaborador", icon: <PersonIcon />, modal: "AddUser" },
      { label: "Gerente", icon: <Person4Icon />, modal: "AddManager" },
    ],
  },
  {
    page: "departments",
    pageButtonOptions: [
      { label: "Departamento", icon: <LanIcon />, modal: "AddDepartment" },
      { label: "Grupo", icon: <GroupsIcon />, modal: "AddGroup" },
    ],
  },
  {
    page: "services",
    pageButtonOptions: [
      { label: "Serviço", icon: <BuildIcon />, modal: "AddService" },
      {
        label: "Plano de Serviços",
        icon: <HubIcon />,
        modal: "AddServicePlan",
      },
    ],
  },
  {
    page: "quotes",
    pageButtonOptions: [
      { label: "Empresa", icon: <ApartmentIcon />, modal: "" },
      { label: "Empresa", icon: <ApartmentIcon />, modal: "" },
      { label: "Empresa", icon: <ApartmentIcon />, modal: "" },
    ],
  },
  {
    // TO-DO
    page: "stock",
    pageButtonOptions: [
      {
        label: "Entrada de Estoque",
        icon: <Inventory2Icon />,
        modal: "AddStockEntry",
      },
    ],
  },
  {
    // TO-DO
    page: "products",
    pageButtonOptions: [
      { label: "Produto", icon: <SellIcon />, modal: "AddPRoduct" },
    ],
  },
  {
    // TO-DO
    page: "materials",
    pageButtonOptions: [{ label: "XXX", icon: <RecyclingIcon />, modal: "" }],
  },
  {
    page: "chat",
    pageButtonOptions: [
      { label: "Mensagem", icon: <ApartmentIcon />, modal: "AddChat" },
    ],
  },
  {
    page: "projects",
    pageButtonOptions: [
      { label: "Projeto", icon: <RocketLaunchIcon />, modal: "AddProject" },
      {
        label: "Projeto Recorrente",
        icon: <RecyclingIcon />,
        modal: "AddRecurrentProject",
      },
    ],
  },
  {
    page: "finance",
    pageButtonOptions: [
      { label: "Receita", icon: <ApartmentIcon />, modal: "AddFinanceIncome" },
      { label: "Despesa", icon: <ApartmentIcon />, modal: "AddFinanceOutcome" },
    ],
  },
  {
    page: "reports",
    pageButtonOptions: [],
  },
  {
    page: "security",
    pageButtonOptions: [
      { label: "Operador", icon: <ManageAccountsIcon />, modal: "AddOperator" },
      { label: "Cargo", icon: <AssignmentIndIcon />, modal: "AddPosition" },
      {
        label: "Perfil de Acesso",
        icon: <AdminPanelSettingsIcon />,
        modal: "AddRole",
      },
    ],
  },
];

export default pageButtonOptions;
