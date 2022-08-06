const express = require('express');

const todoRouter = express.Router();
const controller = require('../controllers/todoController');
const { auth, adminAuth } = require('../utils/middleware');

todoRouter.post("/todo/", adminAuth, controller.createTodo);
todoRouter.get("/todo/", auth, controller.getAllTodo);
todoRouter.get("/todo/:id", auth, controller.getTodoByID);
todoRouter.put("/update-todo/:id", adminAuth, controller.updateTodo);
todoRouter.delete("/delete-todo/:id", adminAuth, controller.deleteTodo);

module.exports = todoRouter;

