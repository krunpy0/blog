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

app.get("/posts", (req, res) => {});

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

module.exports = prisma;

app.listen(process.env.port || 3000, (req, res) => {
  console.log("server is running");
});
