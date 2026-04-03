// routes/postRoutes.js
const router = require("express").Router();
const {
  createPost,
  getPosts,
  likePost,
  commentPost,
  deletePost
} = require("../controllers/postController");

router.post("/", createPost);
router.get("/", getPosts);
router.put("/:id/like", likePost);
router.post("/:id/comment", commentPost);
router.delete("/:id", deletePost);

module.exports = router;