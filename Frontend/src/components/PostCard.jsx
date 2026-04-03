import { useState } from "react";
import axios from "axios";

export default function PostCard({ post, user, fetchPosts }) {
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  const authorName = post.userId?.name || "User";
  const handle = authorName.toLowerCase().replace(/\s+/g, "");
  const createdAt = post.createdAt
    ? new Date(post.createdAt).toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Just now";

  const handleLike = async () => {
    await axios.put(`${import.meta.env.VITE_API_URL}/api/posts/${post._id}/like`, {
      userId: user._id,
    });
    fetchPosts();
  };

  const handleComment = async () => {
    if (!comment.trim()) return;

    await axios.post(`${import.meta.env.VITE_API_URL}/api/posts/${post._id}/comment`, {
      userId: user._id,
      text: comment,
    });

    setComment("");
    fetchPosts();
  };

  const handleDelete = async () => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${post._id}`, {
      data: { userId: user._id },
    });

    fetchPosts();
  };

  return (
    <article className="card post">
      <div className="post-header">
        <div className="post-header-left">
          <div className="avatar">{authorName[0].toUpperCase()}</div>

          <div className="post-meta">
            <div className="post-meta-row">
              <h4>{authorName}</h4>
              <span className="post-handle">@{handle}</span>
            </div>
            <p>{createdAt}</p>
          </div>
        </div>

        {post.userId._id === user._id && (
          <button className="delete-btn" onClick={handleDelete}>
            <span>Delete</span>
          </button>
        )}
      </div>

      {post.text && <p className="post-text">{post.text}</p>}

      {post.media && (
        <div className="post-media">
          {post.media.includes("video") ? (
            <video controls>
              <source src={post.media} />
            </video>
          ) : (
            <img src={post.media} alt="post" />
          )}
        </div>
      )}

      <div className="post-actions">
        <button className="action-btn" onClick={handleLike}>
          <span>Like</span>
          <strong>{post.likes.length}</strong>
        </button>

        <button
          className="action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          <span>Comments</span>
          <strong>{post.comments.length}</strong>
        </button>
      </div>

      {showComments && (
        <div className="comments">
          {post.comments.map((c, i) => (
            <div key={i} className="comment">
              <b>{c.userId?.name || "User"}</b>
              <span>{c.text}</span>
            </div>
          ))}

          <div className="comment-input">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
            />
            <button onClick={handleComment}>Send</button>
          </div>
        </div>
      )}
    </article>
  );
}
