const express = require("express");
const router = express.Router();
const ServicePlan = require("../../models/models/ServicePlan");

// GET ALL SERVICE PLANS
router.get("/", async (req, res) => {
  try {
    const servicePlans = await ServicePlan.find();
    res.status(200).json(servicePlans);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE SERVICE PLAN
router.post("/", async (req, res) => {
  const { name } = req.body;
  const existingName = await ServicePlan.findOne({ name });
  if (existingName) {
    return res.status(422).json({ error: "Nome do Plano já cadastrado" });
  }
  const newServicePlan = new ServicePlan(req.body);
  try {
    const savedServicePlan = await newServicePlan.save();
    res.status(200).json(savedServicePlan);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE SERVICE PLAN
router.delete("/:id", async (req, res) => {
  const servicePlanId = req.params.id;
  try {
    const deletedServicePlan = await ServicePlan.findByIdAndDelete(servicePlanId);
    res.status(200).json(deletedServicePlan);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE SERVICE PLAN
router.put("/", async (req, res) => {
  const { name } = req.body;
  const existingName = await Service.findOne({ name });
  if (existingName) {
    if (existingName.name !== req.body.previousData.name) {
      return res.status(422).json({ error: "Nome de Serviço já cadastrado" });
    }
  }

  try {
    const { serviceId, materials, previousMaterials } = req.body;

    const validMaterials = materials.filter(
      (material) => material.quantity > 0
    );

    const missingItems = previousMaterials.filter(
      (previousItem) =>
        !validMaterials.some(
          (currentItem) => currentItem._id === previousItem._id
        )
    );

    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      {
        name: req.body.name,
        department: req.body.department,
        value: req.body.value,
        materials: validMaterials,
        materialsCost: req.body.materialsCost,
      },
      { new: true }
    );

    let updatedDepartment;

    req.body.previousData.department
      ? req.body.department.id !== req.body.previousData.department.id
        ? (await Department.findByIdAndUpdate(
            req.body.previousData.department.id,
            { $pull: { services: { id: req.body.previousData._id } } },
            { new: true }
          ),
          (updatedDepartment = await Department.findByIdAndUpdate(
            req.body.department.id,
            {
              $push: {
                services: {
                  id: req.body.serviceId,
                  name: req.body.name,
                },
              },
            },
            { new: true }
          )))
        : (updatedDepartment = await Department.findOneAndUpdate(
            {
              _id: req.body.department.id,
              "services.id": req.body.serviceId,
            },
            {
              $set: {
                "services.$.name": req.body.name,
              },
            },
            { new: true }
          ))
      : (updatedDepartment = await Department.findByIdAndUpdate(
          req.body.department.id,
          {
            $push: {
              services: {
                id: req.body.serviceId,
                name: req.body.name,
              },
            },
          },
          { new: true }
        ));

    res.status(200).json({ updatedService, updatedDepartment });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
