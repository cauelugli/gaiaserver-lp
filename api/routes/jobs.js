const express = require("express");
const router = express.Router();
const Customer = require("../../models/models/Customer");
const Client = require("../../models/models/Client");
const Job = require("../../models/models/Job");
const StockItem = require("../../models/models/StockItem");
const Quote = require("../../models/models/Quote");
const User = require("../../models/models/User");
const Agenda = require("../../models/models/Agenda");
const FinanceIncome = require("../../models/models/FinanceIncome");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");

// REQUEST APPROVAL JOB
router.put("/requestApproval", async (req, res) => {
  try {
    const jobId = req.body.jobId;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    const interactionNumber = job.interactions.length + 1;

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        $set: {
          status: "Aprovação Solicitada",
        },
        $push: {
          interactions: {
            number: interactionNumber,
            activity: `Aprovação solicitada a ${req.body.jobManager} para execução`,
            user: req.body.user,
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

// MANAGE APPROVAL FOR JOB
router.put("/managerApproval", async (req, res) => {
  try {
    const jobId = req.body.jobId || req.body.job._id;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    const interactionNumber = job.interactions.length + 1;

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        $set: {
          status: "Aprovado",
        },
        $push: {
          interactions: {
            number: interactionNumber,
            activity: "Job aprovado para execução",
            user: req.body.user,
            date: req.body.date,
          },
        },
      },
      { new: true }
    );

    res.status(200).json(updatedJob);
  } catch (err) {
    console.log("err", err);
    res.status(500).json(err);
  }
});

// ADD JOB INTERACTION
router.put("/interaction", async (req, res) => {
  try {
    const jobId = req.body.jobId || req.body.job._id;
    const userName = req.body.userName;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    const interactionNumber = job.interactions.length + 1;

    const updatedJob = await Job.findOneAndUpdate(
      { _id: jobId },
      {
        $push: {
          interactions: {
            number: interactionNumber,
            activity: req.body.activity,
            user: userName,
            date: req.body.date,
            attachments: req.body.attachments,
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
  } catch (err) {
    console.log("err", err);
    res.status(500).json(err);
  }
});

// REMOVE JOB INTERACTION
router.put("/interaction/remove", async (req, res) => {
  const { itemId, interactionId } = req.body;

  try {
    const job = await Job.findById(itemId);
    const updatedInteractions = job.interactions.filter(
      (interaction) => interaction._id.toString() !== interactionId
    );

    const updatedJob = await Job.findByIdAndUpdate(
      itemId,
      { $set: { interactions: updatedInteractions } },
      { new: true }
    );

    res.json(updatedJob);
  } catch (err) {
    console.error("Erro ao 'remover' interação:", err);
    res.status(500).send(err);
  }
});

// EDIT JOB
router.put("/edit", async (req, res) => {
  try {
    const jobId = req.body.jobId || req.body.job._id;
    const jobToUpdate = await Job.findById(jobId);
    const quoteToDelete = await Quote.findOne({ number: jobToUpdate.number });

    if (quoteToDelete) {
      // Construa o caminho para o PDF e exclua o arquivo
      const pdfPath = path.join(
        __dirname,
        "../../uploads/docs",
        `orcamento-j-${quoteToDelete.number}${
          quoteToDelete.version !== 0 ? `.${quoteToDelete.version}` : ""
        }.pdf`
      );
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      } else {
        console.log("NOT found PDF to delete");
      }

      await Quote.findByIdAndDelete(quoteToDelete._id);
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        title: req.body.title,
        customer: req.body.customer,
        customerType: req.body.customerType,
        description: req.body.description,
        requester: req.body.requester,
        department: req.body.department,
        worker: req.body.worker,
        manager: req.body.manager,
        service: req.body.service,
        price: req.body.price,
        local: req.body.local,
        scheduledTo: req.body.scheduledTo,
        number: jobToUpdate.number,
      },
      { new: true }
    );

    const newQuote = new Quote({
      number: jobToUpdate.number,
      title: updatedJob.title,
      description: updatedJob.description,
      customer: updatedJob.customer,
      department: updatedJob.department.name,
      user: updatedJob.worker.name,
      manager: updatedJob.manager.name,
      service: updatedJob.service.name,
      serviceValue: updatedJob.service.value,
      type: "job",
      local: updatedJob.local,
      scheduledTo: updatedJob.selectedSchedule
        ? updatedJob.selectedSchedule
        : updatedJob.scheduledTo,
      createdBy: updatedJob.createdBy,
      value: updatedJob.price,
      materials: updatedJob.materials,
      materialsCost: updatedJob.materialsCost,
      version: quoteToDelete.version || 0 + 1,
    });
    const savedQuote = await newQuote.save();

    // START PDF
    const doc = new PDFDocument();

    const pdfPath = path.join(
      __dirname,
      "../../uploads/docs",
      `orcamento-${savedQuote.type[0]}-${
        savedQuote.number
      }${`.${savedQuote.version}`}.pdf`
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

    res.status(200).json({ updatedJob, savedQuote });
  } catch (err) {
    console.log("err", err);
    res.status(500).json(err);
  }
});

// ADD JOB ATTACHMENTS
router.put("/addAttachments", async (req, res) => {
  const { itemId, attachments, userName, date } = req.body;

  try {
    const job = await Job.findById(itemId);
    const interactionNumber = job.interactions.length + 1;

    let updatedJob;

    if (attachments.length !== 0) {
      updatedJob = await Job.findOneAndUpdate(
        { _id: itemId },
        {
          $set: {
            attachments: [...job.attachments, ...attachments],
          },
          $push: {
            interactions: {
              number: interactionNumber,
              activity: `Colaborador ${userName} anexou ${
                attachments.length
              } arquivo${attachments.length === 1 ? "" : "s"} ao Job`,
              user: userName,
              date: date,
              attachments: attachments,
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
    }

    res
      .status(200)
      .json({ message: "Attachments added successfully", job: updatedJob });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred", error: err });
  }
});

// RESOLVE JOB
router.put("/resolve", async (req, res) => {
  try {
    const jobId = req.body.jobId;
    const userName = req.body.userName;
    const resolution = req.body.resolution;

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        status: "Concluido",
        resolution: resolution,
        resolvedBy: userName,
        resolvedAt: new Date().toLocaleDateString("pt-BR").replace(/\//g, "-"),
      },
      { new: true }
    );

    const newIncome = new FinanceIncome({
      quote: updatedJob.quoteNumber,
      title: updatedJob.title,
      customer: updatedJob.customer,
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

    res.status(200).json({ updatedJob, savedIncome });
  } catch (err) {
    console.log("err", err);
    res.status(500).json(err);
  }
});

// REACT TO JOB INTERATION
router.put("/reaction", async (req, res) => {
  try {
    const itemId = req.body.itemId;
    const userId = req.body.userId;

    const job = await Job.findById(itemId);

    const reactionType = req.body.reactionType;
    const reactionField = `interactions.$.reactions.${reactionType}.quantity`;
    const usersReactedField = `interactions.$.reactions.${reactionType}.usersReacted`;

    const userAlreadyReacted = job.interactions.some((interaction) => {
      return (
        interaction.number === req.body.number &&
        interaction.reactions[reactionType].usersReacted.includes(userId)
      );
    });

    if (userAlreadyReacted) {
      const updatedJob = await Job.findOneAndUpdate(
        { _id: itemId, "interactions.number": req.body.number },
        {
          $inc: { [reactionField]: -1 },
          $pull: { [usersReactedField]: userId },
        },
        { new: true }
      );

      res.status(200).json(updatedJob);
    } else {
      const updatedJob = await Job.findOneAndUpdate(
        { _id: itemId, "interactions.number": req.body.number },
        {
          $inc: { [reactionField]: 1 },
          $addToSet: { [usersReactedField]: userId },
        },
        { new: true }
      );

      res.status(200).json(updatedJob);
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).json(err);
  }
});

// DELETE JOB ATTACHMENT
router.put("/deleteAttachment", async (req, res) => {
  const { jobId, attachmentIndex } = req.body;
  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (attachmentIndex < 0 || attachmentIndex >= job.attachments.length) {
      return res.status(400).json({ message: "Invalid attachment index" });
    }

    const [removedAttachment] = job.attachments.splice(attachmentIndex, 1);

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { attachments: job.attachments },
      { new: true }
    );

    const attachmentPath = path.join(
      __dirname,
      "../../uploads",
      removedAttachment
    );
    if (fs.existsSync(attachmentPath)) {
      fs.unlinkSync(attachmentPath);
    }

    res
      .status(200)
      .json({ message: "Attachment deleted successfully", job: updatedJob });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred", error: err });
  }
});

// DELETE JOB
router.delete("/:id", async (req, res) => {
  const requestId = req.params.id;
  try {
    const deletedRequest = await Job.findByIdAndDelete(requestId);
    const quoteToDelete = await Quote.findOne({
      number: deletedRequest.number,
    });
    if (quoteToDelete) {
      // Construa o caminho para o PDF e exclua o arquivo
      const pdfPath = path.join(
        __dirname,
        "../../uploads/docs",
        `orcamento-j-${quoteToDelete.number}${
          quoteToDelete.version !== 0 ? `.${quoteToDelete.version}` : ""
        }.pdf`
      );
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      } else {
        ("");
      }

      await Quote.findByIdAndDelete(quoteToDelete._id);
    }

    if (deletedRequest.attachments && deletedRequest.attachments.length > 0) {
      deletedRequest.attachments.forEach((attachment) => {
        const attachmentPath = path.join(
          __dirname,
          "../../uploads",
          attachment
        );
        if (fs.existsSync(attachmentPath)) {
          fs.unlinkSync(attachmentPath);
        } else {
          ("");
        }
      });
    }

    res.status(200).json(deletedRequest);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
