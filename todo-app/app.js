const express = require("express");
const path = require("path");
const { Todo } = require("./models");

const app = express();

// Set view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from "public" directory
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Home route - display all todos
app.get("/", async (req, res) => {
  const allTodos = await Todo.findAll();
  res.render("index", { allTodos });
});

// API routes (optional, for adding/marking/deleting todos)
app.post("/todos", async (req, res) => {
  const todo = await Todo.addTodo({
    title: req.body.title,
    dueDate: req.body.dueDate,
    completed: false,
  });
  res.redirect("/");
});

app.post("/todos/:id/markAsCompleted", async (req, res) => {
  const todo = await Todo.findByPk(req.params.id);
  await todo.markAsCompleted();
  res.redirect("/");
});

app.post("/todos/:id/delete", async (req, res) => {
  const result = await Todo.destroy({ where: { id: req.params.id } });
  res.redirect("/");
});

// Listen on the port provided by Render or fallback to 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
