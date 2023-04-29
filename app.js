const express = require("express");
const app = express();
const itemsRoutes = require("./routes/items");
const ExpressError = require("./expressError");

app.use(express.json());
app.use("/store", itemsRoutes);

app.use((req, res, next) => {
  const notFoundError = new ExpressError("Not Found", 404);
  return next(notFoundError);
});

app.use((err, req, res, next) => {
  let status = err.status || 500;
  let msg = err.message;

  return res.status(status).json({
    error: { msg, status },
  });
});

module.exports = app;
