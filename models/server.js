const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usersPath = "/api/users";
    this.authPath = "/api/auth";

    // Conectar a base de datos
    this.conectarDb();
    //middlewares
    this.middlewares();
    this.routes();
  }

  async conectarDb() {
    await dbConnection();
  }

  middlewares() {
    //CORS
    this.app.use(cors());

    //lectura y parseo del body
    this.app.use(express.json());

    // directorio público
    this.app.use(express.static("public"));
  }
  routes() {
    this.app.use(this.usersPath, require("../routes/user_routes"));
    this.app.use(this.authPath, require("../routes/auth_routes"));
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor funcionando en el puerto :", this.port);
    });
  }
}

module.exports = Server;
