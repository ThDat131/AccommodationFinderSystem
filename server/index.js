import express from 'express';
import "./src/config/database/index.js";
import cors from "cors";
import UserRoute from "./src/api/routes/UserRoute.js";


const PORT = process.env.PORT || 8085;

const app = express();
app.use(express.json(), express.urlencoded(), cors());

app.use("/api", UserRoute);

app.listen(PORT, () => {
    console.log(`App is running at http://localhost:${PORT}`);
})

