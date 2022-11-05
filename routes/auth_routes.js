const { Router } = require("express");
const { check } = require("express-validator");
const { login, googleSignIn } = require("../controllers/auth_controller");
const { validateFields } = require("../middlewares/validate-fields");

const router = Router();
router.post(
  "/login",
  [
    check("email", "El correo es obligatorio").isEmail(),
    check("password", "la contraseña es obligatoria").not().isEmpty(),
    validateFields,
  ],
  login
);
router.post(
  "/google",
  [
    check("id_token", "el id_token es necesario").not().isEmpty(),
    validateFields,
  ],
  googleSignIn
);

module.exports = router;
