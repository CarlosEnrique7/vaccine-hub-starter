const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { PORT } = require("./config");

const { NotFoundError } = require("./utils/errors");

const app = express();

// enable cross-origin resource sharing for all origins
app.use(cors());
// parse incoming request bodies with JSON payloads
app.use(express.json());
// log request info
app.use(morgan("tiny"));

// handle not found error if the endpoint doesn't match any of the endpoints in our app.
app.use((req, res, next) => {
  return next(new NotFoundError());
});

// generic error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on https://localhost:${PORT}`);
});
