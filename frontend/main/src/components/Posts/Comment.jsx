export function Comment({ comment }) {
  return (
    <>
      <p>
        <strong>{comment.user.username}</strong>
      </p>
      <p>{comment.text}</p>
    </>
  );
}
