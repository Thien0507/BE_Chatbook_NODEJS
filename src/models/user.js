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
      User.hasMany(models.Message, { foreignKey: "senderId" });
      User.hasMany(models.Message, { foreignKey: "recipientId" });
      User.hasMany(models.Friend, { foreignKey: "user1Id" });
      User.hasMany(models.Friend, { foreignKey: "user2Id" });
    }
  }
  User.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      username: { type: DataTypes.STRING, unique: true, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      picture: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "default.jpg",
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
