import { useState } from "react";
import axios from "axios";

export default function CreatePost({ user, fetchPosts }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const IMAGE_LIMIT = 2 * 1024 * 1024;
  const VIDEO_LIMIT = 5 * 1024 * 1024;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    // 🔥 Validate type
    const isImage = selected.type.startsWith("image");
    const isVideo = selected.type.startsWith("video");

    if (!isImage && !isVideo) {
      alert("Only image or video allowed");
      return;
    }

    // 🔥 Validate size
    if (isImage && selected.size > IMAGE_LIMIT) {
      alert("Image must be under 2MB");
      return;
    }

    if (isVideo && selected.size > VIDEO_LIMIT) {
      alert("Video must be under 5MB");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handlePost = async () => {
    if (!text.trim() && !file) {
      return alert("Add text or media");
    }

    try {
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = async () => {
          await axios.post(`${import.meta.env.VITE_API_URL}/api/posts`, {
            userId: user._id,
            text,
            media: reader.result,
          });

          reset();
          fetchPosts();
        };
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/posts`, {
          userId: user._id,
          text,
        });

        reset();
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to post");
    }
  };

  const reset = () => {
    setText("");
    setFile(null);
    setPreview("");
  };

  return (
    <div className="card create-post">
      <div className="create-post-header">
        <div>
          <p className="eyebrow">Create Post</p>
          <h3>Share an update</h3>
        </div>
        <div className="create-post-badge">
          {(user?.name?.[0] || "U").toUpperCase()}
        </div>
      </div>

      <textarea
        placeholder={`What's on your mind, ${user.name}?`}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* Preview */}
      {preview && (
        <div className="media-preview">
          {file.type.startsWith("video") ? (
            <video src={preview} controls />
          ) : (
            <img src={preview} alt="preview" />
          )}
        </div>
      )}

      <div className="create-post-footer">
        <label className="upload-btn">
          📎 Add Media
          <input
            type="file"
            accept="image/*,video/*"
            hidden
            onChange={handleFileChange}
          />
        </label>
        <p className="file-hint">
          Image max: 2MB | Video max: 5MB
        </p>

        <button onClick={handlePost}>Post</button>
      </div>
    </div>
  );
}