import express from "express";
import "./src/config/database/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import UsersRoute from "./src/api/routes/UsersRoute.js";
import PostsRoute from "./src/api/routes/PostsRoute.js";
import CategoriesRoute from "./src/api/routes/CategoriesRoute.js";
import LandlordsRoute from "./src/api/routes/LandlordsRoute.js";
import FollowsRoute from "./src/api/routes/FollowsRoute.js";
import CommentsRoute from "./src/api/routes/CommentsRoute.js";
import methodOverride from "method-override";
import http from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 8085;

const app = express();
app.use(express.json(), express.urlencoded(), cors(), cookieParser());
// app.use(methodOverride('_method'))
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

// configuration socker.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});
io.on("connection", (socket) => {
  socket.on("send_comment", (data) => {
    socket.broadcast.emit("receive_comment", data);
    console.log(data);
  });
});

app.use("/api", UsersRoute);
app.use("/api", PostsRoute);
app.use("/api", CategoriesRoute);
app.use("/api", LandlordsRoute);
app.use("/api", FollowsRoute);
app.use("/api", CommentsRoute);

server.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
