const { response } = require("express");
const { Category } = require("../models");

//obtener categorias - paginado- totalizado-populate
const get_categories = async (req, res = response) => {
  const {
    query: { limit = 5, from = 0 },
  } = req;
  const [total, categories] = await Promise.all([
    Category.countDocuments({ state: true }),
    Category.find({ state: true })
      .skip(from)
      .limit(limit)
      .populate("user", "name"),
  ]);
  //repuesta
  res.status(200).json({ total, categories });
};

//obtener categoria -populate
const get_category_by_id = async (req, res = response) => {
  const {
    params: { id },
  } = req;
  const category = await Category.findById(id).populate("user", "name");
  res.status(200).json(category);
};
const create_category = async (req, res = response) => {
  const name = req.body.name.toUpperCase();

  const categoryDb = await Category.findOne({ name });
  if (categoryDb) {
    return res.status(400).json(`La categoría ${categoryDb.name}, ya existe`);
  }

  //Generar la data a guardar

  const data = {
    name,
    user: req.user._id,
  };
  const new_category = new Category(data);
  await new_category.save();
  res.status(201).json(new_category);
};
// actualizar categoria
const update_category = async (req, res = response) => {
  const {
    params: { id },
    body: { state, user, name },
  } = req;
  const category = await Category.findByIdAndUpdate(id, {
    name: name.toUpperCase(),
    user,
  });
  res.status(200).json(category);
};
// borrar categoría - cambiar estado
const delete_category = async (req, res = response) => {
  const {
    params: { id },
    user: userAuth,
  } = req;
  const category = await Category.findByIdAndUpdate(id, { state: false });
  res.status(200).json({ category, userAuth });
};

module.exports = {
  create_category,
  get_categories,
  get_category_by_id,
  update_category,
  delete_category,
};
