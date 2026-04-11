const express = require("express");
const gamesRouter = require("./routers/gamesRouter");
const validEndpoint = require('./middlewares/validEndpoint');
const errorsHandler = require('./middlewares/errorsHandler');
const cors = require("cors");
const app = express();
const port = 3000;

// middlewares
app.use(cors());
app.use(express.static("public"))
app.use(express.json());

app.use("/", gamesRouter);

app.use(validEndpoint);
app.use(errorsHandler);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
