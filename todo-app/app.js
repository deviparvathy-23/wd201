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

// Sample GET route
app.get("/", async (req, res) => {
  const todos = await Todo.findAll();
  res.render("index", { todos }); // Make sure you have views/index.ejs
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