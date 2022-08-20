const express = require('express');

const todoRouter = express.Router();
const controller = require('../controllers/todoController');
const { auth, managerAuth, adminAuth } = require('../utils/middleware');

todoRouter.post("/todo/", auth, managerAuth, controller.createTodo);
todoRouter.get("/todo/", auth, controller.getAllTodo);
todoRouter.get("/todo/:id", auth, controller.getTodoByID);
todoRouter.put("/todo/:id", auth, managerAuth, controller.updateTodo);
todoRouter.delete("/todo/:id", auth, adminAuth, controller.deleteTodo);

module.exports = todoRouter;

