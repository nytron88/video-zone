import cluster from "cluster";
import os from "os";
import connectDB from "./db/db.js";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8000;

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`Primary process ${process.pid} is running`);
  console.log(`Forking ${numCPUs} workers...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} exited. Forking a new worker...`);
    cluster.fork();
  });
} else {
  connectDB()
    .then(() => {
      app.on("error", (error) => {
        console.error(error);
      });

      app.listen(PORT, () => {
        console.log(`Worker ${process.pid} is listening on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("MongoDB connection failed: ", error);
    });
}
