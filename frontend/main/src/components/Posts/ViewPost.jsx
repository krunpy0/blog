import MDEditor from "@uiw/react-md-editor";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { useAuth } from "../../authContext";
dayjs.locale("en");
import styles from "./ViewPost.module.css";
import { Comment } from "./Comment";

export function ViewPost() {
  const { userData } = useAuth();
  console.log(userData);
  const [comment, setComment] = useState("");
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
  async function sendComment() {
    try {
      const res = await fetch(`http://localhost:3000/posts/${id}/comment`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ comment }),
      });
      if (!res.ok) return alert(res.status);
      const response = await res.json();
      console.log(response);
      fetchPost();
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (post === null) return <div>Loading</div>;
  if (post === false) return <h1>Error loading post</h1>;
  console.log(post);
  return (
    <>
      {post?.text && (
        <div className={styles.postWrapper}>
          <div className={styles.container}>
            <div className={styles.upperWrapper}>
              <h1>{post.title}</h1>
              <p>
                By {post.author.username}.{" "}
                <span style={{ color: "rgba(98, 98, 98, 1)" }}>
                  Created at {dayjs(post.createdAt).format("DD.MM.YYYY")}
                </span>
              </p>
              <hr />
            </div>
            <MDEditor.Markdown
              source={post.text}
              style={{
                whiteSpace: "pre-wrap",
                backgroundColor: " #151515",
              }}
            />
            <Link to={"/"} style={{ color: "white" }}>
              Back
            </Link>
            <hr />
            <div className={styles.comments}>
              <h2 className={styles.commentsLabel}>
                {post.comments.length} comments
              </h2>
              <div className={styles.commentsPrompt}>
                <label htmlFor="comment">Leave a comment!</label>
                <input
                  type="text"
                  name="comment"
                  id="comment"
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                />
                {userData ? (
                  <button
                    disabled={comment.trim().length === 0}
                    onClick={() => {
                      sendComment();
                    }}
                  >
                    Send
                  </button>
                ) : (
                  <p>
                    You need to{" "}
                    <Link to={"/login"} style={{ color: "white" }}>
                      log in
                    </Link>{" "}
                    to comment posts
                  </p>
                )}
              </div>
              {post.comments?.map((comment) => (
                <Comment comment={comment} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
