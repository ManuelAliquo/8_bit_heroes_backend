// db connection
const connection = require("../db/connection");

// prodotti dell'ordine
function orderProductindex(req, res) {
  const orderProductsSQL = `SELECT * FROM products`;

  connection.query(orderProductsSQL, (err, result) => {
    if (err) {
      console.log(err.message);
      return res.status(500).json({
        success: false,
        result: "query failed",
      });
    }

    res.status(200).json({
      success: true,
      result: result,
    });
  });
}

module.exports = { orderProductindex };
