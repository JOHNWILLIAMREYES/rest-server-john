const { Router } = require("express");
const { check } = require("express-validator");

const {
  validateFields,
  validateJWT,
  isAdminRole,
  haveRole,
} = require("../middlewares");
const {
  esRoleValido,
  emailExiste,
  usuarioExiste,
} = require("../helpers/db-validators");

const {
  usersGet,
  usersPost,
  usersPut,
  usersPatch,
  usersDelete,
} = require("../controllers/user_controller");

const router = Router();

router.get("/", usersGet);
router.post(
  "/",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe tener más de 6 letras").isLength({
      min: 6,
    }),
    check("email", "El correo no es válido").isEmail(),
    check("email").custom(emailExiste),
    // check("role", "No es un rol permitido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check("role").custom(esRoleValido),
    validateFields,
  ],
  usersPost
);
router.put(
  "/:id",
  [
    check("id", "No es un id válido").isMongoId(),
    check("id").custom(usuarioExiste),
    check("role").custom(esRoleValido),
    validateFields,
  ],
  usersPut
);
router.delete(
  "/:id",
  [
    validateJWT,
    // isAdminRole,
    haveRole("ADMIN_ROLE", "SALES_ROLE"),
    check("id", "No es un id válido").isMongoId(),
    check("id").custom(usuarioExiste),
    validateFields,
  ],
  usersDelete
);
router.patch("/", usersPatch);

module.exports = router;
