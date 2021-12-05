const express = require("express");
const server = express();
const usersController = require("./controllers/users-controller");
const customersController = require("./controllers/customers-controller");

const errorHendler = require("./errors/error-handler");

const cors = require("cors");
server.use(cors({ origin: "http://localhost:3000" }));

const loginFilter = require('./login-filter');

// Middlewares init
server.use(loginFilter());
server.use(express.json());

server.use("/users", usersController);
server.use("/customers", customersController);

server.use(errorHendler);

server.listen(3001, () => console.log("Listening on http://localhost:3001"));
