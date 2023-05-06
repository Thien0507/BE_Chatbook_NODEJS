"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Action extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Action.belongsTo(models.User, { foreignKey: "user1Id" });
      Action.belongsTo(models.User, { foreignKey: "user2Id" });
    }
  }
  Action.init(
    {
      user1Id: { type: DataTypes.INTEGER, allowNull: false },
      user2Id: { type: DataTypes.INTEGER, allowNull: false },
      status: {
        type: DataTypes.ENUM("pending", "accepted", "rejected"),
        defaultValue: "pending",
        allowNull: false,
        validate: {
          isIn: {
            args: [["pending", "accepted", "rejected"]],
            msg: "Invalid value for type",
          },
        },
      },
      type: {
        type: DataTypes.ENUM("friendship", "message", "reaction"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["friendship", "message", "reaction"]],
            msg: "Invalid value for type",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Action",
    }
  );
  return Action;
};
