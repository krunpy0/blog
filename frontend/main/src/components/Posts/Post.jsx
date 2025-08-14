import MDEditor from "@uiw/react-md-editor";
import { Link } from "react-router-dom";
import { LikeIcon, CommentIcon } from "./Icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
dayjs.locale("en");
export function Post({ post, styles, likePost, userData }) {
  const [liked, setLiked] = useState(post.likes?.length > 0 ? true : false);
  const [count, setCount] = useState(post._count.likes);
  const navigate = useNavigate();
  async function deletePost(id) {
    let userPrompt = confirm("Are you sure?");
    if (!userPrompt) {
      return alert("Canceled");
    }
    try {
      const res = await fetch(`http://localhost:3000/posts/${id}`, {
        credentials: "include",
        method: "DELETE",
      });
      if (!res.ok) {
        return alert(res.status);
      }
      const response = await res.json();
      console.log(response);
      alert("Deleted!");
      navigate("/");
    } catch (err) {
      alert("Error deleting");
      console.log(err);
    }
  }
  console.log(post);
  return (
    <>
      <div className={styles.post} key={post.id}>
        <div className={styles.postInfo}>
          <h1>
            <Link to={`/posts/${post.id}`} style={{ color: "white" }}>
              {post.title}
            </Link>
          </h1>
          <p>
            {" "}
            By {post.author.username}.{" "}
            <span style={{ color: "rgba(98, 98, 98, 1)" }}>
              Created at {dayjs(post.createdAt).format("DD/MM/YYYY HH:MM:ss")}
            </span>
          </p>
        </div>
        <MDEditor.Markdown
          source={post.text}
          style={{
            textWrap: "pretty",
            whiteSpace: "pre-wrap",
            padding: "16px 0px",
            backgroundColor: "#141414",
            maxHeight: "200px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        />
        <div className={styles.bottomInfo}>
          <Link to={`/posts/${post.id}`} style={{ color: "white" }}>
            Read full post
          </Link>
          {userData?.creator && (
            <>
              <Link to={`/edit/${post.id}`} style={{ color: "white" }}>
                Edit post
              </Link>
              <button
                className={styles.delete}
                onClick={() => deletePost(post.id)}
              >
                Delete
              </button>
            </>
          )}

          <div className={styles.bottomInfoWrapper}>
            <div className={styles.like}>
              <button
                onClick={() => {
                  if (!userData) {
                    alert("Log into your account to like posts");
                    return;
                  }
                  likePost(post.id);
                  setLiked(!liked);
                  setCount(liked ? count - 1 : count + 1);
                }}
              >
                <LikeIcon filled={liked} />{" "}
              </button>
              <p>{count}</p>
            </div>
            <div className={styles.comment}>
              <button
                onClick={() => {
                  navigate(`/posts/${post.id}`);
                }}
              >
                <CommentIcon />
              </button>
              <p>{post.comments.length}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
