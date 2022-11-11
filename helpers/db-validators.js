const { User, Role, Category, Product } = require("../models");

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

const categoriaExiste = async (id) => {
  const exist = await Category.findById(id);
  if (!exist) {
    throw new Error(`El ID de categoría ${id} no existe`);
  }
};

const nombreCategoriaExiste = async (name = "") => {
  const exist = await Category.findOne({ name });
  if (exist) {
    throw new Error(`El nombre ${name} ya existe en la bd`);
  }
};

const productoExiste = async (id) => {
  const exist = await Product.findById(id);
  if (!exist) {
    throw new Error(`El ID de product ${id} no existe`);
  }
};
const nombreProductoExiste = async (name = "") => {
  const exist = await Category.findOne({ name });
  if (exist) {
    throw new Error(`El nombre ${name} ya existe en la bd`);
  }
};

module.exports = {
  esRoleValido,
  emailExiste,
  usuarioExiste,
  categoriaExiste,
  productoExiste,
  nombreCategoriaExiste,
  nombreProductoExiste,
};
