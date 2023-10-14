import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

const io = new Server(3005, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST', 'PUT']
  }
});

io.on("connection", (socket) => {
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

  socket.on("send_notification", (newNotification) => {
    io.emit("receive_notification", newNotification);
  });

  socket.on("send_delete_reply", (data) => {
    io.emit("receive_delete_reply", data);
  });
});

httpServer.listen(3000, () => {
  console.log('Socket is running at http://localhost:3005');
});