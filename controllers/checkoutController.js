// db connection
const connection = require("../db/connection");

// orderProductindex
function orderProductindex(req, res) {
  const orderProductsSQL = `SELECT * FROM products`; // temporaneo

  connection.query(orderProductsSQL, (err, result) => {
    if (err) return res.status(400);

    res.status(200).json({
      success: true,
      result: result,
    });
  });
}

module.exports = { orderProductindex };
