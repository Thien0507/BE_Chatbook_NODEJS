"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Message, { foreignKey: "senderId", as: "Message1" });
      User.hasMany(models.Message, {
        foreignKey: "recipientId",
        as: "Message2",
      });
      User.hasMany(models.Friend, { foreignKey: "user1Id", as: "Friend1" });
      User.hasMany(models.Friend, { foreignKey: "user2Id", as: "Friend2" });
    }
  }
  User.init(
    {
      username: { type: DataTypes.STRING, unique: true, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      picture: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        defaultValue:
          "https://firebasestorage.googleapis.com/v0/b/project1-ad195.appspot.com/o/thien%2Fdefault-image.png?alt=media&token=68763a44-9a68-4de7-827f-1bf4e9766672&_gl=1*hbiuj6*_ga*NDA0MDQxODkzLjE2ODIyNjA2Njc.*_ga_CW55HF8NVT*MTY4NjMyNDkxMC4xNS4xLjE2ODYzMjUwMzkuMC4wLjA.",
      },
      role: { type: DataTypes.ENUM("user", "admin"), default: "user" },
    },
    {
      sequelize,
      modelName: "User",
      paranoid: true,
    }
  );
  return User;
};
