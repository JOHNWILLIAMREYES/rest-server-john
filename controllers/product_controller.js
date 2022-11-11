const { response } = require("express");
const { Product } = require("../models");

//obtener categorias - paginado- totalizado-populate
const get_products = async (req, res = response) => {
  const {
    query: { limit = 5, from = 0 },
  } = req;
  const [total, products] = await Promise.all([
    Product.countDocuments({ state: true }),
    Product.find({ state: true })
      .skip(from)
      .limit(limit)
      .populate("user", "name")
      .populate("category", "name"),
  ]);
  //repuesta
  res.status(200).json({ total, products });
};

//obtener categoria -populate
const get_Product_by_id = async (req, res = response) => {
  const {
    params: { id },
  } = req;
  const product = await Product.findById(id)
    .populate("user", "name")
    .populate("category", "name");
  res.status(200).json(product);
};
const create_Product = async (req, res = response) => {
  let {
    body: { name, category, description = "", price },
  } = req;
  name = req.body.name.toUpperCase();

  const ProductDb = await Product.findOne({ name });
  if (ProductDb) {
    return res.status(400).json(`El producto ${ProductDb.name}, ya existe`);
  }

  //Generar la data a guardar

  const data = {
    name,
    user: req.user._id,
    category,
    description,
    price,
  };
  const new_Product = new Product(data);
  await new_Product.save();
  res.status(201).json(new_Product);
};
// actualizar categoria
const update_product = async (req, res = response) => {
  const {
    params: { id },
    body: { state, user, ...rest },
  } = req;
  const product = await Product.findByIdAndUpdate(id, rest);
  res.status(200).json(product);
};
// // borrar categoría - cambiar estado
const delete_product = async (req, res = response) => {
  const {
    params: { id },
    user: userAuth,
  } = req;
  const product = await Product.findByIdAndUpdate(id, { state: false });
  res.status(200).json({ product, userAuth });
};

module.exports = {
  create_Product,
  get_products,
  get_Product_by_id,
  update_product,
  delete_product,
};
