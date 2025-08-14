const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const prisma = require("./prisma");
const cors = require("cors");
const passport = require("./passport");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

const optionalAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) return next(err);
    if (user) req.user = user;
    next();
  })(req, res, next);
};

app.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    res.json(req.user);
  }
);
app.get("/", (req, res) => {
  res.json({ message: "Welcome!" });
});

app.post("/sign-up", async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { username: req.body.username },
  });
  if (user) {
    return res.status(403).json({ message: "Username is taken!" });
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const created = await prisma.user.create({
    data: {
      username: req.body.username,
      password: hashedPassword,
    },
  });
  res.status(201).json({ message: "Signed in succesfully" });
});

app.post("/test", (req, res) => {
  console.log(req.body);
  res.json({ message: req.body });
});
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.send(400).json({ message: "Username or password is missing" });
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.creator,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    return res.status(200).json({ message: "Succesfully logged in" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
});
// BLOG POSTS MANAGMENT

app.get("/posts", optionalAuth, async (req, res) => {
  console.log(req.user);
  const currentUserId = req.user?.id || null;
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            username: true,
            id: true,
          },
        },
        _count: { select: { likes: true } },
        ...(currentUserId && {
          likes: { where: { userId: currentUserId } },
        }),

        comments: {
          select: {
            user: true,
            userId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    console.log(posts);
    res.status(200).json({ posts });
  } catch (err) {
    console.log(err);
    res.send(500).json({ message: "Internal server error" });
  }
});

app.get("/posts/:id", async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
      include: {
        likes: {
          select: {
            id: true,
            userId: true,
          },
        },
        comments: {
          select: {
            id: true,
            text: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put(
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const postId = req.params.id;
    const { id, username, creator } = req.user;
    if (!creator)
      return res.status(403).json({ message: "FUCKING FORBIDDEN!" });
    try {
      const post = await prisma.post.update({
        where: { id: postId },
        data: { title: req.body.title, text: req.body.value },
      });
      console.log(post);
      res.status(200).json({ message: "OK" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

app.delete(
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const postId = req.params.id;
    const { id, username, creator } = req.user;
    if (!creator)
      return res.status(500).json({ message: "You are not an admin" });
    console.log(postId);
    console.log(creator);
    try {
      const post = await prisma.post.delete({
        where: { id: postId },
      });
      console.log(post);
      return res.status(200).json({ message: "Ok" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error" });
    }
  }
);

app.post(
  "/post",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (!req.user || !req.user.creator)
      return res.status(403).json({ message: "Forbidden" });
    console.log(req.user);
    console.log(req.body);
    const newPost = await prisma.post.create({
      data: {
        title: req.body.title,
        text: req.body.value,
        userId: req.user.id,
      },
    });
    console.log(newPost);
    res.send(200);
  }
);

app.post(
  "/posts/:id/like",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.id;

    const existingLike = await prisma.like.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    if (existingLike) {
      const like = await prisma.like.delete({
        where: { postId_userId: { postId, userId } },
      });
      console.log(like);
      return res.json({ liked: false });
    }
    const like = await prisma.like.create({
      data: { postId, userId },
    });
    console.log(like);
    return res.json({ liked: true });
  }
);

app.post(
  "/posts/:id/comment",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    try {
      const comment = await prisma.comment.create({
        data: { postId, userId, text: req.body.comment },
      });
      console.log(comment);
      res.status(200).json({ comment });
    } catch (err) {
      console.log(err);
      res.status(500);
    }
  }
);

app.delete(
  "/posts/:id/comment/:commentId/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const postId = req.params.id;
    const commentId = req.params.commentId;
    const userId = req.user.id;
    try {
      const comment = await prisma.comment.findUnique({
        where: { id: commentId, userId },
      });
      if (!comment) return res.status(404);
      const deleted = await prisma.comment.delete({
        where: { id: commentId, userId },
      });
      if (!deleted) return res.status(404);
      console.log(deleted);

      return res.send(204).json({ message: "Deleted" });
    } catch (err) {
      console.log(err);
      res.status(500);
    }
  }
);

module.exports = prisma;

app.listen(process.env.port || 3000, (req, res) => {
  console.log("server is running");
});
