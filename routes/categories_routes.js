const { Router } = require("express");
const { check } = require("express-validator");
const {
  create_category,
  get_categories,
  get_category_by_id,
  update_category,
  delete_category,
} = require("../controllers/category_controller");
const {
  categoriaExiste,
  nombreCategoriaExiste,
} = require("../helpers/db-validators");
const { validateJWT, validateFields, haveRole } = require("../middlewares");

const router = Router();
// Obtener todas las categorías - público
router.get("/", get_categories);

// Obtener una categoría por Id - publico - validar personalizado
router.get(
  "/:id",
  [
    check("id", "No es un id válido").isMongoId(),
    check("id", "El id no existe").custom(categoriaExiste),
    validateFields,
  ],
  get_category_by_id
);

// Crear una categoría - privado
router.post(
  "/",
  [
    validateJWT,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    validateFields,
  ],
  create_category
);

//Actualizar una categoría -privado
router.put(
  "/:id",
  [
    validateJWT,
    haveRole("ADMIN_ROLE"),
    check("id", "No es un id válido").isMongoId(),
    check("id", "La categoría ya existe").custom(categoriaExiste),
    check("name", "La categoría ya existe").custom(nombreCategoriaExiste),
    validateFields,
  ],
  update_category
);

// Borrar una categoría - sólo si es admin
router.delete(
  "/:id",
  [
    validateJWT,
    haveRole("ADMIN_ROLE"),
    check("id", "No es un id válido").isMongoId(),
    check("id", "El id no existe").custom(categoriaExiste),
    validateFields,
  ],
  delete_category
);
module.exports = router;
