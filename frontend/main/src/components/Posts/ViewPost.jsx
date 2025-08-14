import MDEditor from "@uiw/react-md-editor";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
export function ViewPost() {
  const { id } = useParams();
  console.log(id);
  const [post, setPost] = useState(null);
  async function fetchPost() {
    try {
      const res = await fetch(`http://localhost:3000/posts/${id}`);
      if (!res.ok) {
        setPost(false);
        console.log("ERRORRR");
        return;
      }
      const result = await res.json();
      setPost(result);
    } catch (err) {
      console.error(err);
      setPost(false);
    }
  }
  useEffect(() => {
    fetchPost();
  }, []);
  if (post === null) return <div>Loading</div>;
  if (post === false) return <h1>Error loading post</h1>;
  return (
    <>
      {post?.text && (
        <>
          <h1>{post.title}</h1>
          <MDEditor.Markdown
            source={post.text}
            style={{ whiteSpace: "pre-wrap" }}
          />
          <Link to={"/"} style={{ color: "white" }}>
            Back
          </Link>
        </>
      )}
    </>
  );
}
