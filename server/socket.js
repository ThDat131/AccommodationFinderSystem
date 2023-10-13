import { createServer } from "http";
import { Server } from "socket.io";
import WebSocket, {WebSocketServer} from "ws";

const wss =  new WebSocketServer({
  port: 3005,
})

// io.on("connection", (socket) => {
//   socket.on("send_comment", (newComment) => {
//     socket.broadcast.emit("receive_comment", newComment);
//   });

wss.on('connection', (ws) => {
  ws.on("send_comment", (newComment) => {
    ws.send("receive_comment", newComment);
  })
  ws.on("reply_comment", (data) => {
    ws.send("reply_comment", data);
  })
  ws.on("edit_comment", (data) => {
    ws.send("edit_comment", data);
  })
  ws.on("delete_comment", (data) => {
    ws.send("delete_comment", data);
  })
  ws.on("send_notification", (newNotification) => {
    ws.send("send_notification", newNotification);
  })
  ws.on("delete_reply", (data) => {
    ws.send("delete_reply", data);
  })
})

