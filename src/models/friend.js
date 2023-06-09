"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Friend extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Friend.belongsTo(models.User, { foreignKey: "user1Id", as: "User1" });
      Friend.belongsTo(models.User, { foreignKey: "user2Id", as: "User2" });
    }
  }
  Friend.init(
    {
      user1Id: DataTypes.INTEGER,
      user2Id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Friend",
    }
  );
  return Friend;
};
