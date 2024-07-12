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
        label: "Job",
        icon: <EngineeringIcon />,
        modal: {
          name: "AddJob",
          label: "Job",
          femaleGender: false,
          maxWidth: "md",
          fieldsSections: [
            { name: "mainInfo", label: "Informações Gerais" },
            { name: "description", label: "Descrição" },
            { name: "scheduling", label: "Agendamento" },
            { name: "attachments", label: "Anexos" },
          ],
          fields: [
            {
              fieldSection: "mainInfo",
              name: "title",
              label: "Título",
              type: "string",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "customer",
              label: "Cliente",
              type: "dynamicData",
              dynamicData: "allCustomers",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "service",
              label: "Serviço",
              type: "dynamicData",
              dynamicData: "services",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "worker",
              label: "Colaborador Designado",
              type: "dynamicData",
              dynamicData: "users",
              required: true,
            },
            {
              fieldSection: "scheduling",
              name: "scheduleDate",
              label: "Data de Atendimento",
              type: "date",
              required: true,
            },
            {
              fieldSection: "scheduling",
              name: "scheduleToWorket",
              label: "Agendar para Colaborador",
              type: "checkbox",
              required: true,
            },
            {
              fieldSection: "description",
              name: "description",
              label: "",
              type: "fullWidth",
              required: false,
            },
            {
              fieldSection: "attachments",
              name: "attachments",
              label: "",
              type: "attachments",
              required: false,
            },
          ],
        },
      },
      {
        label: "Venda",
        icon: <SellIcon />,
        modal: {
          name: "AddSale",
          label: "Venda",
          femaleGender: true,
          maxWidth: "md",
          fieldsSections: [
            { name: "mainInfo", label: "Informações Gerais" },
            { name: "products", label: "Produtos" },
            { name: "attachments", label: "Anexos" },
          ],
          fields: [
            {
              fieldSection: "mainInfo",
              name: "customer",
              label: "Cliente",
              type: "dynamicData",
              dynamicData: "allCustomers",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "seller",
              label: "Vendedor",
              type: "dynamicData",
              dynamicData: "users",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "deliveryDate",
              label: "Data de Entrega",
              type: "date",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "deliveryAddress",
              label: "Endereço de Entrega",
              type: "string",
              required: true,
            },
            {
              fieldSection: "products",
              name: "products",
              label: "",
              type: "products",
              required: false,
            },
            {
              fieldSection: "attachments",
              name: "attachments",
              label: "",
              type: "attachments",
              required: false,
            },
          ],
        },
      },
    ],
  },
  {
    page: "users",
    pageButtonOptions: [
      {
        label: "Colaborador",
        icon: <PersonIcon />,
        modal: {
          name: "AddUser",
          label: "Colaborador",
          femaleGender: false,
          maxWidth: "md",
          fieldsSections: [
            { name: "image", label: "Imagem" },
            { name: "mainInfo", label: "Informações Gerais" },
            { name: "departmentInfo", label: "Informações Internas" },
            { name: "socialMedia", label: "Redes Sociais" },
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
              name: "birthdate",
              label: "Data de Nascimento",
              type: "date",
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
              name: "gender",
              label: "Gênero",
              type: "select",
              required: false,
              options: ["Masculino", "Feminino", "Outro", "Não Informar"],
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
              name: "address",
              label: "Endereço",
              type: "string",
              required: false,
            },
            {
              fieldSection: "mainInfo",
              name: "phone1",
              label: "Telefone 1",
              type: "string",
              required: false,
            },
            {
              fieldSection: "mainInfo",
              name: "phone2",
              label: "Telefone 2",
              type: "string",
              required: false,
            },
            {
              fieldSection: "departmentInfo",
              name: "department",
              label: "Departamento",
              type: "dynamicData",
              dynamicData: "departments",
              required: false,
            },

            {
              fieldSection: "departmentInfo",
              name: "position",
              label: "Posição",
              type: "dynamicData",
              dynamicData: "positions",
              required: false,
            },
            {
              fieldSection: "socialMedia",
              name: "facebook",
              label: "Facebook",
              type: "string",
              required: false,
            },
            {
              fieldSection: "socialMedia",
              name: "instagram",
              label: "Instagram",
              type: "string",
              required: false,
            },
            {
              fieldSection: "socialMedia",
              name: "linkedin",
              label: "LinkedIn",
              type: "string",
              required: false,
            },
            {
              fieldSection: "socialMedia",
              name: "x",
              label: "X / Twitter",
              type: "string",
              required: false,
            },
          ],
        },
      },
      {
        label: "Gerente",
        icon: <Person4Icon />,
        modal: {
          name: "AddUser",
          label: "Gerente",
          femaleGender: false,
          maxWidth: "md",
          fieldsSections: [
            { name: "image", label: "Imagem" },
            { name: "mainInfo", label: "Informações Gerais" },
            { name: "departmentInfo", label: "Informações Internas" },
            { name: "socialMedia", label: "Redes Sociais" },
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
              name: "birthdate",
              label: "Data de Nascimento",
              type: "date",
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
              name: "gender",
              label: "Gênero",
              type: "select",
              required: false,
              options: ["Masculino", "Feminino", "Outro", "Não Informar"],
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
              name: "address",
              label: "Endereço",
              type: "string",
              required: false,
            },
            {
              fieldSection: "mainInfo",
              name: "phone1",
              label: "Telefone 1",
              type: "string",
              required: false,
            },
            {
              fieldSection: "mainInfo",
              name: "phone2",
              label: "Telefone 2",
              type: "string",
              required: false,
            },
            {
              fieldSection: "departmentInfo",
              name: "department",
              label: "Departamento",
              type: "dynamicData",
              dynamicData: "departments",
              required: false,
            },

            {
              fieldSection: "departmentInfo",
              name: "position",
              label: "Posição",
              type: "dynamicData",
              dynamicData: "positions",
              required: false,
            },
            {
              fieldSection: "socialMedia",
              name: "facebook",
              label: "Facebook",
              type: "string",
              required: false,
            },
            {
              fieldSection: "socialMedia",
              name: "instagram",
              label: "Instagram",
              type: "string",
              required: false,
            },
            {
              fieldSection: "socialMedia",
              name: "linkedin",
              label: "LinkedIn",
              type: "string",
              required: false,
            },
            {
              fieldSection: "socialMedia",
              name: "x",
              label: "X / Twitter",
              type: "string",
              required: false,
            },
          ],
        },
      },
    ],
  },
  {
    page: "departments",
    pageButtonOptions: [
      {
        label: "Departamento",
        icon: <LanIcon />,
        modal: {
          name: "AddDepartment",
          label: "Departamento",
          femaleGender: false,
          maxWidth: "md",
          fieldsSections: [
            { name: "mainInfo", label: "Informações Gerais" },
            { name: "peopleInfo", label: "Pessoas" },
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
              name: "type",
              label: "Tipo de Departamento",
              type: "select",
              required: true,
              options: ["Serviços", "Vendas", "Interno"],
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
              name: "email",
              label: "E-mail",
              type: "string",
              required: false,
            },
            {
              fieldSection: "peopleInfo",
              name: "manager",
              label: "Gerente",
              type: "dynamicData",
              dynamicData: "managers",
              required: false,
            },
            {
              fieldSection: "peopleInfo",
              name: "members",
              label: "Membros",
              type: "dynamicData",
              dynamicData: "users",
              required: false,
            },
          ],
        },
      },
      {
        label: "Grupo",
        icon: <GroupsIcon />,
        modal: {
          name: "AddGroup",
          label: "Grupo",
          femaleGender: false,
          maxWidth: "xs",
          fieldsSections: [
            { name: "mainInfo", label: "Informações Gerais" },
            { name: "peopleInfo", label: "Pessoas" },
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
              name: "type",
              label: "Tipo de Grupo",
              type: "select",
              required: true,
              options: ["Serviços", "Vendas", "Interno"],
            },
            {
              fieldSection: "peopleInfo",
              name: "members",
              label: "Membros",
              type: "dynamicData",
              dynamicData: "users",
              required: false,
            },
          ],
        },
      },
    ],
  },
  {
    page: "services",
    pageButtonOptions: [
      {
        label: "Serviço",
        icon: <BuildIcon />,
        modal: {
          name: "AddService",
          label: "Serviço",
          femaleGender: false,
          maxWidth: "sm",
          fieldsSections: [
            { name: "mainInfo", label: "Informações Gerais" },
            { name: "serviceInfo", label: "Informações do Serviço" },
            { name: "materials", label: "Materiais Utilizados" },
          ],
          fields: [
            {
              fieldSection: "mainInfo",
              name: "name",
              label: "Nome do Serviço",
              type: "string",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "type",
              label: "Tipo de Serviço",
              type: "dynamicData",
              dynamicData: "serviceTypes",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "department",
              label: "Departamento",
              type: "dynamicData",
              dynamicData: "departments",
              required: true,
            },
            {
              fieldSection: "serviceInfo",
              name: "executiontime",
              label: "Tempo de Execução",
              type: "select",
              options: ["30 min", "1h", "1:30h", "2h", "2:30h", "3h ou mais"],
              required: true,
            },
            {
              fieldSection: "serviceInfo",
              name: "sessions",
              label: "Quantidade de Sessões",
              type: "select",
              options: ["1", "2", "3", "4", "5", "6", "7 ou mais"],
              required: true,
            },
            {
              fieldSection: "serviceInfo",
              name: "price",
              label: "Valor do Serviço",
              type: "currency",
              required: true,
            },
            {
              fieldSection: "materials",
              name: "materials",
              label: "",
              type: "materials",
              required: true,
            },
          ],
        },
      },
      {
        label: "Plano de Serviços",
        icon: <HubIcon />,
        modal: {
          name: "AddServicePlan",
          label: "Plano de Serviço",
          femaleGender: false,
          maxWidth: "xs",
          fieldsSections: [
            { name: "mainInfo", label: "Informações Gerais" },
            { name: "servicePlanInfo", label: "Informações do Plano" },
          ],
          fields: [
            {
              fieldSection: "mainInfo",
              name: "name",
              label: "Nome do Plano",
              type: "string",
              required: true,
            },
            {
              fieldSection: "mainInfo",
              name: "services",
              label: "Serviços",
              type: "dynamicData",
              dynamicData: "services",
              multiple: true,
              required: true,
            },
            {
              fieldSection: "servicePlanInfo",
              name: "price",
              label: "Valor do Plano",
              type: "currency",
              required: true,
            },
            {
              fieldSection: "servicePlanInfo",
              name: "period",
              label: "Período de Vigência",
              type: "select",
              options: [
                "Semanal",
                "Quinzenal",
                "Mensal",
                "Bimestral",
                "Trimestral",
                "Semestral",
                "Anual",
                "Outro",
              ],
              required: true,
            },
          ],
        },
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
