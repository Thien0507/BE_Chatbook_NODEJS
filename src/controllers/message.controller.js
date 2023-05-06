const { Message, Action, User } = require("../models");
const { Op } = require("sequelize");
exports.sendMessage = async (req, res) => {
  try {
    const { body } = req;
    const senderId = req.user.id;
    if (!Object.keys(body).length || !body.recipientId || !body.messageText) {
      throw new Error(
        "Invalid request: 'senderId', 'recipientId', 'messageText' fields are required"
      );
    }
    const newMessage = await Message.create({
      senderId,
      recipientId: body.recipientId,
      messageText: body.messageText,
    });

    // Create action for sending message

    const sendMsg = await Action.create({
      user1Id: req.user.id,
      user2Id: body.recipientId,
      type: "message",
      status: "accepted",
    });

    res.status(201).json({ status: "success", newMessage, sendMsg });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessage = async (req, res) => {
  try {
    const query = Object.keys(req.query);
    if (!query.includes("recipientId")) {
      throw new Error("Request require a query string that have recipientId");
    }
    const senderId = req.user.id;
    const recipientId = req.query["recipientId"];

    let currentConversation = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: senderId, recipientId: recipientId },
          { senderId: recipientId, recipientId: senderId },
        ],
      },
      raw: true,
      order: [["createdAt", "ASC"]],
      logging: false,
    });

    currentConversation = currentConversation.map((el) => {
      let isSend = "";
      el.senderId === senderId ? (isSend = true) : (isSend = false);
      return { ...el, isSend };
    });

    res.status(200).json({ data: currentConversation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Message.findAll({
      where: {
        [Op.or]: [{ senderId: req.user.id }, { recipientId: req.user.id }],
      },
      attributes: ["messageText", "createdAt", "senderId", "recipientId"],
      order: [["createdAt", "DESC"]],
      raw: true,
      logging: false,
    });
    let lastConversation = [];
    const users = conversations.reduce((result, conversation) => {
      const otherUserId =
        conversation.senderId === req.user.id
          ? conversation.recipientId
          : conversation.senderId;
      if (!result.includes(otherUserId)) {
        result.push(otherUserId);
        lastConversation.push(conversation);
      }
      return result;
    }, []);

    lastConversation = (
      await Promise.all(
        users.map((userId) =>
          User.findOne({
            where: { id: userId },
            attributes: ["id", "username", "picture", "name"],
            raw: true,
            logging: false,
          })
        )
      )
    ).map((el, i) => {
      return { ...el, ...lastConversation[i] };
    });
    res.status(200).json({ data: lastConversation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
