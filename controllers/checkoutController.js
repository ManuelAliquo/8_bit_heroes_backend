// db connection
const connection = require("../db/connection");

// orderProductindex
function orderProductindex(req, res) {
  res.status(200).json({
    success: true,
    result: result,
  });
}

module.exports = { orderProductindex };
