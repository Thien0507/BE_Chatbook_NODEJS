const { Reaction, Action, Message } = require("../models");

exports.sendReact = async (req, res) => {
  try {
    const { body } = req;
    if (
      !Object.keys(body).length ||
      !body.userId ||
      !body.messageId ||
      !body.emojiId
    ) {
      throw new Error(
        "Invalid request: 'userId', 'messageId', 'emojiId' fields are required"
      );
    }
    const newReaction = await Reaction.create(
      {
        userId: body.userId,
        messageId: body.messageId,
        emojiId: body.emojiId,
      },
      { logging: false }
    );

    // Create action for sending message
    const thisMessage = await Message.findOne({
      where: { id: body.messageId },
      logging: false,
    });

    const sendReact = await Action.create({
      user1Id: body.userId,
      user2Id: 1,
      type: "reaction",
      status: "accepted",
    });

    res
      .status(201)
      .json({ status: "success", newReaction, thisMessage, sendReact });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
