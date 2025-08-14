// import { useEffect, useState } from "react";
import styles from "./App.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../authContext.jsx";
import { Posts } from "../Posts/Posts.jsx";

function App() {
  const { userData, loading, fetchUser } = useAuth();
  console.log(userData);
  if (loading) return <>Loading...</>;
  return (
    <>
      <div className={styles.wrapper}>
        {userData ? (
          <>
            <div className={styles.welcome}>
              <h1>Hello, {userData.username}</h1>
              <div>
                <button
                  onClick={async () => {
                    const res = await fetch("http://localhost:3000/logout", {
                      credentials: "include",
                    });
                    if (res.ok) {
                      return fetchUser();
                    }
                  }}
                >
                  Log out
                </button>
              </div>
            </div>
          </>
        ) : (
          <h1>
            Seems that you don't have an account.{" "}
            <Link to={"/login"} style={{ color: "white" }}>
              Log in
            </Link>
          </h1>
        )}
        {userData && userData.creator && (
          <div className={styles.creatorPrompt}>
            <h2>You are creator!</h2>{" "}
            <Link to={"edit"} style={{ color: "white" }}>
              Create new post
            </Link>
          </div>
        )}
      </div>
      <Posts />
    </>
  );
}

export default App;
