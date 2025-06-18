const todoList = require("../todo");

describe("Todo List Test Suite", () => {
  let todos;

  beforeEach(() => {
    todos = todoList();
  });

  test("Creates a new todo", () => {
    expect(todos.all.length).toBe(0);
    todos.add({
      title: "Test todo",
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
    });
    expect(todos.all.length).toBe(1);
  });

  test("Marks a todo as complete", () => {
    todos.add({
      title: "Complete me",
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
    });
    todos.markAsComplete(0);
    expect(todos.all[0].completed).toBe(true);
  });

  test("Retrieves overdue items", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    todos.add({
      title: "Overdue task",
      dueDate: yesterday.toISOString().split("T")[0],
      completed: false,
    });
    expect(todos.overdue().length).toBe(1);
  });

  test("Retrieves due today items", () => {
    const today = new Date().toISOString().split("T")[0];
    todos.add({
      title: "Today task",
      dueDate: today,
      completed: false,
    });
    expect(todos.dueToday().length).toBe(1);
  });

  test("Retrieves due later items", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    todos.add({
      title: "Tomorrow task",
      dueDate: tomorrow.toISOString().split("T")[0],
      completed: false,
    });
    expect(todos.dueLater().length).toBe(1);
  });
});
