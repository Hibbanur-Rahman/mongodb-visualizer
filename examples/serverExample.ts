import express from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { modelAnalyzer } from "mongodb-models-visualizer";

dotenv.config();
const app = express();

const { PORT, MONGO_URL } = process.env;

if (!MONGO_URL) {
  console.error("MONGO_URL environment variable is not defined");
  process.exit(1);
}

const dbConnection = (url: string) => {
    mongoose.connect(url);

    const db = mongoose.connection;

    db.on("error", (error) => {
        console.error("MongoDb connection error:", error);
    });
    db.once("open", () => {
        console.log("MongoDB connected successfully");
    })
}

dbConnection(MONGO_URL);



app.use(
  "/visualizer",
  modelAnalyzer({
    mongoose,
  }),
);

const port = PORT || 5000;

app.listen(port, () => {
  console.log(`app is running on http://localhost:${port} `);
  console.log(`model visualizer is running on http://localhost:${port}/visualizer `);
});
