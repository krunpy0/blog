import React, { useContext, createContext, useState } from "react";

const PostsContext = createContext();

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState(null);

  async function fetchPosts() {
    const res = await fetch("http://localhost:3000/posts", {
      credentials: "include",
    });
    const fetchedPosts = await res.json();
    console.log(fetchedPosts.posts);
    setPosts(fetchedPosts.posts);
  }

  return (
    <PostsContext.Provider value={{ posts, fetchPosts }}>
      {children}
    </PostsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePosts() {
  return useContext(PostsContext);
}
