const path = require("path");
const cookieParser = require("cookie-parser");
const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRouter = require(path.join(__dirname, "./routes/user-route"));
const homeRouter = require(path.join(__dirname, "./routes/home-route"));
const blogRouter = require(path.join(__dirname, "./routes/blog-route"));
const authController = require(path.join(
  __dirname,
  "./controllers/auth-controller"
));

dotenv.config({ path: path.join(__dirname, "./config.env") });

mongoose
  .connect(
    process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD)
  )
  .then(() => console.log("Database Connected Successfully.."))
  .catch(() => console.log("Error connecting to DB"));

const app = express();
const PORT = 8000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "./public")));
app.use(morgan("dev"));

app.use(authController.protect);

app.use("/", homeRouter);
app.use("/users", userRouter);
app.use("/blogs", blogRouter);

app.listen(PORT, () => console.log(`Server Running on PORT: ${PORT}`));
