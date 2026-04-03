// controllers/postController.js
const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const { userId, text, media } = req.body;

    if (!text && !media) {
      return res.status(400).json("Text or media required");
    }

    const post = await Post.create({ userId, text, media });

    res.json(post);
  } catch (err) {
    res.status(500).json("Failed to create post");
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "name")
      .populate("comments.userId", "name") // 🔥 THIS LINE FIXES COMMENTS
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json("Failed to fetch posts");
  }
};

exports.likePost = async (req, res) => {
  try {
    const { userId } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json("Post not found");

    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json("Like failed");
  }
};

exports.commentPost = async (req, res) => {
  try {
    const { userId, text } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json("Post not found");

    post.comments.push({ userId, text });

    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json("Comment failed");
  }
}; 

exports.deletePost = async (req, res) => {
  try {
    const { userId } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json("Post not found");

    // 🔐 Only owner can delete
    if (post.userId.toString() !== userId) {
      return res.status(403).json("Not authorized");
    }

    await post.deleteOne();

    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json("Delete failed");
  }
};