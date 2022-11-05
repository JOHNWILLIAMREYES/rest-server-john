const { response } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const { generateJwt } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
  const {
    body: { email, password },
  } = req;
  try {
    // Verificar si el email existe
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ msg: "Usuario / Password no son correctos - email" });
    }
    // Si el usuario está activo
    if (!user.stage) {
      return res
        .status(400)
        .json({ msg: "Usuario / Password no son correctos - estado: false" });
    }
    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res
        .status(400)
        .json({ msg: "Usuario / Password no son correctos - password" });
    }
    //Generar el jwt
    const token = await generateJwt(user.id);
    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Algo salió mal, hable con el admin",
    });
  }
};

const googleSignIn = async (req, res = response, next) => {
  const {
    body: { id_token },
  } = req;
  try {
    const { name, picture: img, email } = await googleVerify(id_token);
    let user = await User.findOne({ email });
    if (!user) {
      const data = {
        name,
        email,
        password: ":P",
        img,
        google: true,
      };
      user = new User(data);
      await user.save();
    }
    if (!user.stage) {
      return res.status(401).json({
        msg: "Hable con el admin - user borrado",
      });
    }
    const token = await generateJwt(user.id);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "El token no se pudo verificar",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
