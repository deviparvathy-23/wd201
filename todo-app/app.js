const express = require("express");
const path = require("path");
const { sequelize, Todo } = require("./models"); // adjust path as needed

const app = express();
const port = process.env.PORT || 3000;
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  const completedTodos = allTodos.filter(todo => todo.completed);

  res.render("index", {
    overdueTodos,
    dueTodayTodos,
    dueLaterTodos,
     completedTodos, 
  });
});
app.put("/todos/:id", async (req, res) => {
  const todo = await Todo.findByPk(req.params.id);
  await todo.setCompletionStatus(req.body.completed);
  res.send(todo);
});
app.delete("/todos/:id", async (req, res) => {
  try {
    const todoId = req.params.id;
    await Todo.destroy({ where: { id: todoId } });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(422).json({ error: "Could not delete the todo" });
  }
});

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch((err) => {
  console.error("Failed to sync database:", err);
});
app.post("/todos", async (req, res) => {
  try {
    const { title, dueDate } = req.body;
    if (!title || !dueDate) {
      return res.status(400).send("Title and due date required");
    }

    await Todo.create({
      title,
      dueDate,
      completed: false,
    });

    res.redirect("/"); // redirect to homepage after adding
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating todo");
  }
});
module.exports = app;