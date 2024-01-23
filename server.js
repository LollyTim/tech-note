const express = require("express");
const app = express();
const PORT = process.env.PORT || 3500;
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const path = require("path");

app.use(express.json());
app.use(logger);

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json("404 not Found");
  } else {
    res.type("txt"), send("404 not found");
  }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
