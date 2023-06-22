"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Message.belongsTo(models.User, { foreignKey: "senderId", as: "User1" });
      Message.belongsTo(models.User, {
        foreignKey: "recipientId",
        as: "User2",
      });
    }
  }
  Message.init(
    {
      senderId: DataTypes.INTEGER,
      recipientId: DataTypes.NUMBER,
      messageText: DataTypes.STRING(1000),
      type: {
        type: DataTypes.ENUM("text", "image", "video"),
        defaultValue: "text",
        allowNull: false,
        validate: {
          isIn: {
            args: [["text", "image", "video"]],
            msg: "Invalid value for type",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Message",
      paranoid: true,
    }
  );
  return Message;
};
