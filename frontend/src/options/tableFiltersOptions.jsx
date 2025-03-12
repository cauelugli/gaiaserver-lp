const tableFiltersOptions = {
  customers: [
    {
      customer: ["name", "mainContactName", "address"],
    },
    {
      client: ["name", "email", "addressHome"],
    },
  ],
  requests: [
    {
      job: ["customer", "worker", "status"],
    },
    {
      sale: ["customer", "seller", "status"],
    },
  ],
  users: [
    {
      users: ["name", "department", "position"],
    },
    {
      managers: ["name", "department", "position"],
    },
  ],
  departments: [
    {
      departments: ["name", "type", "members"],
    },
    {
      groups: ["name", "members"],
    },
  ],
  services: [
    {
      services: ["name", "type", "department", "products", "price"],
    },
    {
      servicePlan: ["name", "period", "services", "price"],
    },
  ],
  stock: [
    {
      stockEntries: ["name", "products", "createdBy", "status", "price"],
    },
  ],
  finance: [
    {
      financeIncome: [
        "number",
        "type",
        "customer",
        "user",
        "items",
        "price",
        "status",
        "createdAt",
      ],
    },
    {
      financeOutcome: ["number", "type", "items", "price", "status"],
    },
  ],
};

export const getTableFiltersOptions = (page, tabIndex) => {
  if (tableFiltersOptions[page] && tableFiltersOptions[page][tabIndex]) {
    return tableFiltersOptions[page][tabIndex];
  }
  return {};
};
