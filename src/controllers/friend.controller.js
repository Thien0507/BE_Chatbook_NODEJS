const { Friend, Action, User, Sequelize } = require("../models");
const { Op } = require("sequelize");

changeKeyObj = (obj, newKeys, oldKeys) => {
  if (oldKeys.length !== newKeys.length) {
    return;
  }
  oldKeys.forEach((oldKey, index) => {
    obj[newKeys[index]] = obj[oldKey];
    delete obj[oldKey];
  });
};

exports.sendInvitation = async (req, res) => {
  try {
    // Kiểm tra body request không được rỗng và có chứa các field cần thiết
    const { body } = req;
    if (!Object.keys(body).length || !body.user2Id) {
      throw new Error("Invalid request: 'user2Id' fields are required");
    }

    const existInvitation = await Action.findAll({
      where: {
        [Op.or]: [
          { user1Id: req.user.id, user2Id: body.user2Id },
          { user2Id: req.user.id, user1Id: body.user2Id },
        ],
        status: {
          [Op.or]: ["pending", "accepted"],
        },
        type: "friendship",
      },
    });

    if (existInvitation.length > 0) {
      throw new Error("The invitation is already exist");
    }

    // Tạo hành động mới và lưu vào DB
    const sendInvitation = await Action.create({
      user1Id: req.user.id,
      user2Id: body.user2Id,
      type: "friendship",
    });

    // Trả về kết quả thành công
    res.status(201).json({ status: "success", sendInvitation });
  } catch (error) {
    // Trả về lỗi nếu có
    res.status(500).json({ error: error.message });
  }
};

