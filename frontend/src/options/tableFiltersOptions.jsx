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
      job: ["customer", "status"],
    },
    {
      sale: ["customer", "status"],
    },
  ],
  services: [
    {
      services: ["name", "type", "products", "price"],
    },
    {
      servicePlan: ["name", "period", "services", "price"],
    },
  ],
  stock: [
    {
      stockEntries: ["name", "products", "status", "price"],
    },
  ],
  finance: [
    {
      financeIncome: [
        "number",
        "type",
        "customer",
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
