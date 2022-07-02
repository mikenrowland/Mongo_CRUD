const express = require('express');

const router = express.Router();

const controller = require('../controllers/controller');

router.post("/todo/", controller.createTodo);
router.get("/todo/", controller.getAllTodo);
router.get("/todo/:id", controller.getTodoByID);
router.put("/update-todo/:id", controller.updateTodo);
router.delete("/delete-todo/:id", controller.deleteTodo);

module.exports = router;

