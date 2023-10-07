const express = require("express");
const router = express.Router();
const Manager = require("../models/Manager");
const Department = require("../models/Department");

// GET ALL MANAGERS
router.get("/", async (req, res) => {
  try {
    const users = await Manager.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE MANAGER
router.post("/", async (req, res) => {
  const { name, email } = req.body;
  const existingName = await Manager.findOne({ name });
  const existingEmail = await Manager.findOne({ email });
  if (existingName) {
    return res.status(422).json({ error: "Nome de Gerente já cadastrado" });
  }
  if (existingEmail) {
    return res.status(422).json({ error: "E-mail já cadastrado" });
  }

  const newManager = new Manager(req.body);
  try {
    const savedManager = await newManager.save();

    let updatedDepartment;

    // Adds the new manager to a department
    updatedDepartment = await Department.findByIdAndUpdate(
      req.body.department.id,
      {
        manager: {
          id: savedManager._id.toString(),
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
        },
      },
      { new: true }
    );

    res.status(200).json({ savedManager, updatedDepartment });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE MANAGER
router.delete("/:id", async (req, res) => {
  const managerId = req.params.id;
  let updatedDepartment;
  try {
    const deletedManager = await Manager.findByIdAndDelete(managerId);

    {
      deletedManager.department &&
        updatedDepartment ==
          (await Department.findByIdAndUpdate(
            deletedManager.department.id,
            { $set: { manager: "" } },
            { new: true }
          ));
    }

    res.status(200).json({ deletedManager, updatedDepartment });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// UPDATE MANAGER
router.put("/", async (req, res) => {
  const { name, email } = req.body;
  const existingName = await Manager.findOne({ name });
  const existingEmail = await Manager.findOne({ email });

  if (existingName) {
    if (existingName.name !== req.body.previousData.name) {
      return res.status(422).json({ error: "Nome de Gerente já cadastrado" });
    }
  }
  if (existingEmail) {
    if (existingEmail.email !== req.body.previousData.email) {
      return res.status(422).json({ error: "E-mail já cadastrado" });
    }
  }
  try {
    const updatedManager = await Manager.findByIdAndUpdate(
      req.body.managerId,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.body.image,
        department: req.body.department,
      },
      { new: true }
    );

    let updatedDepartment;

    updatedManager.department.id
      ? updatedManager.department.id && req.body.previousData.department
        ? updatedManager.department.id === req.body.previousData.department.id
          ? // SAME DEPT, UPDATES ONLY NEW DEPARTMENT
            (updatedDepartment = await Department.findOneAndUpdate(
              {
                _id: req.body.department.id,
              },
              {
                $set: {
                  manager: {
                    id: updatedManager.id,
                    name: updatedManager.name,
                    email: updatedManager.email,
                    phone: updatedManager.phone,
                  },
                },
              },
              { new: true }
            ))
          : // CHANGING DEPTs, UPDATES PREVIOUS AND NEW DEPARTMENT
            (await Department.findByIdAndUpdate(
              req.body.previousData.department.id,
              {
                manager: "",
              }
            ),
            (updatedDepartment = await Department.findByIdAndUpdate(
              req.body.department.id,
              {
                manager: {
                  id: updatedManager.id,
                  name: updatedManager.name,
                  email: updatedManager.email,
                  phone: updatedManager.phone,
                },
              },
              { new: true }
            )))
        : // ADDS MANAGER, BECAUSE HE/SHE NEVER HAD A DEPT PREVIOUSLY
          (updatedDepartment = await Department.findByIdAndUpdate(
            req.body.department.id,
            {
              manager: {
                id: updatedManager.id,
                name: updatedManager.name,
                email: updatedManager.email,
                phone: updatedManager.phone,
              },
            },
            { new: true }
          ))
      : console.log("");
      
    res.status(200).json({ updatedManager, updatedDepartment });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
