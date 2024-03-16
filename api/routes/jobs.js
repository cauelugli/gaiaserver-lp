const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");
const Client = require("../models/Client");
const Job = require("../models/Job");
const StockItem = require("../models/StockItem");
const Quote = require("../models/Quote");
const Manager = require("../models/Manager");
const Agenda = require("../models/Agenda");
const FinanceIncome = require("../models/FinanceIncome");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");

// GET ALL JOBS
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// CREATE JOB
router.post("/", async (req, res) => {
  const newRequest = new Job(req.body);
  if (newRequest.materials.length > 0) {
    for (const material of newRequest.materials) {
      const stockItem = await StockItem.findById(material._id);
      stockItem.quantity -= material.quantity;
      await stockItem.save();
    }
  }

  try {
    const savedRequest = await newRequest.save();
    const newQuote = new Quote({
      number: savedRequest.quoteNumber,
      title: req.body.title,
      description: req.body.description,
      customer: req.body.customer,
      department: req.body.department.name,
      user: req.body.worker.name,
      manager: req.body.manager.name,
      service: req.body.service.name,
      serviceValue: req.body.service.value,
      type: "job",
      local: req.body.local,
      scheduledTo: req.body.selectedSchedule
        ? req.body.selectedSchedule
        : req.body.scheduledTo,
      createdBy: req.body.createdBy,
      value: req.body.price,
      materials: req.body.materials,
      materialsCost: req.body.materialsCost,
    });
    const savedQuote = await newQuote.save();

    const recentRequestData = {
      number: savedQuote.number,
      title: savedQuote.title,
      type: "job",
      date: savedQuote.createdAt,
      requester: req.body.requester,
    };

    let updatedClient;
    let updatedCustomer;

    if (req.body.customer.type === "Client") {
      updatedClient = await Client.findByIdAndUpdate(
        req.body.customer.id,
        {
          $push: { recentRequests: recentRequestData },
        },
        { new: true }
      );
    } else if (req.body.customer.type === "Customer") {
      updatedCustomer = await Customer.findByIdAndUpdate(
        req.body.customer.id,
        {
          $push: { recentRequests: recentRequestData },
        },
        { new: true }
      );
    }

    if (req.body.selectedSchedule) {
      const workerId = req.body.worker.id;
      const [date, startTime, endTime] = req.body.selectedSchedule.split(" - ");
      const start = `${date} ${startTime}`;
      const end = `${date} ${endTime}`;

      await Agenda.findOneAndUpdate(
        {},
        {
          $push: {
            [`events.${workerId}`]: {
              title: req.body.title,
              start,
              end,
              status: "Aberto",
              type: { name: "Job", color: "#4a90e2" },
              customer: req.body.customer.name,
              service: req.body.service.name,
            },
          },
        },
        { new: true }
      );
    }

    // START PDF
    const doc = new PDFDocument();

    const pdfPath = path.join(
      __dirname,
      "../../uploads/docs",
      `orcamento-${savedQuote.type[0]}-${savedQuote.number}.pdf`
    );

    doc.pipe(fs.createWriteStream(pdfPath));

    doc.image("../uploads/logo.png", 5, 5, { width: 120 });
    if (req.body.customer.image) {
      doc.image(`../uploads/${req.body.customer.image}`, 450, 5, {
        width: 120,
      });
    }
    doc.moveUp(3);

    doc
      .fontSize(16)
      .text(
        `Orçamento de ${
          savedQuote.type === "job"
            ? `Serviço #${savedQuote.number}`
            : `Venda #${savedQuote.number}`
        }`,
        200,
        10
      );
    doc.fontSize(11);

    doc
      .moveTo(10, 50)
      .lineTo(doc.page.width - 10, 50)
      .strokeColor("lightgrey")
      .stroke();
    doc.text(`Cliente: ${savedQuote.customer.name}`, 10, 55);
    doc.text(`Serviço: ${savedQuote.service}`, 210, 55);
    doc.text(`Título: ${savedQuote.title}`, 410, 55);
    doc.moveDown();

    doc
      .moveTo(10, 90)
      .lineTo(doc.page.width - 10, 90)
      .strokeColor("lightgrey")
      .stroke();
    doc.text(`Descrição: ${savedQuote.description}`, 10, 95);

    doc
      .moveTo(10, 170)
      .lineTo(doc.page.width - 10, 170)
      .strokeColor("lightgrey")
      .stroke();
    doc.text(`Departamento: ${savedQuote.department}`, 10, 175);
    doc.text(`Colaborador: ${savedQuote.user}`, 210, 175);
    doc.text(`Gerente: ${savedQuote.manager}`, 410, 175);
    doc.moveDown();

    doc
      .moveTo(10, 210)
      .lineTo(doc.page.width - 10, 210)
      .strokeColor("lightgrey")
      .stroke();
    doc.text(
      `Agendado para: ${dayjs(savedQuote.scheduledTo).format("DD/MM/YYYY")}`,
      10,
      215
    );
    doc.text(`Local: ${savedQuote.local}`, 210, 215);
    doc.text(`Criador: ${savedQuote.createdBy}`, 410, 215);
    doc.moveDown(4);

    doc
      .moveTo(10, 250)
      .lineTo(doc.page.width - 10, 250)
      .strokeColor("lightgrey")
      .stroke();
    doc.text("Lista de Materiais", 15, 255);
    doc.moveDown();

    for (const material of savedQuote.materials) {
      doc.image(`../uploads/${material.image}`, 15, doc.y, {
        width: 32,
        align: "left",
      });

      doc.text(
        `${material.name} x${material.quantity} R$${material.sellValue}`,
        55,
        doc.y - 20 - 0
      );

      doc.moveDown();
    }

    doc.moveDown();

    doc.text(`Total de Materiais = R$${savedQuote.materialsCost.toFixed(2)}`, {
      align: "right",
    });
    doc.moveDown(0.5);

    doc.text(`Valor do Serviço = R$${savedQuote.serviceValue.toFixed(2)}`, {
      align: "right",
    });
    doc.moveDown(0.5);

    doc.text(`Valor Total da Nota = R$${savedQuote.value.toFixed(2)}`, {
      align: "right",
    });
    doc.moveDown();

    doc.end();
    // END PDF

    res
      .status(200)
      .json({ savedRequest, savedQuote, updatedClient, updatedCustomer });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE JOB
router.delete("/:id", async (req, res) => {
  const requestId = req.params.id;
  try {
    const deletedRequest = await Job.findByIdAndDelete(requestId);
    res.status(200).json(deletedRequest);
  } catch (err) {
    res.status(500).json(err);
  }
});

// REQUEST APPROVAL JOB
router.put("/requestApproval", async (req, res) => {
  try {
    const jobId = req.body.jobId || req.body.job._id;
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        $set: {
          status: "Aprovação Solicitada",
        },
        $push: {
          interactions: {
            number: req.body.number || 1,
            activity: `Aprovação solicitada a ${req.body.job.manager.name} para execução`,
            user: req.body.user.name,
            date: req.body.date,
          },
        },
      },
      { new: true }
    );

    res.status(200).json({ updatedJob });
  } catch (err) {
    console.log("err", err);
    res.status(500).json(err);
  }
});

// UPDATE JOB
router.put("/", async (req, res) => {
  try {
    const jobId = req.body.jobId || req.body.job._id;
    const option = req.body.option;
    const status = req.body.status;
    const user = req.body.user;
    const manager = req.body.manager;
    const worker = req.body.worker;

    if (option === "interaction") {
      const updatedJob = await Job.findOneAndUpdate(
        { _id: jobId },
        {
          $set: {
            status: status,
          },
          $push: {
            interactions: {
              number: req.body.number || 1,
              activity: req.body.activity,
              user: user.name,
              date: req.body.date,
              reactions: {
                love: { quantity: 0, usersReacted: [] },
                like: { quantity: 0, usersReacted: [] },
                dislike: { quantity: 0, usersReacted: [] },
                haha: { quantity: 0, usersReacted: [] },
              },
            },
          },
        },
        { new: true }
      );
      res.status(200).json(updatedJob);
    } else if (option === "managerApproval") {
      const updatedJob = await Job.findByIdAndUpdate(
        jobId,
        {
          $set: {
            status: "Aprovado",
          },
          $push: {
            interactions: {
              number: req.body.number || 2,
              activity: "Job aprovado para execução",
              user: req.body.user,
              date: req.body.date,
            },
          },
        },
        { new: true }
      );

      res.status(200).json(updatedJob);
    } else if (option === "reaction") {
      const job = await Job.findById(jobId);

      if (!job) {
        return res.status(404).json({ error: "Job não encontrado" });
      }

      const reactionType = req.body.reactionType;
      const reactionField = `interactions.$.reactions.${reactionType}.quantity`;
      const usersReactedField = `interactions.$.reactions.${reactionType}.usersReacted`;

      const userAlreadyReacted = job.interactions.some((interaction) => {
        return (
          interaction.number === req.body.number &&
          interaction.reactions[reactionType].usersReacted.includes(user._id)
        );
      });

      if (userAlreadyReacted) {
        // Usuário já reagiu, então decrementa a quantidade e remove o usuário do conjunto
        const updatedJob = await Job.findOneAndUpdate(
          { _id: jobId, "interactions.number": req.body.number },
          {
            $inc: { [reactionField]: -1 },
            $pull: { [usersReactedField]: worker.id },
          },
          { new: true }
        );

        res.status(200).json(updatedJob);
      } else {
        // Continua com a atualização apenas se o usuário ainda não reagiu
        const updatedJob = await Job.findOneAndUpdate(
          { _id: jobId, "interactions.number": req.body.number },
          {
            $inc: { [reactionField]: 1 },
            $addToSet: { [usersReactedField]: user._id },
          },
          { new: true }
        );

        res.status(200).json(updatedJob);
      }
    } else if (option === "edit") {
      const updatedJob = await Job.findByIdAndUpdate(
        jobId,
        {
          title: req.body.title,
          description: req.body.description,
          requester: req.body.requester,
          department: req.body.department,
          worker: req.body.worker,
          manager: req.body.manager,
          service: req.body.service,
          price: req.body.price,
          local: req.body.local,
          scheduledTo: req.body.scheduledTo,
        },
        { new: true }
      );
      res.status(200).json(updatedJob);
    } else if (option === "resolve") {
      const updatedJob = await Job.findByIdAndUpdate(
        jobId,
        {
          status: "Concluido",
          resolution: req.body.activity,
          resolvedBy: user.name,
          resolvedAt: new Date()
            .toLocaleDateString("pt-BR")
            .replace(/\//g, "-"),
        },
        { new: true }
      );
      const newIncome = new FinanceIncome({
        quote: updatedJob.quoteNumber,
        title: updatedJob.title,
        customer: updatedJob.customer.name,
        department: updatedJob.department.name,
        user: updatedJob.worker.name,
        service: updatedJob.service.name,
        type: "job",
        commissioned: updatedJob.commissioned,
        commission: updatedJob.commission,
        items: updatedJob.materials,
        scheduledTo: updatedJob.scheduledTo,
        resolvedAt: new Date().toLocaleDateString("pt-BR").replace(/\//g, "-"),
        paidAt: "",
        commentary: "",
        price: updatedJob.price,
      });
      const savedIncome = await newIncome.save();

      res.status(200).json(updatedJob);
    } else {
      res.status(400).json({ error: "Opção inválida" });
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).json(err);
  }
});

module.exports = router;
