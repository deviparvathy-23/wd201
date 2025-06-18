const todoList = require("./todo");

const formattedDate = (d) => {
  return d.toISOString().split("T")[0];
};

const today = formattedDate(new Date());
const yesterday = formattedDate(
  new Date(new Date().setDate(new Date().getDate() - 1)),
);
const tomorrow = formattedDate(
  new Date(new Date().setDate(new Date().getDate() + 1)),
);

describe("TodoList Test Suite", () => {
  let todos;

  beforeEach(() => {
    todos = todoList();
  });

  test("Creates a new todo", () => {
    expect(todos.all.length).toBe(0);
    todos.add({ title: "Test todo", dueDate: today, completed: false });
    expect(todos.all.length).toBe(1);
  });

  test("Marks a todo as complete", () => {
    todos.add({ title: "Complete me", dueDate: today, completed: false });
    todos.markAsComplete(0);
    expect(todos.all[0].completed).toBe(true);
  });

  test("Retrieves overdue items", () => {
    todos.add({ title: "Overdue todo", dueDate: yesterday, completed: false });
    const overdueItems = todos.overdue();
    expect(overdueItems.length).toBe(1);
    expect(overdueItems[0].dueDate).toBe(yesterday);
  });

  test("Retrieves due today items", () => {
    todos.add({ title: "Today's todo", dueDate: today, completed: false });
    const todayItems = todos.dueToday();
    expect(todayItems.length).toBe(1);
    expect(todayItems[0].dueDate).toBe(today);
  });

  test("Retrieves due later items", () => {
    todos.add({ title: "Later todo", dueDate: tomorrow, completed: false });
    const laterItems = todos.dueLater();
    expect(laterItems.length).toBe(1);
    expect(laterItems[0].dueDate).toBe(tomorrow);
  });
});
