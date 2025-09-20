import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://library_management_System:dminmecndYjPHNj7@cluster0.jao09dz.mongodb.net/Tour_management_System?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("connected to BD!!");

    server = app.listen(5000, () => {
      console.log("Server is listening to port 5000");
    });
  } catch (error) {
    console.log(error);
  }
};
startServer();

process.on("SIGTERM", () => {
  console.log("Sigterm server signal..... Server shutting down...");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log("unhandled Rejection detected..... Server shutting down...", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

//Un handled Rejection Error

// Promise.reject(new Error("I forgot ot catch this promise"));

process.on("uncaughtException", (err) => {
  console.log("uncaught Exception detected..... Server shutting down...", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

//un caught exception Error
// throw new Error("I forgot to handle this local error");
