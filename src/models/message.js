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
      Message.hasMany(models.Reaction, { foreignKey: "messageId" });
      Message.belongsTo(models.User, { foreignKey: "senderId" });
      Message.belongsTo(models.User, { foreignKey: "recipientId" });
    }
  }
  Message.init(
    {
      senderId: DataTypes.INTEGER,
      recipientId: DataTypes.NUMBER,
      messageText: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Message",
      paranoid: true,
    }
  );
  return Message;
};
