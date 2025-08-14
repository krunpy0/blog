import { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Link } from "react-router-dom";
export function Posts() {
  const [posts, setPosts] = useState(null);
  async function fetchPosts() {
    try {
      const res = await fetch("http://localhost:3000/posts");
      if (!res.ok) {
        setPosts(false);
        return;
      }
      const fetchedPosts = await res.json();
      setPosts(fetchedPosts.posts);
    } catch (err) {
      console.log(err);
      setPosts(false);
    }
  }
  useEffect(() => {
    fetchPosts();
  }, []);

  if (posts === null) return <h3>Loading posts...</h3>;
  if (posts === false) return <h3>Error loading posts</h3>;
  return (
    <>
      <div>
        {posts.map((post) => (
          <div key={post.id}>
            <h1>{post.title}</h1>
            <p>
              {" "}
              <strong>{post.author.username}</strong>
            </p>
            <MDEditor.Markdown
              source={post.text.substring(0, 100)}
              style={{ whiteSpace: "pre-wrap", maxWidth: "300px" }}
            />
            <Link to={`/posts/${post.id}`} style={{ color: "white" }}>
              Go to post
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
