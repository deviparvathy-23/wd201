const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("./connectDB.js");

class Todo extends Model {}

Todo.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
    },
    completed: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
    modelName: "Todo",
  },
);

// Sync table
(async () => {
  try {
    await Todo.sync();
    console.log("Todo table synced successfully.");
  } catch (error) {
    console.error("Error syncing Todo model:", error);
  }
})();

module.exports = Todo;
