const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRound = 12;

const createAndSendToken = (user, secret, res) => {
  delete user.password;
  const token = jwt.sign(user, secret);
  res.cookie("jwt", token, {
    expires: new Date(Date.now(+86400)),
    httpOnly: true,
  });
  res.status(200).json({ token, user });
};

exports.signup = async (req, res) => {
  try {
    const hasedPw = bcrypt.hashSync(req.body.password, saltRound);
    const user = await User.findOne({
      where: { username: req.body.username },
      raw: true,
    });

    if (user) {
      throw new Error(`User '${req.body.username}' already exists`);
    }

    const newUser = await User.create(
      {
        username: req.body.username,
        password: hasedPw,
        picture: req.body.picture,
      },
      { raw: true }
    );
    createAndSendToken(newUser.toJSON(), "DTVT_K65", res);
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new Error("Missing username or password");
    }

    const user = await User.findOne({
      where: { username: username },
      raw: true,
      logging: false,
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new Error("Password mismatch");
    }

    createAndSendToken(user, "DTVT_K65", res);
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
};

exports.logout = async (req, res) => {
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now(+1000)),
    httpOnly: true,
  });
  res.status(200).json({ status: "logouted" });
};

exports.updatePassword = (req, res) => {};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      throw new Error("You are not logged in!");
    }

    const decoded = jwt.verify(token, "DTVT_K65");
    const currentUser = await User.findOne({
      where: { id: decoded.id },
      logging: false,
    });

    if (!currentUser) {
      throw new Error("The user belonging to this token does no longer exist");
    }
    req.user = currentUser;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
