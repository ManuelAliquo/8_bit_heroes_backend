const connection = require("../db/connection");

//? INDEX
const index = (req, res) => {
  const sql = `
  SELECT * FROM 8_bit_heroes.products;
  `;

  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: "Database query failed",
        status: false,
      });
    }

    const responseData = {
      result: results,
      messsage: "Products List:",
      status: true,
    };

    res.json(responseData);
  });
};

//? STORE
const store = (req, res) => {
  res.send("STORE");
};

module.exports = { index, store };
