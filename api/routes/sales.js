const express = require("express");
const router = express.Router();
const Sale = require("../../models/models/Sale");
const Customer = require("../../models/models/Customer");
const Client = require("../../models/models/Client");
const Quote = require("../../models/models/Quote");
const Product = require("../../models/models/Product");
const FinanceIncome = require("../../models/models/FinanceIncome");
const PDFDocument = require("pdfkit");
const dayjs = require("dayjs");
const fs = require("fs");
const path = require("path");

// GET ALL SALES
router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find();
    res.status(200).json(sales);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE SALE
router.post("/", async (req, res) => {
  const newSale = new Sale(req.body);
  if (newSale.items.length > 0) {
    for (const item of newSale.items) {
      const items = await Product.findById(item._id);
      items.quantity -= item.quantity;
      await items.save();
    }
  }
  try {
    const savedRequest = await newSale.save();

    const sale = await Sale.findById(savedRequest._id);
    const interactionNumber = sale.interactions.length + 1;

    const updatedJob = await Sale.findByIdAndUpdate(
      savedRequest._id,
      {
        $push: {
          interactions: {
            number: interactionNumber,
            activity: `Venda criada`,
            user: req.body.createdBy,
            date: req.body.fullDate,
          },
        },
      },
      { new: true }
    );

    const newQuote = new Quote({
      number: savedRequest.quoteNumber,
      title: "",
      description: "",
      customer: req.body.customer.name,
      department: req.body.department.name,
      user: req.body.seller.name,
      manager: req.body.manager.name || "",
      service: "",
      type: "sale",
      local: req.body.deliveryAddress,
      deliveryReceiver: req.body.deliveryReceiver,
      deliveryReceiverPhone: req.body.deliveryReceiverPhone,
      scheduledTo: req.body.deliveryScheduledTo,
      createdBy: req.body.createdBy,
      value: req.body.price,
      materials: req.body.items,
    });
    const savedQuote = await newQuote.save();

    const recentRequestData = {
      number: savedQuote.number,
      title: savedQuote.title,
      type: "sale",
      date: dayjs(savedQuote.createdAt).format("DD/MM/YYYY HH:mm:ss"),
      requester: req.body.requester,
    };

    let updatedClient;
    let updatedCustomer;
    // review this, this is dangerous
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
    // review this, this is dangerous

    const doc = new PDFDocument();

    const pdfPath = path.join(
      __dirname,
      "../../uploads/docs",
      `orcamento-${savedQuote.type[0]}-${savedQuote.number}.pdf`
    );

    doc.pipe(fs.createWriteStream(pdfPath));

    doc.image("../uploads/logo.png", 5, 5, { width: 120 });
    if (req.body.customer.image && !req.body.customer.image.endsWith(".webp")) {
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
      .moveTo(10, 60)
      .lineTo(doc.page.width - 10, 60)
      .strokeColor("lightgrey")
      .stroke();
    doc.text(`Cliente: ${savedQuote.customer}`, 10, 65);
    doc.text(`Criado por: ${savedQuote.createdBy}`, 210, 65);
    doc.moveDown();

    doc
      .moveTo(10, 90)
      .lineTo(doc.page.width - 10, 90)
      .strokeColor("lightgrey")
      .stroke();
    doc.text(
      `Entregar em: ${dayjs(savedQuote.scheduledTo).format(
        "DD/MM/YYYY"
      )} no endereço ${savedQuote.local} para ${
        savedQuote.deliveryReceiver
      }. Contato: ${savedQuote.deliveryReceiverPhone}`,
      10,
      100
    );

    doc
      .moveTo(10, 130)
      .lineTo(doc.page.width - 10, 130)
      .strokeColor("lightgrey")
      .stroke();
    doc.text(`Departamento: ${savedQuote.department}`, 10, 135);
    doc.text(`Colaborador: ${savedQuote.user}`, 210, 135);
    doc.text(`Gerente: ${savedQuote.manager}`, 410, 135);
    doc.moveDown();

    doc
      .moveTo(10, 170)
      .lineTo(doc.page.width - 10, 170)
      .strokeColor("lightgrey")
      .stroke();
    doc.text("Lista de Materiais", 15, 175);
    doc.moveDown();

    for (const material of savedQuote.materials) {
      doc.image(
        material.image.endsWith(".webp")
          ? "../uploads/default_product.png"
          : `../uploads/${material.image}`,
        15,
        doc.y,
        {
          width: 32,
          align: "left",
        }
      );

      doc.text(
        `${material.name} x${material.quantity} R$${material.sellValue}`,
        55,
        doc.y - 20 - 0
      );

      doc.moveDown();
    }

    doc.moveDown();

    doc.text(`Valor Total da Nota = R$${savedQuote.value.toFixed(2)}`, {
      align: "right",
    });
    doc.moveDown();

    doc.end();

    res.status(200).json({
      savedRequest,
      updatedJob,
      savedQuote,
      updatedCustomer,
      updatedClient,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// EDIT SALE
router.put("/", async (req, res) => {
  try {
    const saleId = req.body.saleId || req.body.sale._id;
    const saleToUpdate = await Sale.findById(saleId);

    const quoteNumber = saleToUpdate.quoteNumber;
    const quoteToDelete = await Quote.findOne({ number: quoteNumber });

    if (quoteToDelete) {
      // Construa o caminho para o PDF e exclua o arquivo
      const pdfPath = path.join(
        __dirname,
        "../../uploads/docs",
        `orcamento-s-${quoteToDelete.number}${
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

    const updatedSale = await Sale.findByIdAndUpdate(
      saleId,
      {
        customer: req.body.customer,
        requester: req.body.requester,
        department: req.body.department,
        seller: req.body.seller,
        manager: req.body.manager,
        price: req.body.price,
        items: req.body.items,
        deliveryAddress: req.body.deliveryAddress,
        deliveryReceiver: req.body.deliveryReceiver,
        deliveryReceiverPhone: req.body.deliveryReceiverPhone,
        deliveryScheduledTo: req.body.deliveryScheduledTo,
      },
      { new: true }
    );

    const newQuote = new Quote({
      number: updatedSale.quoteNumber,
      title: "",
      description: "",
      customer: updatedSale.customer.name,
      department: updatedSale.department.name,
      user: updatedSale.seller.name,
      manager: updatedSale.manager.name || "",
      service: "",
      type: "sale",
      local: updatedSale.deliveryAddress,
      deliveryReceiver: updatedSale.deliveryReceiver,
      deliveryReceiverPhone: updatedSale.deliveryReceiverPhone,
      scheduledTo: updatedSale.deliveryScheduledTo,
      createdBy: req.body.createdBy,
      value: updatedSale.price,
      materials: updatedSale.items,
      version: quoteToDelete.version + 1,
    });
    const savedQuote = await newQuote.save();

    const doc = new PDFDocument();

    const pdfPath = path.join(
      __dirname,
      "../../uploads/docs",
      `orcamento-${savedQuote.type[0]}-${
        quoteToDelete.number
      }${`.${savedQuote.version}`}.pdf`
    );

    doc.pipe(fs.createWriteStream(pdfPath));

    doc.image("../uploads/logo.png", 5, 5, { width: 120 });
    if (req.body.customer.image && !req.body.customer.image.endsWith(".webp")) {
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
      .moveTo(10, 60)
      .lineTo(doc.page.width - 10, 60)
      .strokeColor("lightgrey")
      .stroke();
    doc.text(`Cliente: ${savedQuote.customer}`, 10, 65);
    doc.text(`Criado por: ${updatedSale.createdBy}`, 210, 65);
    doc.moveDown();

    doc
      .moveTo(10, 90)
      .lineTo(doc.page.width - 10, 90)
      .strokeColor("lightgrey")
      .stroke();
    doc.text(
      `Entregar em: ${dayjs(savedQuote.scheduledTo).format(
        "DD/MM/YYYY"
      )} no endereço ${savedQuote.local} para ${
        savedQuote.deliveryReceiver
      }. Contato: ${savedQuote.deliveryReceiverPhone}`,
      10,
      95
    );

    doc
      .moveTo(10, 130)
      .lineTo(doc.page.width - 10, 130)
      .strokeColor("lightgrey")
      .stroke();
    doc.text(`Departamento: ${savedQuote.department}`, 10, 135);
    doc.text(`Colaborador: ${savedQuote.user}`, 210, 135);
    doc.text(`Gerente: ${savedQuote.manager}`, 410, 135);
    doc.moveDown();

    doc
      .moveTo(10, 170)
      .lineTo(doc.page.width - 10, 170)
      .strokeColor("lightgrey")
      .stroke();
    doc.text("Lista de Materiais", 15, 175);
    doc.moveDown();

    for (const material of savedQuote.materials) {
      doc.image(
        material.image.endsWith(".webp")
          ? "../uploads/default_product.png"
          : `../uploads/${material.image}`,
        15,
        doc.y,
        {
          width: 32,
          align: "left",
        }
      );

      doc.text(
        `${material.name} x${material.quantity} R$${material.sellValue}`,
        55,
        doc.y - 20 - 0
      );

      doc.moveDown();
    }

    doc.moveDown();

    doc.text(`Valor Total da Nota = R$${savedQuote.value.toFixed(2)}`, {
      align: "right",
    });
    doc.moveDown();

    doc.end();

    res.status(200).json({ updatedSale, savedQuote });
  } catch (err) {
    console.log("err", err);
    res.status(500).json(err);
  }
});

// RESOLVE SALE
router.put("/resolve", async (req, res) => {
  try {
    const saleId = req.body.saleId;
    const user = req.body.user;
    const commentary = req.body.commentary;

    const updatedSale = await Sale.findByIdAndUpdate(
      saleId,
      {
        status: "Concluido",
        commentary: commentary,
        resolvedBy: user,
        resolvedAt: new Date().toLocaleDateString("pt-BR").replace(/\//g, "-"),
      },
      { new: true }
    );

    const newIncome = new FinanceIncome({
      quote: updatedSale.quoteNumber,
      customer: updatedSale.customer.name,
      department: updatedSale.department.name,
      user: updatedSale.seller.name,
      type: "sale",
      commissioned: updatedSale.commissioned,
      commission: updatedSale.commission,
      items: updatedSale.materials,
      scheduledTo: updatedSale.scheduledTo,
      resolvedAt: new Date().toLocaleDateString("pt-BR").replace(/\//g, "-"),
      paidAt: "",
      commentary: "",
      price: updatedSale.price,
    });

    const savedIncome = await newIncome.save();

    res.status(200).json({ updatedSale, savedIncome });
  } catch (err) {
    console.log("err", err);
    res.status(500).json(err);
  }
});

// ADD SALE INTERACTION
router.put("/interaction", async (req, res) => {
  try {
    const saleId = req.body.saleId || req.body.jobId;
    const userName = req.body.userName;

    const sale = await Sale.findById(saleId);
    const interactionNumber = sale.interactions.length + 1;

    const updatedSale = await Sale.findOneAndUpdate(
      { _id: saleId },
      {
        $push: {
          interactions: {
            number: interactionNumber,
            activity: req.body.activity,
            attachments: req.body.attachments,
            user: userName,
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
    res.status(200).json(updatedSale);
  } catch (err) {
    console.log("err", err);
    res.status(500).json(err);
  }
});

// ADD SALE ATTACHMENTS
router.put("/addAttachments", async (req, res) => {
  const { itemId, attachments, userName, date } = req.body;

  try {
    const sale = await Sale.findById(itemId);
    const interactionNumber = sale.interactions.length + 1;

    let updatedSale;
    if (attachments.length !== 0) {
      updatedSale = await Sale.findOneAndUpdate(
        { _id: itemId },
        {
          $set: {
            attachments: [...sale.attachments, ...attachments],
          },
          $push: {
            interactions: {
              number: interactionNumber,
              activity: `Colaborador ${userName} anexou ${
                attachments.length
              } arquivo${attachments.length === 1 ? "" : "s"} à Venda`,
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
      .json({ message: "Attachments added successfully", sale: updatedSale });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred", error: err });
  }
});

// REMOVE SALE INTERACTION
router.put("/interaction/remove", async (req, res) => {
  const { itemId, interactionId } = req.body;

  try {
    const sale = await Sale.findById(itemId);

    const updatedInteractions = sale.interactions.filter(
      (interaction) => interaction._id.toString() !== interactionId
    );

    const updatedSale = await Sale.findByIdAndUpdate(
      itemId,
      { $set: { interactions: updatedInteractions } },
      { new: true }
    );

    res.json(updatedSale);
  } catch (err) {
    console.error("Erro ao 'remover' interação:", err);
    res.status(500).send(err);
  }
});

// REACT TO SALE INTERATION
router.put("/reaction", async (req, res) => {
  try {
    const saleId = req.body.itemId;
    const userId = req.body.userId;

    const sale = await Sale.findById(saleId);

    const reactionType = req.body.reactionType;
    const reactionField = `interactions.$.reactions.${reactionType}.quantity`;
    const usersReactedField = `interactions.$.reactions.${reactionType}.usersReacted`;

    const userAlreadyReacted = sale.interactions.some((interaction) => {
      return (
        interaction.number === req.body.number &&
        interaction.reactions[reactionType].usersReacted.includes(userId)
      );
    });

    if (userAlreadyReacted) {
      const updatedSale = await Sale.findOneAndUpdate(
        { _id: saleId, "interactions.number": req.body.number },
        {
          $inc: { [reactionField]: -1 },
          $pull: { [usersReactedField]: userId },
        },
        { new: true }
      );

      res.status(200).json(updatedSale);
    } else {
      const updatedSale = await Sale.findOneAndUpdate(
        { _id: saleId, "interactions.number": req.body.number },
        {
          $inc: { [reactionField]: 1 },
          $addToSet: { [usersReactedField]: userId },
        },
        { new: true }
      );

      res.status(200).json(updatedSale);
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).json(err);
  }
});

// DELETE SALE ATTACHMENT
router.put("/deleteAttachment", async (req, res) => {
  const { saleId, attachmentIndex } = req.body;
  try {
    const sale = await Sale.findById(saleId);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    if (attachmentIndex < 0 || attachmentIndex >= sale.attachments.length) {
      return res.status(400).json({ message: "Invalid attachment index" });
    }

    const [removedAttachment] = sale.attachments.splice(attachmentIndex, 1);

    const updatedSale = await Sale.findByIdAndUpdate(
      saleId,
      { attachments: sale.attachments },
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
      .json({ message: "Attachment deleted successfully", sale: updatedSale });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred", error: err });
  }
});

// DELETE SALE
router.delete("/:id", async (req, res) => {
  const saleId = req.params.id;
  try {
    const deletedSale = await Sale.findByIdAndDelete(saleId);

    const quoteNumber = deletedSale.quoteNumber;
    const quoteToDelete = await Quote.findOne({ number: quoteNumber });
    if (quoteToDelete) {
      // Construa o caminho para o PDF e exclua o arquivo
      const pdfPath = path.join(
        __dirname,
        "../../uploads/docs",
        `orcamento-s-${quoteToDelete.number}${
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

    if (deletedSale.attachments && deletedSale.attachments.length > 0) {
      deletedSale.attachments.forEach((attachment) => {
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

    res.status(200).json(deletedSale);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
