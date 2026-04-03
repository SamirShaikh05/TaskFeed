import { useEffect, useState } from "react";
import axios from "axios";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";

export default function Home({ user, setUser }) {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts`);
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div className="home">
      <header className="topbar">
        <div className="topbar-brand">
          <p className="eyebrow">Social</p>
          <h2>TaskFeed</h2>
        </div>

        <div className="topbar-actions">
          <div className="user-pill">
            <div className="user-pill-avatar">
              {(user?.name?.[0] || "U").toUpperCase()}
            </div>
            <div>
              <strong>{user?.name}</strong>
              <span>@{(user?.name || "user").toLowerCase().replace(/\s+/g, "")}</span>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="feed-container">
        <CreatePost user={user} fetchPosts={fetchPosts} />

        <section className="feed-stack">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              user={user}
              fetchPosts={fetchPosts}
            />
          ))}
        </section>
      </div>
    </div>
  );
}
