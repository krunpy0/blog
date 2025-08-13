import { useEffect, useState } from "react";
import "./App.css";
import { Link } from "react-router-dom";
function App() {
  const [userData, setUserData] = useState(null);
  async function fetchData() {
    try {
      const res = await fetch("http://localhost:3000/me", {
        credentials: "include",
      });
      if (!res.ok) {
        return setUserData(false);
      }
      const result = await res.json();
      console.log(result);
      setUserData(result);
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  if (userData == null) return <>Loading...</>;

  return (
    <>
      <div>
        {userData ? (
          <h1>Hello, {userData.username}</h1>
        ) : (
          <h1>
            Seems that you don't have an account. You need to{" "}
            <Link to={"/login"}>log in</Link> to see the posts.
          </h1>
        )}
        {userData && userData.creator && (
          <>
            <h2>You are creator!</h2> <Link to={"edit"}>Edit</Link>
          </>
        )}
        <a href="http://localhost:3000/logout">Log out</a>
      </div>
    </>
  );
}

export default App;
