const connection = require("../db/connection");

// INDEX
function index(req, res) {
  const order = req.query.order === "desc" ? "DESC" : "ASC";
  const field = req.query.field;
  
  const baseSQL = `SELECT products.*, discounts.percentage, discounts.start_date, discounts.end_date
   FROM products
   LEFT JOIN discounts ON products.discount_id = discounts.id`;

  const allowedFields = ["price", "name", "created_at"];
  if (field && !allowedFields.includes(field))
    return res.status(400).json({
      success: false,
      result: "Invalid or missing field",
    });

    let indexSQL = baseSQL;



   if(field){indexSQL += ` ORDER BY ${field} ${order}`}

  connection.query(indexSQL, (err, result) => {
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

module.exports = { index };
