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
      result: "products sent",
    });
  });
}

// update dati dell'ordine
function updateOrderData(req, res) {
  // temporaneo
  const orderUpdateSQL = `
  UPDATE orders
  SET
    name = "updated-name",
    surname = "updated-surname",
    email = "updated-email",
    shipping_address = "shipping_address",
    shipping_cap = "00000",
    shipping_city = "shipping_city",
    shipping_country = "shipping_country",
    billing_address = "billing_address",
    billing_cap = "00000",
    billing_city = "billing_city",
    billing_country = "billing_country",
    status = "pagato"
  WHERE id = 1;
  `;

  connection.query(orderUpdateSQL, (err, result) => {
    if (err) {
      console.log(err.message);
      return res.status(500).json({
        success: false,
        result: "query failed",
      });
    }

    res.status(200).json({
      success: true,
      result: "row updated",
    });
  });
}

module.exports = { orderProductindex, updateOrderData };
