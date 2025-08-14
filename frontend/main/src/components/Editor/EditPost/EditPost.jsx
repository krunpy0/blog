import { Link } from "react-router-dom";
import styles from "./EditPost.module.css";
import MDEditor from "@uiw/react-md-editor";
import { useAuth } from "../../../authContext";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
export function EditPost() {
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const { userData } = useAuth();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (userData && userData.creator) {
      fetchPost();
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [userData]);

  if (userData === null || isLoading) return <div>Loading...</div>;
  if (!userData.creator)
    return (
      <>
        <div>You are not allowed</div>
        <Link to={"/"} style={{ color: "white" }}>
          Main page
        </Link>
      </>
    );

  async function fetchPost() {
    try {
      const res = await fetch(`http://localhost:3000/posts/${id}`, {
        credentials: "include",
      });
      if (!res.ok) {
        alert(res.status);
        return;
      }
      const post = await res.json();
      console.log(post);
      setValue(post.text);
      setTitle(post.title);
    } catch (err) {
      alert(err);
    }
  }

  async function handleSubmit() {
    const res = await fetch(`http://localhost:3000/posts/${id}`, {
      credentials: "include",
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, value }),
    });
    if (res.ok) {
      console.log("Ok");
      navigate(`/posts/${id}`);
    }
  }

  return (
    <div className={styles.container}>
      <h1>Update post</h1>
      <div className={styles.titlePrompt}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <MDEditor onChange={setValue} value={value} />
      <button onClick={handleSubmit}>Update</button>
      <MDEditor.Markdown source={value} style={{ whiteSpace: "pre-wrap" }} />
    </div>
  );
}
