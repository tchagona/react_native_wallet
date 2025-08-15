import express from "express";
import dotenv from "dotenv";
import { initDB, sql } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
dotenv.config();

const app = express();

//middleware
app.use(express.json());
app.use(rateLimiter);
const RUNNING_PORT = process.env.SERVER_PORT || 5001;

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/transactions", transactionsRoute);

initDB().then(() => {
  app.listen(RUNNING_PORT, () => {
    console.log("listening at port", RUNNING_PORT);
  });
});
