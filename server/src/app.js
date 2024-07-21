const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const errorHandler = require("./middlewares/errorHandler.middleware.js");

const app = express();
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/temp/",
  })
);

const messageRouter = require("./routes/message.routes");
const userRouter = require("./routes/user.routes.js");

app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);

app.use(errorHandler);
module.exports = app;
