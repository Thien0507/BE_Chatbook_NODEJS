const express = require("express");
const cors = require("cors");
const app = express();
require("./src/database/connectDb");
const cookieParser = require("cookie-parser");

const userRouter = require("./src/routes/user.route");
const friendRouter = require("./src/routes/friend.route");
const messageRouter = require("./src/routes/message.route");
const reactionRouter = require("./src/routes/reaction.route");
const { globalErrorHandler } = require("./src/controllers/error.controller");
const PORT = 8000;

app.use(cors());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/user", userRouter);
app.use("/friend", friendRouter);
app.use("/chat", messageRouter);
app.use("/reaction", reactionRouter);

app.all("*", (req, res, next) => {
  const error = new Error("This route is not allowed");
  next(error);
});

app.use(globalErrorHandler);

const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
  },
});

const userSockets = {};
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  userSockets[userId] = socket.id;
  console.log("A user connected with Id ", socket.id);

  socket.on("room", (id) => {
    console.log(id);
  });

  socket.on("send-message", (data) => {
    const to = userSockets[data.to];
    if (to && to !== socket.id) {
      io.to(to).emit("receive-message", data.message);
      data.message.isSend = true;
      io.to(socket.id).emit("receive-message", data.message);
    } else {
      data.message.isSend = true;
      io.to(socket.id).emit("receive-message", data.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    delete userSockets[userId];
  });
});

server.listen(PORT, (err) => {
  if (!err) {
    console.log(
      "Server is sucessfully listening and App is listening on port " + PORT
    );
  } else {
    console.log("Error occurred: " + err);
  }
});
