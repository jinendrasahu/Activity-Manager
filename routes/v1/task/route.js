const express = require("express");
const { varifyToken } = require("../../../middlewares/varifyToken");
const { createTask } = require("../../../modules/tasks/CreateTask");
const { deleteTask } = require("../../../modules/tasks/DeleteTask");
const { getTasks } = require("../../../modules/tasks/GetTask");
const { sortTask } = require("../../../modules/tasks/SortTask");
const { updateTask } = require("../../../modules/tasks/UpdateTask");

const apiRoutes = express.Router();
apiRoutes.post("/create", varifyToken, createTask);
apiRoutes.patch("/:id", varifyToken, updateTask);
apiRoutes.delete("/:id", varifyToken, deleteTask);
apiRoutes.get("/list", varifyToken, getTasks);
apiRoutes.post("/sort", varifyToken, sortTask);

module.exports = apiRoutes