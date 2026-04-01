const express = require("express");
const cors=require("cors");
const app = express();
const port = 3000;

// middlewares
app.use(cors());
app.use(express.json());

// routers
const gamesRouter = require("./routers/gamesRouter");

app.use("/", gamesRouter);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
