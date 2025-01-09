const Product = require("../../models/models/Product");

async function removeFromStock(items) {
  try {
    for (const item of items) {
      const product = await Product.findById(item._id);
      if (product) {
        if (item.count > product.stockQuantity) {
          throw new Error("Itens indisponíveis em estoque");
        }
        product.stockQuantity -= item.count;
        await product.save();
      } else {
        console.warn(`Produto com _id ${item._id} não encontrado.`);
      }
    }
  } catch (err) {
    console.error("Erro ao remover itens do estoque:", err.message);
    throw err;
  }
}

module.exports = { removeFromStock };
