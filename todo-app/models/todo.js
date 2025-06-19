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
Todo.prototype.setCompletionStatus = async function (status) {
  this.completed = status;
  return this.save();
};
Todo.overdue = async function () {
  return this.findAll({
    where: {
      dueDate: { [Op.lt]: new Date() },
      completed: false,
    },
    order: [["dueDate", "ASC"]],
  });
};

Todo.dueToday = async function () {
  return this.findAll({
    where: {
      dueDate: { [Op.eq]: new Date().toISOString().split("T")[0] },
      completed: false,
    },
  });
};

Todo.dueLater = async function () {
  return this.findAll({
    where: {
      dueDate: { [Op.gt]: new Date() },
      completed: false,
    },
    order: [["dueDate", "ASC"]],
  });
};

Todo.completed = async function () {
  return this.findAll({
    where: {
      completed: true,
    },
    order: [["dueDate", "ASC"]],
  });
};
