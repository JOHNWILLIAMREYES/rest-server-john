const Role = require("../models/role");
const User = require("../models/user");

const esRoleValido = async (role = "") => {
  const existeRol = await Role.findOne({ role });
  if (!existeRol) {
    throw new Error(`El rol ${role} no está registrado en la base de datos`);
  }
};

const emailExiste = async (email = "") => {
  const exist = await User.findOne({ email });
  if (exist) {
    throw new Error(`El correo ${email} ya existe con otro usuario`);
  }
};

const usuarioExiste = async (id) => {
  const exist = await User.findById(id);
  if (!exist) {
    throw new Error(`El ID ${id} no existe`);
  }
};

module.exports = {
  esRoleValido,
  emailExiste,
  usuarioExiste,
};
