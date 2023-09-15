import express from 'express';
import "./src/config/database/index.js";
import cors from "cors";
import cookieParser from 'cookie-parser';
import UsersRoute from "./src/api/routes/UsersRoute.js";
import methodOverride from 'method-override';



const PORT = process.env.PORT || 8085;

const app = express();
app.use(express.json(), express.urlencoded(), cors());
app.use(cookieParser());
app.use(methodOverride('_method'))
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

app.use("/api", UsersRoute);

app.listen(PORT, () => {
    console.log(`App is running at http://localhost:${PORT}`);
})

