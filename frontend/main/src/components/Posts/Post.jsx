import MDEditor from "@uiw/react-md-editor";
import { Link } from "react-router-dom";
import { LikeIcon, CommentIcon } from "./Icons";
import { useState } from "react";

export function Post({ post, styles, likePost }) {
  const [liked, setLiked] = useState(post.likes.length > 0 ? true : false);
  const [count, setCount] = useState(post._count.likes);
  return (
    <>
      <div className={styles.post} key={post.id}>
        <div className={styles.postInfo}>
          <h1>{post.title}</h1>
          <p> By {post.author.username}</p>
        </div>
        <MDEditor.Markdown
          source={post.text.substring(0, 100)}
          style={{ whiteSpace: "pre-wrap", padding: "8px 16px" }}
        />
        <div className={styles.bottomInfo}>
          <Link to={`/posts/${post.id}`} style={{ color: "white" }}>
            Go to post
          </Link>
          <div className={styles.bottomInfoWrapper}>
            <div className={styles.like}>
              <button
                onClick={() => {
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
              <button onClick={() => {}}>
                <CommentIcon />
              </button>
              <p>0</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
