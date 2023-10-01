const { Router } = require("express");
const path = require("path");
const Blog = require(path.join(__dirname, "./../models/blog-model"));

const router = Router();

router.get("/", async (req, res, next) => {
  const allBlogs = await Blog.find({});
  res.status(200).render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

module.exports = router;
