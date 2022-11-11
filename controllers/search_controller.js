const { response } = require("express");
const { ObjectId } = require("mongoose").Types;
const { User, Category, Product } = require("../models");

const collections = ["users", "categories", "roles", "products"];

const searchUsers = async (termino = "", res = response) => {
  const esMongoId = ObjectId.isValid(termino);
  if (esMongoId) {
    const user = await User.findById(termino);
    return res.json({
      results: user ? [user] : [],
    });
  }
  const regex = new RegExp(termino, "i");
  const users = await User.find({
    $or: [
      {
        name: regex,
      },
      {
        email: regex,
      },
    ],
    $and: [{ stage: true }],
  });
  res.json({
    results: users ? [users] : [],
    size: users.length,
  });
};

const searchCategories = async (termino = "", res = response) => {
  const esMongoId = ObjectId.isValid(termino);
  if (esMongoId) {
    const category = await Category.findById(termino);
    return res.json({
      results: category ? [category] : [],
    });
  }
  const regex = new RegExp(termino, "i");
  const categories = await Category.find({
    name: regex,
  });
  res.json({
    results: categories ? [categories] : [],
    size: categories.length,
  });
};

const searchProducts = async (termino = "", res = response) => {
  const esMongoId = ObjectId.isValid(termino);
  if (esMongoId) {
    const product = await Product.findById(termino);
    return res.json({
      results: product ? [product] : [],
    });
  }
  const regex = new RegExp(termino, "i");
  const categories = await Product.find({
    $or: [
      {
        name: regex,
      },
      {
        description: regex,
      },
    ],
  });
  res.json({
    results: categories ? [categories] : [],
    size: categories.length,
  });
};

const search = async (req, res = response) => {
  const {
    params: { collection, word },
  } = req;
  if (!collections.includes(collection)) {
    return res
      .status(400)
      .json({ msg: `Las colecciones permitidas son ${collections}` });
  }

  switch (collection) {
    case "users":
      searchUsers(word, res);
      break;
    case "categories":
      searchCategories(word, res);
      break;
    case "products":
      searchProducts(word, res);
      break;
    default:
      res.status(500).json({
        msg: "Se le olvidó hacer esta búsqueda",
      });
  }
};

module.exports = {
  search,
};
