const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const { Todo } = require("./models");

// Home page
app.get("/", async (req, res) => {
  const todos = await Todo.findAll();
  res.render("index", { todos });
});

// API: Get all todos
app.get("/todos", async (req, res) => {
  const todos = await Todo.findAll();
  res.json(todos); // used in tests
});

// API: Create todo
// POST /todos
app.post("/todos", async (req, res) => {
  try {
    const todo = await Todo.addTodo({
      title: req.body.title,
      dueDate: req.body.dueDate,
      completed: false,
    });

    if (req.accepts("json")) {
      return res.status(200).json(todo);
    }
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(422).json(error);
  }
});
// PUT /todos/:id/markAsCompleted
app.put("/todos/:id/markAsCompleted", async (req, res) => {
  const todo = await Todo.findByPk(req.params.id);
  if (todo) {
    const updatedTodo = await todo.markAsCompleted();
    return res.json(updatedTodo);
  }
  res.status(404).send();
});

// DELETE /todos/:id
app.delete("/todos/:id", async (req, res) => {
  try {
    const deleted = await Todo.destroy({ where: { id: req.params.id } });
    res.json(deleted === 1); // Sends `true` if deleted, otherwise `false`
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json(false); // Sends false on error
  }
});


module.exports = app;
