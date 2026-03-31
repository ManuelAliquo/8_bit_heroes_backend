// db connection
const connection = require("../db/connection");

// orderProductindex
function orderProductindex(req, res) {
  // temporaneo
  res.status(200).json({
    success: true,
    result: "checkout ok",
  });
}

module.exports = { orderProductindex };
