const { Router } = require("express");
const { check } = require("express-validator");
const {
  create_Product,
  get_products,
  get_Product_by_id,
  update_product,
  delete_product,
} = require("../controllers/product_controller");
const {
  categoriaExiste,
  productoExiste,
  nombreProductoExiste,
} = require("../helpers/db-validators");
const { validateJWT, validateFields, haveRole } = require("../middlewares");

const router = Router();
// Obtener todos los productos - público
router.get("/", get_products);

// Obtener un producto por Id - publico - validar personalizado
router.get(
  "/:id",
  [
    check("id", "No es un id válido").isMongoId(),
    check("id", "El id no existe").custom(productoExiste),
    validateFields,
  ],
  get_Product_by_id
);

// Crear un producto - privado
router.post(
  "/",
  [
    validateJWT,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("category").custom(categoriaExiste),
    validateFields,
  ],
  create_Product
);

//Actualizar una categoría -privado
router.put(
  "/:id",
  [
    validateJWT,
    haveRole("ADMIN_ROLE"),
    check("id", "No es un id válido").isMongoId(),
    check("id").custom(productoExiste),
    check("name", "El producto ya existe").custom(nombreProductoExiste),
    validateFields,
  ],
  update_product
);

// Borrar una categoría - sólo si es admin
router.delete(
  "/:id",
  [
    validateJWT,
    haveRole("ADMIN_ROLE"),
    check("id", "No es un id válido").isMongoId(),
    check("id", "El id no existe").custom(productoExiste),
    validateFields,
  ],
  delete_product
);
module.exports = router;
