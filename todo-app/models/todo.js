"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static associate(models) {
      // define association here if needed
    }

    static async addTodo({ title, dueDate, completed }) {
      return await Todo.create({ title, dueDate, completed });
    }
    
    static async getTodos() {
      return await Todo.findAll();
    }

    static async remove(id) {
      return await Todo.destroy({ where: { id } });
    }

    async markAsCompleted() {
      this.completed = true;
      await this.save();
      return this;
    }
  }

  Todo.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );

  return Todo;
};
