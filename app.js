import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.js";
import chatRouter from "./routes/chat.js";

dotenv.config();
connectDB(process.env.MONGODB_URI);
const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(cookieParser());

app.get("/", (req, res) => {
  return res.send("Health Check: OK");
});

app.use("/users", userRouter);
app.use("/chat", chatRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
