import { useState } from "react";
import { useAuth } from "../../authContext";
import dayjs from "dayjs";
dayjs.locale("en");
export function Comment({ comment, postId, fetchPost }) {
  const [disabled, setDisabled] = useState(false);
  console.log(comment);
  const { userData } = useAuth();
  console.log(userData);
  async function deleteComment() {
    try {
      setDisabled(true);
      const res = await fetch(
        `http://localhost:3000/posts/${postId}/comment/${comment.id}`,
        {
          credentials: "include",
          method: "DELETE",
        }
      );
      if (!res.ok) return console.log(res.status);

      const result = await res.json();
      console.log(result);
      fetchPost();
    } catch (err) {
      console.log(err);
    } finally {
      setDisabled(false);
    }
  }
  return (
    <div>
      <p>
        <strong>{comment.user.username}</strong>{" "}
        <span style={{ color: "rgba(115, 115, 115, 1)" }}>
          {dayjs(comment.createdAt).format("DD/MM/YYYY HH:MM:ss")}
        </span>
      </p>
      <p>{comment.text}</p>
      {userData?.id === comment?.user.id && (
        <button
          onClick={deleteComment}
          disabled={disabled}
          style={{
            border: "none",
            padding: "0.35rem 1rem",
            borderRadius: "0.5rem",
          }}
        >
          Delete
        </button>
      )}
    </div>
  );
}
