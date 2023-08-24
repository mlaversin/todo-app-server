const express = require("express");
const router = express.Router();

const todoCtrl = require("../controllers/todo.controller");
const auth = require("../middlewares/auth");

router.post("/", auth, todoCtrl.createTodo);
router.get("/", auth, todoCtrl.getTodoList);
router.put("/:id", auth, todoCtrl.editTodo);
router.delete("/:id", auth, todoCtrl.deleteTodo);

module.exports = router;
