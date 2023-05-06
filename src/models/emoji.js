"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Emoji extends Model {
    static associate(models) {
      // define association here
      Emoji.hasMany(models.Reaction, {
        foreignKey: "emojiId",
      });
    }
  }

  Emoji.init(
    {
      emojiName: DataTypes.STRING,
      emojiImage: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Emoji",
    }
  );
  return Emoji;
};
