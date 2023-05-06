const { User } = require("../models");

exports.updateMe = async (req, res) => {
  try {
    if (req.body.password || req.body.confirmPassword) {
      throw new Error("This route is not for update password");
    }

    const filterBody = {};
    const field = ["name", "email"];

    Object.keys(req.body).forEach((key) => {
      if (field.includes(key)) {
        filterBody[key] = req.body[key];
      }
    });
    const updateUser = await User.findOne({ where: { id: req.params.id } });
    if (!updateUser) {
      throw new Error("User not found");
    }

    updateUser.update(req.body);
    updateUser.save();

    res.status(200).json({
      status: "success",
      data: { user: updateUser },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message,
    });
  }
};

exports.deleteMe = async (req, res) => {
  try {
    const deletedUser = await User.destroy({
      where: { id: req.params.id },
      logging: false,
    });
    if (!deletedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        deletedUser,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.restoreMe = async (req, res) => {
  try {
    const restoredUser = await User.findOne({
      where: { id: req.params.id },
      paranoid: false, // Include soft-deleted records in the query
    });
    if (!restoredUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    await restoredUser.restore(); // Restore the soft-deleted record
    res.status(200).json({
      status: "success",
      data: {
        restoredUser,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.findUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.id | req.user.id },
      raw: true,
      logging: false,
      attributes: ["id", "name", "username", "picture", "email"],
    });
    if (!user) throw new Error("User not found");
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message,
    });
  }
};

exports.findAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      logging: false,
      attributes: ["id", "name", "username", "picture", "email"],
    });
    if (!users) throw new Error("Users not found");
    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message,
    });
  }
};
