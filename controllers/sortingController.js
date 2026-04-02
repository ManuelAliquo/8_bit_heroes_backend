const connection = require("../db/connection");

// INDEX
function unsortedIndex(req, res) {
  const indexSQL = `SELECT * FROM products;`;

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

// SORTED
function sortedIndex(req, res) {
  const order = req.query.order === "desc" ? "DESC" : "ASC";
  const field = req.query.field;

  const allowedFields = ["price", "name", "created_at"];
  if (!field || !allowedFields.includes(field))
    return res.status(400).json({
      success: false,
      result: "Invalid or missing field",
    });

  const sortSQL = `
  SELECT * FROM products
  ORDER BY ${field} ${order};
  `;

  connection.query(sortSQL, (err, result) => {
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

module.exports = { unsortedIndex, sortedIndex };
