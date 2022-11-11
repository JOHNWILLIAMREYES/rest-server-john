const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.paths = {
      users: "/api/users",
      auth: "/api/auth",
      categories: "/api/categories",
      products: "/api/products",
      search: "/api/search",
    };

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
    this.app.use(this.paths.users, require("../routes/user_routes"));
    this.app.use(this.paths.auth, require("../routes/auth_routes"));
    this.app.use(this.paths.categories, require("../routes/categories_routes"));
    this.app.use(this.paths.products, require("../routes/product_routes"));
    this.app.use(this.paths.search, require("../routes/search_routes"));
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor funcionando en el puerto :", this.port);
    });
  }
}

module.exports = Server;
