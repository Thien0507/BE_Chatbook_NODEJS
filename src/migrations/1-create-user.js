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
          "https://firebasestorage.googleapis.com/v0/b/project1-ad195.appspot.com/o/thien%2Fdefault-image.png?alt=media&token=68763a44-9a68-4de7-827f-1bf4e9766672&_gl=1*hbiuj6*_ga*NDA0MDQxODkzLjE2ODIyNjA2Njc.*_ga_CW55HF8NVT*MTY4NjMyNDkxMC4xNS4xLjE2ODYzMjUwMzkuMC4wLjA.",
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
