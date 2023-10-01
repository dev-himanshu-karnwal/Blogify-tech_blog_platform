const path = require("path");
const { Router } = require("express");
const multer = require("multer");
const Blog = require(path.join(__dirname, "./../models/blog-model"));
const Comment = require(path.join(__dirname, "./../models/comment-model"));

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "./../public/images/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, `${req.user.id}-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.get("/add-blog", (req, res, next) => {
  res.status(200).render("addBlog", {
    user: req.user,
  });
});

router.post("/comment/:blogId", async (req, res, next) => {
  const comment = await Comment.create({
    content: req.body.content,
    createdBy: req.user.id,
    blogId: req.params.blogId,
  });

  res.status(201).redirect(`/blogs/${req.params.blogId}`);
});

router.get("/:id", async (req, res, next) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: blog._id }).populate(
    "createdBy"
  );
  res.status(200).render("blog", { user: req.user, blog, comments });
});

router.post("/", upload.single("coverImage"), async (req, res, next) => {
  const { body, title } = req.body;
  const blog = await Blog.create({
    body,
    title,
    coverImageURL: req.file.filename,
    createdBy: req.user.id,
  });
  res.status(201).redirect(`/blogs/${blog._id}`);
});

module.exports = router;
