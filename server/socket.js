import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("send_comment", (newComment) => {
    socket.broadcast.emit("receive_comment", newComment);
  });
  
  socket.on("reply_comment", (data) => {
    socket.broadcast.emit("reply_comment", data);
  });

  socket.on("edit_comment", (data) => {
    socket.broadcast.emit("edit_comment", data);
  });

  socket.on("delete_comment", (data) => {
    socket.broadcast.emit("delete_comment", data);
  });

  socket.on("send_notification", (newNotification) => {
    socket.broadcast.emit("receive_notification", newNotification);
  });

  socket.on("delete_reply", (data) => {
    socket.broadcast.emit("delete_reply", data);
  });
});

httpServer.listen(3005, () => {
  console.log(`Socket is running at http://localhost:3005`);
});
