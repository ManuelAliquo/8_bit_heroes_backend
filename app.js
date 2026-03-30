const express = require("express");
const app = express();

const gamesRouter = require("./routers/gamesRouter");

app.listen("http://localhost:3000", () => console.log(`Server listening on http://localhost:3000`));
