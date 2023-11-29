const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const StockItem = require("../models/StockItem");
const Quote = require("../models/Quote");
const Manager = require("../models/Manager");
const FinanceIncome = require("../models/FinanceIncome");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

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
      customer: req.body.customer.name,
      department: req.body.department.name,
      user: req.body.worker.name,
      manager: req.body.manager.name,
      service: req.body.service.name,
      type: "job",
      local: req.body.local,
      scheduledTo: req.body.scheduledTo,
      createdBy: req.body.createdBy,
      value: req.body.price,
      materials: req.body.materials,
      materialsCost: req.body.materialsCost,
    });
    const savedQuote = await newQuote.save();
    const newIncome = new FinanceIncome({
      quote: savedQuote.number,
      title: req.body.title,
      customer: req.body.customer.name,
      department: req.body.department.name,
      user: req.body.worker.name,
      service: req.body.service.name,
      type: "job",
      commissioned: req.body.commissioned,
      commission: req.body.commission,
      items: req.body.materials,
      scheduledTo: req.body.scheduledTo,
      executedAt: "",
      paidAt: "",
      commentary: "",
      price: req.body.price,
    });
    const savedIncome = await newIncome.save();

    const doc = new PDFDocument();

    // Construa o caminho completo para o arquivo PDF na pasta estática
    const pdfPath = path.join(
      __dirname,
      "../../uploads/docs",
      `orcamento-${newQuote.type[0]}-${newQuote.number}.pdf`
    );

    doc.pipe(fs.createWriteStream(pdfPath));

    doc.image("../uploads/logo.png", 0, 15, { width: 120 });

    doc
      .fontSize(16)
      .text(`Orçamento de ${newQuote.type === "job" ? "Serviço" : "Venda"}`, {
        align: "center",
      });
    doc.moveDown();

    doc.fontSize(12);
    doc.text("Número do Orçamento:", 120, 120, { align: "left" });
    doc.text(savedQuote.number, 380, 120, { align: "right" });
    doc.text("Título:", 120, 140, { align: "left" });
    doc.text(savedQuote.title, 380, 140, { align: "right" });
    doc.text("Descrição:", 120, 160, { align: "left" });
    doc.text(savedQuote.description, 380, 160, { align: "right" });
    doc.text("Cliente:", 120, 180, { align: "left" });
    doc.text(savedQuote.customer, 380, 180, { align: "right" });
    doc.text("Serviço:", 120, 200, { align: "left" });
    doc.text(savedQuote.service, 380, 200, { align: "right" });
    doc.text("Departamento:", 120, 220, { align: "left" });
    doc.text(savedQuote.department, 380, 220, { align: "right" });
    doc.text("Colaborador:", 120, 240, { align: "left" });
    doc.text(savedQuote.user, 380, 240, { align: "right" });
    doc.text("Gerente Responsável:", 120, 260, { align: "left" });
    doc.text(savedQuote.manager, 380, 260, { align: "right" });
    doc.text("Local de Execução:", 120, 280, { align: "left" });
    doc.text(savedQuote.local, 380, 280, { align: "right" });
    doc.text("Agendado para:", 120, 300, { align: "left" });
    doc.text(savedQuote.scheduledTo, 380, 300, { align: "right" });
    doc.text("Criado por:", 120, 320, { align: "left" });
    doc.text(savedQuote.createdBy, 380, 320, { align: "right" });

    let yPosition = 245;

    doc.text("Lista de Materiais", 120, yPosition + 15, { align: "left" });
    for (const material of savedQuote.materials) {
      doc.text(material.name, 130, yPosition + 30, { align: "left" });
      doc.text(
        "x" + material.quantity + " " + "R$" + material.sellValue,
        250,
        yPosition + 30,
        { align: "right" }
      );
      yPosition += 30;
    }

    doc.text("Valor dos Materiais:", 120, yPosition + 50, { align: "left" });
    doc.text(`R$${savedQuote.materialsCost.toFixed(2)}`, 350, yPosition + 50, {
      align: "right",
    });

    doc.text("Valor Total:", 120, yPosition + 70, { align: "left" });
    doc.text(`R$${savedQuote.value.toFixed(2)}`, 420, yPosition + 70, {
      align: "right",
    });

    doc.moveDown();

    doc.end();

    res.status(200).json({ savedRequest, savedQuote, savedIncome });
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

// UPDATE JOB
router.put("/", async (req, res) => {
  try {
    const jobId = req.body.jobId;
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
    } else if (option === "requestApproval") {
      const notifiedManager = await Manager.findOneAndUpdate(
        { _id: manager.id },
        {
          $push: {
            notifications: {
              status: "Não Lida",
              itemId: jobId,
              sender: worker,
              receiver: manager,
              body: `Olá ${manager.name}! O(a) colaborador(a) 
        ${worker.name} solicitou aprovação para o job "${req.body.job.title}" em ${req.body.date}.`,
              sentDate: req.body.date,
            },
          },
        },
        { new: true }
      );

      const updatedJob = await Job.findByIdAndUpdate(
        jobId,
        {
          $set: {
            status: "Aprovação Solicitada",
          },
          $push: {
            interactions: {
              number: req.body.number || 0,
              activity: `Aprovação solicitada a ${manager.name} para execução`,
              user: user.name,
              date: req.body.date,
            },
          },
        },
        { new: true }
      );

      res.status(200).json({ updatedJob, notifiedManager });
    } else if (option === "managerApproval") {
      const updatedJob = await Job.findByIdAndUpdate(
        jobId,
        {
          $set: {
            status: "Aprovado",
          },
          $push: {
            interactions: {
              number: req.body.number || 1,
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
