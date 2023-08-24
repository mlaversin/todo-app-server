const Todo = require("../models/Todo");

/*
 * This function is used to create a todo
 */
exports.createTodo = (req, res) => {
  const todo = new Todo({ ...req.body, user: req.auth.userId });
  todo
    .save()
    .then(() => res.status(201).json({ message: "Todo created." }))
    .catch((error) => {
      res.status(400).json({ error });
    });
};

/*
 * This function is used to retrieve a user's todo list
 */
exports.getTodoList = (req, res) => {
  Todo.find()
    .where(user == req.auth.userId)
    .then((todolist) => {
      res.status(200).json(todolist);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

/*
 * This function is used to update a todo
 */
exports.editTodo = async (req, res) => {
  Todo.findOne({ _id: req.params.id })
    .then((todo) => {
      if (req.auth.userId !== todo.user.toString()) {
        res.status(403).json({
          message: "You are not authorized to make this request.",
        });
      } else {
        Todo.updateOne(
          { _id: req.params.id },
          { $set: { title: req.body.title, notes: req.body.notes } }
        )
          .then(() => res.status(200).json({ message: "Todo updated!" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

/*
 * This function is used to delete a todo
 */
exports.deleteTodo = (req, res) => {
  Todo.findOne({ _id: req.params.id })
    .then((todo) => {
      if (req.auth.userId === todo.user.toString()) {
        Todo.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Todo deleted!" }))
          .catch((error) => res.status(400).json({ error }));
      } else {
        res.status(403).json({
          message: "You are not authorized to make this request.",
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
