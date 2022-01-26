const express = require("express");
const Sequelize = require("sequelize");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const userRouter = require("./routers/user-router");
const userFoodItemRouter = require("./routers/userFoodItem-router");
const FoodItemsRouter = require("./routers/FoodItems-router");
const reservationRouter = require("./routers/reservation-router");
const loginRouter = require("./routers/loginUser-router");
const friendRouter = require("./routers/friend-router");
const { CREATED, INTERNAL_SERVER_ERROR } = require("http-status");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/create", async (req, res, next) => {
  try {
    res.status(CREATED).json({ message: "Created" });
  } catch (error) {
    next(error);
  }
});

app.use("/api/users", userRouter);
app.use("/api/users", userFoodItemRouter);
app.use("/api/FoodItems", FoodItemsRouter);
app.use("/api/users", reservationRouter);
app.use("/api/users", loginRouter);
app.use("/api/users", friendRouter);

app.use((error, req, res, next) => {
  console.warn(error);
  res.status(INTERNAL_SERVER_ERROR).json({ message: "Server error" });
});

app.listen(8080);
