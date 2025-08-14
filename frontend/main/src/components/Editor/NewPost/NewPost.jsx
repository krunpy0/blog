import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./NewPost.module.css";
import MDEditor from "@uiw/react-md-editor";
import { useAuth } from "../../../authContext";
export function EditTest() {
  const [value, setValue] = useState("**Hello world!**");
  const [title, setTitle] = useState("");
  const { userData } = useAuth();

  if (userData === null) return <div>Loading...</div>;
  if (userData.creator === false)
    return (
      <>
        <div>You are not allowed</div>
        <Link to={"/"} style={{ color: "white" }}>
          Main page
        </Link>
      </>
    );

  async function handleSubmit() {
    const res = await fetch("http://localhost:3000/post", {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, value }),
    });
    if (res.ok) console.log("OK");
  }
  return (
    <div className={styles.container}>
      <h1>Create new post</h1>
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
      <button onClick={handleSubmit}>Upload</button>
      <MDEditor.Markdown source={value} style={{ whiteSpace: "pre-wrap" }} />
    </div>
  );
}
