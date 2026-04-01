const connection = require("../db/connection");

function show(req, res) {
  const { slug } = req.params;

  const productSql = `SELECT 
      p.*,
      d.percentage AS discount_percentage,
      d.start_date AS discount_start_date,
      d.end_date AS discount_end_date
    FROM products p
    LEFT JOIN discounts d ON p.discount_id = d.id
    WHERE p.slug = ?`;

  connection.query(productSql, [slug], (err, results) => {
    if (err) {
      console.log(err.message);
      return res.status(500).json({
        success: false,
        result: "Errore del Server",
      });
    }

    if (results.length === 0)
      return res.status(404).json({
        success: false,
        result: "Prodotto non trovato",
      });

    const product = results[0];

    const tagsSql = `SELECT t.id, t.tag_name
      FROM tags t
      JOIN product_tags pt ON t.id = pt.tag_id
      WHERE pt.product_id = ?`;

    connection.query(tagsSql, [product.id], (err, tagResults) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json({
          success: false,
          result: "Errore nel recupero del tag",
        });
      }

      product.tags = tagResults;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const start = product.discount_start_date ? new Date(product.discount_start_date) : null;
      if (start) start.setHours(0, 0, 0, 0);

      const end = product.discount_end_date ? new Date(product.discount_end_date) : null;
      if (end) end.setHours(0, 0, 0, 0);

      if (product.discount_percentage && start && end && today >= start && today <= end)
        product.final_price = (
          product.price -
          (product.price * product.discount_percentage) / 100
        ).toFixed(2);
      else product.final_price = product.price;

      res.json(product);
    });
  });
}

module.exports = { show };
