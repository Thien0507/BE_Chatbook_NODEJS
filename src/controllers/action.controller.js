const { Action, User, Message } = require("../models");
const { Op, Sequelize } = require("sequelize");

const dayAgo = new Date();
dayAgo.setDate(dayAgo.getDate() - 3);

exports.findAllAction = async (req, res) => {
  try {
    const { id } = req.user;

    const actions = await Action.findAll({
      include: [
        {
          model: User,
          as: "User1",
          attributes: ["id", "username", "picture"],
        },
        {
          model: Message,
          as: "Message",
          attributes: ["id", "type", "messageText"],
        },
      ],
      where: {
        user2Id: id,
        createdAt: {
          [Op.gte]: dayAgo,
        },
      },
      attributes: ["id", "createdAt", "messageId", "status", "type"],
      order: [["createdAt", "DESC"]],
      logging: false,
    });

    res.status(200).json({
      data: actions,
    });
  } catch (error) {
    res.status(404).json({
      data: null,
      message: error.message,
    });
  }
};
