"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Reaction.belongsTo(models.Message, { foreignKey: "messageId" });
      Reaction.belongsTo(models.User, { foreignKey: "userId" });
      Reaction.belongsTo(models.Emoji, { foreignKey: "emojiId" });
    }
  }
  Reaction.init(
    {
      userId: DataTypes.INTEGER,
      messageId: DataTypes.INTEGER,
      emojiId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Reaction",
    }
  );
  return Reaction;
};
