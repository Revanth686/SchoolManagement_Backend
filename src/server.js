import express from "express";
import cors from "cors";
import helmet from "helmet";
import debug from "debug";
import dotenv from "dotenv";
import {
  healthController,
  initSchoolService,
} from "./controllers/school.controller.js";

import mainRouter from "./routes/school.route.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { initDatabase } from "./config/db.js";

dotenv.config();

const app = express();
const log = debug("app:server");

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, _, next) => {
  const timestamp = new Date().toISOString();
  log(`[API LOG]`, {
    method: req.method,
    endpoint: req.originalUrl,
    ip: req.headers.origin,
    timestamp,
  });
  next();
});

app.use("/api", mainRouter);
app.use("/health", healthController);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

(async () => {
  await initDatabase();
  await new Promise((r) => setTimeout(r, 500));
  initSchoolService();

  app.listen(PORT, () => {
    log(`Server running on port ${PORT}`);
  });
})();
