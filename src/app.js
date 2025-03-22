const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/database");
const User = require("./models/user");
const PORT = process.env.PORT;
const privateKey = process.env.PRIVATE_KEY;
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/api", requestRouter);
app.use("/", userRouter);

app.get("/", (req, res) => {
  try {
    console.log("Everything is ok");
    res.send("Server is running!");
  } catch (error) {
    console.log(error);
    res.status(404).send("Not found")
  }
});

connectDB()
  .then(() => {
    console.log("Database Connection established...");
    app.listen(PORT, () => {
      console.log("Server listening successfully on port", PORT + "...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected");
  });
