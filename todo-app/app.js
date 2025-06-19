const express = require("express");
const app = express();
const path = require("path");
const { Todo } = require("./models");
const bodyParser = require("body-parser");

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());

app.get("/", function (request, response) {
  response.send("Hello World");
});

app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos ...");
  try {
  const todos = await Todo.findAll(); // Fetch all todos using Sequelize
  return response.send(todos);
} catch (error) {
  console.error(error);
  return response.status(500).json({ error: "Unable to fetch todos" });
   }
});

app.post("/todos", async function (request, response) {
  try {
    const todo = await Todo.addTodo(request.body);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  try {
  const deleted = await Todo.destroy({ where: { id: request.params.id } });
  return response.send(deleted === 1);
} catch (error) {
  console.error(error);
  return response.status(500).json({ error: "Unable to delete todo" });
}
});

module.exports = app;
