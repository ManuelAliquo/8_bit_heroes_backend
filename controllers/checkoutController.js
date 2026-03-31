// db connection
const connection = require("../db/connection");

// prodotti dell'ordine
function orderProductindex(req, res) {
  // temporaneo
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

// update dati dell'ordine
function updateOrderData(req, res) {
  // temporaneo
  const {
    name,
    surname,
    email,
    shipping_address,
    shipping_cap,
    shipping_city,
    shipping_country,
    billing_address,
    billing_cap,
    billing_city,
    billing_country,
  } = req.body;

  const orderUpdateSQL = `
  UPDATE orders
  SET
    name = ?,
    surname = ?,
    email = ?,
    shipping_address = ?,
    shipping_cap = ?,
    shipping_city = ?,
    shipping_country = ?,
    billing_address = ?,
    billing_cap = ?,
    billing_city = ?,
    billing_country = ?,
    status = "pagato"
  WHERE id = 1;
  `;

  connection.query(
    orderUpdateSQL,
    [
      name,
      surname,
      email,
      shipping_address,
      shipping_cap,
      shipping_city,
      shipping_country,
      billing_address,
      billing_cap,
      billing_city,
      billing_country,
    ],
    (err, result) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json({
          success: false,
          result: "query failed",
        });
      }

      res.status(200).json({
        success: true,
        result: "order updated",
      });
    },
  );
}

module.exports = { orderProductindex, updateOrderData };
