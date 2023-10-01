const path = require("path");
const express = require("express");
const User = require(path.join(__dirname, "./../models/user-model"));

const router = express.Router();

router
  .route("/signup")
  .get((req, res, next) => {
    res.status(200).render("signup");
  })
  .post(async (req, res, next) => {
    const { fullName, email, password } = req.body;
    await User.create({ fullName, email, password });
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.status(201).cookie("jwt", token).redirect("/");
  });

router
  .route("/signin")
  .get((req, res, next) => {
    res.status(200).render("signin");
  })
  .post(async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const token = await User.matchPasswordAndGenerateToken(email, password);
      return res.status(202).cookie("jwt", token).redirect("/");
    } catch (error) {
      return res.status(400).render("signin", {
        error: "Incorrect Email or Password",
      });
    }
  });

router.route("/signout").get((req, res, next) => {
  res.clearCookie("jwt").status(200).redirect("/");
});

module.exports = router;
