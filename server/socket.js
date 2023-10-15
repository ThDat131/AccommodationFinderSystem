import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

const io = new Server(3005, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT"],
  },
});

const connectedUsers = {};

io.on("connection", (socket) => {
  socket.on("login", (userId) => {
    connectedUsers[userId] = socket;
  });

  socket.on("send_comment", (newComment) => {
    io.emit("receive_comment", newComment);
  });

  socket.on("send_reply_comment", (data) => {
    io.emit("receive_reply_comment", data);
  });

  socket.on("send_edit_comment", (data) => {
    io.emit("receive_edit_comment", data);
  });

  socket.on("send_delete_comment", (data) => {
    io.emit("receive_delete_comment", data);
  });

  socket.on("send_notification", (data) => {
    const userSocket = connectedUsers[data.receiver];
    console.log(data);
    io.to(userSocket.id).emit("receive_notification", data);
  });

  socket.on("send_delete_reply", (data) => {
    io.emit("receive_delete_reply", data);
  });

  socket.on("logout", () => {
    for (const userId in connectedUsers) {
      if (connectedUsers[userId] === socket) {
        delete connectedUsers[userId];
        break;
      }
    }
  });
});

httpServer.listen(3000, () => {
  console.log("Socket is running at http://localhost:3005");
});
