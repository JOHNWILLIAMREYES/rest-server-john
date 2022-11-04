const { response } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json("No hay token en la petición");
  }
  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const user = await User.findById(uid);
    if (!user) {
      return res
        .status(401)
        .json({ msg: "Token no válido - usuario No existe en db" });
    }
    if (!user.stage) {
      return res
        .status(401)
        .json({ msg: "Token no válido - usuario en estado false" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json("Token no válido");
  }
};

module.exports = {
  validateJWT,
};
