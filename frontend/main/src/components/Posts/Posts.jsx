import { useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Link } from "react-router-dom";
import styles from "./Posts.module.css";
import { LikeIcon, CommentIcon } from "./Icons";
import { Post } from "./Post";
//import { useContext } from "react";
import { usePosts } from "../../Context";
// import { useAuth } from "../../authContext";
export function Posts({ userData }) {
  /* const [posts, setPosts] = useState(null);
  //const [likedPosts, setLikedPosts] = useState(null);
  async function fetchPosts() {
    try {
      const res = await fetch("http://localhost:3000/posts", {
        credentials: "include",
      });
      if (!res.ok) {
        setPosts(false);
        return;
      }
      const fetchedPosts = await res.json();
      console.log(fetchedPosts.posts);
      setPosts(fetchedPosts.posts);
      const likedByUser = posts?.map((post) => {
        console.log(post.like);
        return post.like;
      });
      console.log(likedByUser);
    } catch (err) {
      console.log(err);
      setPosts(false);
    }
  }

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  */
  //const {userData, fetchUser} = useAuth();
  const { posts, fetchPosts } = usePosts();
  useEffect(() => {
    if (!posts) fetchPosts();
  }, []);
  async function likePost(id) {
    try {
      const res = await fetch(`http://localhost:3000/posts/${id}/like`, {
        credentials: "include",
        method: "POST",
      });
      if (!res.ok) return alert("error");
      const result = await res.json();
      console.log(result);
      fetchPosts();
    } catch (err) {
      console.log(err);
    }
  }

  if (posts === null) return <h3>Loading posts...</h3>;
  if (posts === false) return <h3>Error loading posts</h3>;
  return (
    <div className={styles.postContainer}>
      {posts.map((post) => (
        <Post
          post={post}
          styles={styles}
          likePost={likePost}
          key={post.id}
          fetchPosts={fetchPosts}
          userData={userData}
        />
      ))}
    </div>
  );
}
