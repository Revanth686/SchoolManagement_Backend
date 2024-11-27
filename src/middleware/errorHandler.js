import debug from "debug";

const log = debug("app:error");

export const errorHandler = (err, _, res, _2) => {
  log(err.stack);

  res.status(500).json({
    success: false,
    error: err.message || "Internal server error",
  });
};
