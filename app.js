const express = require("express");
<<<<<<< HEAD
const connection = require("./db/connection");
const gamesRouter = require("./routers/gamesRouter");
const checkoutRouter = require("./routers/checkoutRouter");
const ordersRouter = require('./routers/ordersRouter');

=======
const cors = require("cors");
>>>>>>> main
const app = express();
const port = 3000;

// middlewares
app.use(cors());

app.use(express.json());

// routers
const gamesRouter = require("./routers/gamesRouter");

app.use("/", gamesRouter);

app.use("/", checkoutRouter);

app.get("/", (req, res) => {
  res.send("Server attivo");
});

app.get("/test-db", (req, res) => {
  connection.query("SHOW TABLES", (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Errore DB",
        details: err.message,
      });
    }

    res.json({
      message: "Connessione OK",
      tables: results,
    });
  });
});

app.use('/orders', ordersRouter);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
