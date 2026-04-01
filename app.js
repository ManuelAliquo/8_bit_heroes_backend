const express = require("express");
const app = express();
const port = 3000;

// routers
const gamesRouter = require("./routers/gamesRouter");

// middlewares
app.use(express.json());

app.use("/", gamesRouter);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