exports.deleteFriend = async (req, res) => {
  try {
    const idMe = req.user.id;
    const idFriend = req.params.id;
    const friendShip = await Friend.findOne({
      where: {
        [Op.or]: [
          { user1Id: idMe, user2Id: idFriend },
          { user2Id: idMe, user1Id: idFriend },
        ],
      },
    });

    let deleteAction;
    if (!friendShip) {
      throw new Error("No friendShip");
    } else {
      deleteAction = await Action.destroy({
        where: {
          [Op.or]: [
            { user1Id: idMe, user2Id: idFriend },
            { user2Id: idMe, user1Id: idFriend },
          ],
          status: {
            [Op.or]: ["pending", "accepted"],
          },
          type: "friendship",
        },
      });
      await friendShip.destroy();
    }

    res
      .status(201)
      .json({ status: "success", data: { friendShip, deleteAction } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.checkFriendship = async (req, res) => {
  try {
    const userId = req.params.id;
    if (userId == req.user.id) {
      res.status(200).json({ status: "success", data: { status: "me" } });
    } else {
      const isFriendShip = await Friend.findOne({
        where: {
          [Op.or]: [
            { user2Id: req.user.id, user1Id: userId },
            { user1Id: req.user.id, user2Id: userId },
          ],
        },
        logging: false,
        raw: true,
      });

      if (isFriendShip) {
        res.status(200).json({
          status: "success",
          data: { userId, status: "friend" },
        });
      } else {
        const action = await Action.findOne({
          where: {
            [Op.or]: [
              { user2Id: req.user.id, user1Id: userId },
              { user1Id: req.user.id, user2Id: userId },
            ],
            type: "friendship",
            status: "pending",
          },
          logging: false,
          raw: true,
          order: [["createdAt", "DESC"]],
        });

        const status = action ? "pending" : "none";
        res.status(200).json({
          stautus: "success",
          data: {
            senderId: action ? action.user1Id : null,
            id: action ? action.id : null,
            userId,
            status,
          },
        });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMutalFriend = async (req, res) => {
  try {
    const userId = req.params.id;
    if (userId == req.user.id) throw new Error("Invalid id");

    let Friends = await Friend.findAll({
      where: {
        [Op.or]: [
          { user2Id: req.user.id, user1Id: userId },
          { user1Id: req.user.id, user2Id: userId },
        ],
      },
      logging: false,
      raw: true,
      attributes: [],
      include: [
        {
          model: User,
          require: true,
          as: `User2`,
          attributes: ["id", "username", "picture"],
        },
        {
          model: User,
          require: true,
          as: `User1`,
          attributes: ["id", "username", "picture"],
        },
      ],
    });

    if (!Friends.length === 0) {
      throw new Error("No Friend!");
    }
    // console.log(Friends);
    for (let i = 0; i < Friends.length; i++) {
      if (Friends[i][`User1.id`] == userId) {
        delete Friends[i][`User1.id`];
        delete Friends[i][`User1.username`];
        delete Friends[i][`User1.picture`];
        changeKeyObj(
          Friends[i],
          ["Friend.picture", "Friend.username", "Friend.id"],
          ["User2.picture", "User2.username", "User2.id"]
        );
      } else {
        delete Friends[i][`User2.id`];
        delete Friends[i][`User2.username`];
        delete Friends[i][`User2.picture`];
        changeKeyObj(
          Friends[i],
          ["Friend.picture", "Friend.username", "Friend.id"],
          ["User1.picture", "User1.username", "User1.id"]
        );
      }
    }

    let MutalFriends = [];
    await Friends.forEach(async (friend) => {
      if (friend["Friend.id"] !== req.user.id) {
        console.log(friend["Friend.id"], req.user.id);
        const checkFriend = Friend.findOne({
          where: {
            [Op.or]: [
              { user1Id: friend["Friend.id"], user2Id: req.user.id },
              { user2Id: friend["Friend.id"], user1Id: req.user.id },
            ],
          },
          logging: false,
          raw: true,
        });

        if (checkFriend) {
          MutalFriends.push(friend);
        }
      }
    });

    res.status(200).json({
      data: MutalFriends,
      status: "success",
    });
  } catch (error) {}
};

exports.getAllFriendMe = async (req, res) => {
  try {
    const userId = req.params.id ? req.params.id : req.user.id;
    let FriendsMe = await Friend.findAll({
      where: {
        [Op.or]: [{ user1Id: userId }, { user2Id: userId }],
      },
      logging: false,
      raw: true,
      attributes: [],
      include: [
        {
          model: User,
          require: true,
          as: `User2`,
          attributes: ["id", "username", "picture"],
        },
        {
          model: User,
          require: true,
          as: `User1`,
          attributes: ["id", "username", "picture"],
        },
      ],
    });

    if (!FriendsMe) {
      throw new Error("Have no friends");
    }

    for (let i = 0; i < FriendsMe.length; i++) {
      if (FriendsMe[i][`User1.id`] == userId) {
        delete FriendsMe[i][`User1.id`];
        delete FriendsMe[i][`User1.username`];
        delete FriendsMe[i][`User1.picture`];

        changeKeyObj(
          FriendsMe[i],
          ["Friend.picture", "Friend.username", "Friend.id"],
          ["User2.picture", "User2.username", "User2.id"]
        );
      } else {
        delete FriendsMe[i][`User2.id`];
        delete FriendsMe[i][`User2.username`];
        delete FriendsMe[i][`User2.picture`];
        changeKeyObj(
          FriendsMe[i],
          ["Friend.picture", "Friend.username", "Friend.id"],
          ["User1.picture", "User1.username", "User1.id"]
        );
      }
    }

    res.status(200).json({
      data: FriendsMe,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCommonFriends = async (req, res) => {};

exports.respond = async (req, res) => {
  try {
    // Kiểm tra body request không được rỗng và có chứa field 'respond'
    const { body } = req;
    if (!Object.keys(body).length || !body.respond) {
      throw new Error("Invalid request: 'respond' field is required");
    }

    // Lấy thông tin hành động hiện tại từ DB
    const currentAction = await Action.findOne({
      where: { id: req.params.id },
    });

    if (!currentAction) {
      throw new Error(`Action with ID '${req.params.id}' not found`);
    }
    if (currentAction.user2Id !== req.user.id && body.respond !== "rejected") {
      throw new Error("You do not have permission to respond to this action");
    }

    // Kiểm tra xem hành động có phải là kiểu tin nhắn không
    if (currentAction.type === "message") {
      throw new Error("Message action is not supported for response");
    }

    // Kiểm tra giá trị đầu vào của 'respond'
    const arrResponse = ["pending", "accepted", "rejected"];
    if (!arrResponse.includes(body.respond)) {
      throw new Error(
        "Invalid response: must be 'pending', 'accept' or 'rejected'"
      );
    }

    // Lưu trạng thái mới và tạo bạn mới nếu phản hồi là 'accepted'
    currentAction.status = body.respond;
    await currentAction.save();
    let newFriend;
    if (body.respond === "accepted") {
      const existingFriend = await Friend.findOne({
        where: {
          [Op.or]: [
            {
              user1Id: currentAction.user1Id,
              user2Id: currentAction.user2Id,
            },
            {
              user2Id: currentAction.user1Id,
              user1Id: currentAction.user2Id,
            },
          ],
        },
      });

      if (!existingFriend) {
        newFriend = await Friend.create({
          user1Id: currentAction.user1Id,
          user2Id: currentAction.user2Id,
        });
      }
    }

    // Trả về kết quả thành công
    res.status(201).json({ status: "success", currentAction, newFriend });
  } catch (error) {
    // Trả về lỗi nếu có
    res.status(500).json({ error: error.message });
  }
};
