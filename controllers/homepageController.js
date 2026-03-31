const connection = require("../db/connection");

//? INDEX (3 DISCOUNTED PRODUCTS)
const index = (req, res) => {
  const sql = `
    SELECT 
	    products.id,
        products.cover_image,
        products.name,
        products.slug,
        products.price,
        products.discount_id,
        discounts.percentage,
        discounts.start_date,
        discounts.end_date
    FROM products
    LEFT JOIN discounts
    ON discount_id = discounts.id
    WHERE discount_id IS NOT NULL
    ORDER BY RAND()
    LIMIT 3
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
