import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./components/App/App.jsx";
import { SignUp } from "./components/SignUp/SignUp.jsx";
import { Login } from "./components/Login/Login.jsx";
import { EditTest } from "./components/Editor/NewPost/NewPost.jsx";
import { AuthProvider } from "./authContext.jsx";
import { ViewPost } from "./components/Posts/ViewPost.jsx";
import { PostsProvider } from "./Context.jsx";
import { EditPost } from "./components/Editor/EditPost/EditPost.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/edit",
    element: <EditTest />,
  },
  {
    path: "/edit/:id",
    element: <EditPost />,
  },
  {
    path: "/posts/:id",
    element: <ViewPost />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <PostsProvider>
        <RouterProvider router={router} />
      </PostsProvider>
    </AuthProvider>
  </StrictMode>
);
