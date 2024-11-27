import express from "express";
import { addSchool, listSchools } from "../controllers/school.controller.js";
import { createRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// rate limited to 30 requests per minute
const rateLimiter = createRateLimiter(60 * 1000, 30);

router.use(rateLimiter);
router.post("/addSchool", addSchool);
router.get("/listSchools", listSchools);

export default router;
