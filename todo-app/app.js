const express = require("express");
const path = require("path");
const { sequelize, Todo } = require("./models"); // adjust path as needed

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// View engine setup (optional)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


/*app.get("/", async (req, res) => {
  try {
    const allTodos = await Todo.findAll();
    res.render("index", { allTodos }); 
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading todos");
  }
});*/
app.get("/", async (req, res) => {
  const allTodos = await Todo.findAll({ order: [["dueDate", "ASC"]] });
  const today = new Date().toISOString().split("T")[0];

  const overdueTodos = allTodos.filter(todo => todo.dueDate < today);
  const dueTodayTodos = allTodos.filter(todo => todo.dueDate === today);
  const dueLaterTodos = allTodos.filter(todo => todo.dueDate > today);

  res.render("index", {
    overdueTodos,
    dueTodayTodos,
    dueLaterTodos
  });
});
app.put("/todos/:id", async (req, res) => {
  const todo = await Todo.findByPk(req.params.id);
  await todo.setCompletionStatus(req.body.completed);
  res.send(todo);
});
app.delete("/todos/:id", async (req, res) => {
  await Todo.destroy({ where: { id: req.params.id } });
  res.send({ success: true });
});

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch((err) => {
  console.error("Failed to sync database:", err);
});
module.exports = app;