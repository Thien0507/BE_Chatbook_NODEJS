"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        unique: true,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      picture: {
        type: Sequelize.STRING(1000),
        defaultValue:
          "https://firebasestorage.googleapis.com/v0/b/project1-ad195.appspot.com/o/thien%2Fdefaut.png?alt=media&token=64c2e4f5-923d-45ef-881e-d6adc1725317",
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM("user", "admin"),
        defaultValue: "user",
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
