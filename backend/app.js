const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { PrismaClient } = require("./generated/prisma");
const prisma = new PrismaClient();
const cors = require("cors");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
const app = express();

app.get("/", async (req, res) => {
  res.json({ message: "Hi" });
});

app.listen(process.env.port || 3000, (req, res) => {
  console.log("server is running");
});
