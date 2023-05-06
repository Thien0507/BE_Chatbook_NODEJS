const { Friend, Action } = require("../models");

exports.sendInvitation = async (req, res) => {
  try {
    // Kiểm tra body request không được rỗng và có chứa các field cần thiết
    const { body } = req;
    if (!Object.keys(body).length || !body.user2Id) {
      throw new Error("Invalid request: 'user2Id' fields are required");
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
    if (currentAction.user2Id !== req.user.id) {
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
      newFriend = await Friend.create({
        user1Id: currentAction.user1Id,
        user2Id: currentAction.user2Id,
      });
    }

    // Trả về kết quả thành công
    res.status(201).json({ status: "success", currentAction, newFriend });
  } catch (error) {
    // Trả về lỗi nếu có
    res.status(500).json({ error: error.message });
  }
};
