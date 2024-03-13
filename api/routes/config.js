const express = require("express");
const router = express.Router();
const Config = require("../models/Config");

// CREATE INITIAL CONFIG
router.post("/", async (req, res) => {
  const newConfig = new Config();
  try {
    const createdConfig = await newConfig.save();
    res.status(200).json(createdConfig);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//GET ALL CONFIGS
router.get("/", async (req, res) => {
  try {
    const configs = await Config.find();
    res.status(200).json(configs);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET CUSTOMERS CONFIGS
router.get("/customers", async (req, res) => {
  try {
    const config = await Config.findOne();
    const requestsConfig = config ? config.customers : null;
    res.status(200).json(requestsConfig);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CUSTOMERS
router.put("/customers", async (req, res) => {
  try {
    const {
      customersCanBeDeleted,
      clientsCanBeDeleted,
      allowSameNameCustomer,
    } = req.body;

    const config = await Config.findOne();

    config.customers.customersCanBeDeleted = customersCanBeDeleted;
    config.customers.clientsCanBeDeleted = clientsCanBeDeleted;
    config.customers.allowSameNameCustomer = allowSameNameCustomer;

    await config.save();
    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET USERS CONFIGS
router.get("/users", async (req, res) => {
  try {
    const config = await Config.findOne();
    const requestsConfig = config ? config.users : null;
    res.status(200).json(requestsConfig);
  } catch (err) {
    res.status(500).json(err);
  }
});

// USERS
router.put("/users", async (req, res) => {
  try {
    const { usersCanBeDeleted, managersCanBeDeleted } = req.body;

    const config = await Config.findOne();

    config.users.usersCanBeDeleted = usersCanBeDeleted;
    config.users.managersCanBeDeleted = managersCanBeDeleted;

    await config.save();
    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET REQUESTS CONFIGS
router.get("/requests", async (req, res) => {
  try {
    const config = await Config.findOne();
    const requestsConfig = config ? config.requests : null;
    res.status(200).json(requestsConfig);
  } catch (err) {
    res.status(500).json(err);
  }
});

// REQUESTS
router.put("/requests", async (req, res) => {
  try {
    const { requestsNeedApproval, requestsCanBeDeleted } = req.body;

    const config = await Config.findOne();

    config.requests.requestsNeedApproval = requestsNeedApproval;
    config.requests.canBeDeleted = requestsCanBeDeleted;

    await config.save();
    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET STOCK CONFIGS
router.get("/stock", async (req, res) => {
  try {
    const config = await Config.findOne();
    const requestsConfig = config ? config.stock : null;
    res.status(200).json(requestsConfig);
  } catch (err) {
    res.status(500).json(err);
  }
});

// STOCK
router.put("/stock", async (req, res) => {
  try {
    const {
      stockentriesDispatcherDepartment,
      stockEntriesNeedApproval,
      stockEntriesCanBeChallenged,
    } = req.body;

    const config = await Config.findOne();

    config.stock.stockentriesDispatcherDepartment =
      stockentriesDispatcherDepartment;
    config.stock.stockEntriesNeedApproval = stockEntriesNeedApproval;
    config.stock.stockEntriesCanBeChallenged = stockEntriesCanBeChallenged;

    await config.save();
    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET QUOTES CONFIGS
router.get("/quotes", async (req, res) => {
  try {
    const config = await Config.findOne();
    const requestsConfig = config ? config.quotes : null;
    res.status(200).json(requestsConfig);
  } catch (err) {
    res.status(500).json(err);
  }
});

// QUOTES
router.put("/quotes", async (req, res) => {
  try {
    const { canBeDeleted } = req.body;

    const config = await Config.findOne();

    config.quotes.canBeDeleted = canBeDeleted;

    await config.save();
    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET PROJECTS CONFIGS
router.get("/projects", async (req, res) => {
  try {
    const config = await Config.findOne();
    const projectsConfig = config ? config.projects : null;
    res.status(200).json(projectsConfig);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PROJECTS
router.put("/projects", async (req, res) => {
  try {
    const { canBeDeleted, projectTypes, notifyWhenProjectIsCreated } = req.body;

    const config = await Config.findOne();

    config.projects.canBeDeleted = canBeDeleted;
    config.projects.projectTypes = projectTypes;
    config.projects.notifyWhenProjectIsCreated = notifyWhenProjectIsCreated;

    await config.save();
    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET AGENDA CONFIGS
router.get("/agenda", async (req, res) => {
  try {
    const config = await Config.findOne();
    const agendaConfig = config ? config.agenda : null;
    res.status(200).json(agendaConfig);
  } catch (err) {
    res.status(500).json(err);
  }
});

// AGENDA
router.put("/agenda", async (req, res) => {
  try {
    const { minTime, maxTime, newJobEventTypeColor } = req.body;

    let eventTypes = req.body.eventTypes;

    const config = await Config.findOne();

    config.agenda.minTime = minTime;
    config.agenda.maxTime = maxTime;

    if (newJobEventTypeColor) {
      eventTypes[0] = {
        name: "Job",
        color: newJobEventTypeColor,
      };
    }

    config.agenda.eventTypes = eventTypes;

    await config.save();
    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET FINANCE CONFIGS
router.get("/finance", async (req, res) => {
  try {
    const config = await Config.findOne();
    const financeConfig = config ? config.finance : null;
    res.status(200).json(financeConfig);
  } catch (err) {
    res.status(500).json(err);
  }
});

// QUOTES
router.put("/finance", async (req, res) => {
  try {
    const { canReceiveInstallments } = req.body;

    const config = await Config.findOne();

    config.finance.canReceiveInstallments = canReceiveInstallments;

    await config.save();
    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// CUSTOMIZATION
router.put("/customization", async (req, res) => {
  try {
    const { mainColor, fontColor, logo, logoBlack } = req.body;

    const config = await Config.findOne();

    config.customization.mainColor = mainColor;
    config.customization.fontColor = fontColor;
    config.customization.logo = logo;
    config.customization.logoBlack = logoBlack;

    await config.save();
    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET DEPARTMENTS CONFIGS
router.get("/departments", async (req, res) => {
  try {
    const config = await Config.findOne();
    const requestsConfig = config ? config.departments : null;
    res.status(200).json(requestsConfig);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DEPARTMENTS
router.put("/departments", async (req, res) => {
  try {
    const { departmentsCanBeDeleted, departmentsNeedManager } = req.body;

    const config = await Config.findOne();

    config.departments.departmentsCanBeDeleted = departmentsCanBeDeleted;
    config.departments.departmentsNeedManager = departmentsNeedManager;

    await config.save();
    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET SECURITY CONFIGS
router.get("/security", async (req, res) => {
  try {
    const config = await Config.findOne();
    const requestsConfig = config ? config.security : null;
    res.status(200).json(requestsConfig);
  } catch (err) {
    res.status(500).json(err);
  }
});

// SECURITY
router.put("/security", async (req, res) => {
  try {
    const { passwordComplexity } = req.body;

    const config = await Config.findOne();

    config.security.passwordComplexity = passwordComplexity;

    await config.save();
    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET SIDEBAR CONFIGS
router.get("/sidebar", async (req, res) => {
  try {
    const config = await Config.findOne();
    const sidebarConfig = config ? config.sidebar : null;
    res.status(200).json(sidebarConfig);
  } catch (err) {
    res.status(500).json(err);
  }
});

// SIDEBAR
router.put("/sidebar", async (req, res) => {
  try {
    const payload = req.body;

    // Extrair ID e nome de cada item em cada array
    const updatedPayload = {};
    Object.keys(payload).forEach((key) => {
      updatedPayload[key] = payload[key].map((item) => ({
        _id: item._id,
        name: item.name,
      }));
    });

    // Atualizar o objeto config com ID e nome
    const config = await Config.findOneAndUpdate(
      {},
      { sidebar: updatedPayload },
      { new: true }
    );

    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET NOTIFICATIONS CONFIGS
router.get("/notifications", async (req, res) => {
  try {
    const config = await Config.findOne();
    const sidebarConfig = config ? config.notifications : null;
    res.status(200).json(sidebarConfig);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET NOTIFICATIONS BOOLEANS CONFIGS
router.get("/notificationsBooleans", async (req, res) => {
  try {
    const config = await Config.findOne();
    const sidebarConfig = config ? config.notificationsBooleans : null;
    res.status(200).json(sidebarConfig);
  } catch (err) {
    res.status(500).json(err);
  }
});

// NOTIFICATIONS
router.put("/notifications", async (req, res) => {
  try {
    const { notifications, notificationsBooleans } = req.body;

    const updatedNotifications = {};
    Object.keys(notifications).forEach((key) => {
      updatedNotifications[key] = notifications[key].map((item) => ({
        _id: item._id,
        name: item.name,
      }));
    });

    const config = await Config.findOneAndUpdate(
      {},
      { notifications: updatedNotifications, notificationsBooleans },
      { new: true }
    );

    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET TABLES CONFIGS
router.get("/tables", async (req, res) => {
  try {
    const config = await Config.findOne();
    const sidebarConfig = config ? config.tables : null;
    res.status(200).json(sidebarConfig);
  } catch (err) {
    res.status(500).json(err);
  }
});

// TABLES
router.put("/tables", async (req, res) => {
  try {
    const payload = req.body;
    const config = await Config.findOneAndUpdate(
      {},
      { tables: payload },
      { new: true }
    );

    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
