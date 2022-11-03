const { response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const usersGet = async (req, res = response) => {
  const {
    query: { limit = 5, from = 0 },
  } = req;
  const [total, users] = await Promise.all([
    User.countDocuments({ stage: true }),
    User.find({ stage: true }).skip(from).limit(limit),
  ]);
  //repuesta
  res.status(200).json({ total, users });
  // res.status(200).json({ msg: "hola" });
};
const usersPost = async (req, res = response) => {
  const {
    body: { name, email, password, role },
  } = req;
  const user = new User({ name, email, password, role });

  //encriptar la contraseña
  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(password, salt);

  await user.save();
  res.status(200).json(user);
};
const usersPut = async (req, res = response) => {
  const {
    params: { id },
    body: { _id, password, google, email, ...rest },
  } = req;
  if (password) {
    const salt = bcrypt.genSaltSync(10);
    rest.password = bcrypt.hashSync(password, salt);
  }
  const user = await User.findByIdAndUpdate(id, rest);
  res.status(200).json(user);
};
const usersDelete = async (req, res = response) => {
  const {
    params: { id },
  } = req;
  //borrar fisicamente
  // user = await user.findOneAndDelete(id);
  //cambiar estado
  console.log("id", id);
  const user = await User.findByIdAndUpdate(id, { stage: false });
  res.status(200).json(user);
};
const usersPatch = (req, res = response) => {
  res.status(200).json({ msg: "PATCH API - CONTROLLER" });
};

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersPatch,
  usersDelete,
};
