import express from "express";
import cors from "cors";
import helmet from "helmet";
import debug from "debug";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//logging middleware
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

// spec file
const swaggerDocument = YAML.load(path.join(__dirname, "openapi/spec.yaml"));
// api Documentation swagger page
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//routes
app.use("/api/v3/app", mainRouter);
app.use("/health", healthController);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

(async () => {
  await initDatabase();
  await new Promise((r) => setTimeout(r, 500)); //for minor bugs
  initSchoolService();

  app.listen(PORT, () => {
    log(`Server running on port ${PORT}`);
  });
})();
