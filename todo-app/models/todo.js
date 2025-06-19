"use strict";
module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define("Todo", {
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
  });

  Todo.associate = function (models) {
    // associations can be defined here if needed
  };

  Todo.prototype.setCompletionStatus = async function (status) {
    this.completed = status;
    await this.save();
  };

  return Todo;
};
