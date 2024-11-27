import rateLimit from "express-rate-limit";

export const createRateLimiter = (windowMs = 60 * 1000, max = 30) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: "Please try again after 60 seconds",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

