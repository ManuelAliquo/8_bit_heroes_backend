const connection = require("../db/connection");

function getFinalPrice(product) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = product.discount_start_date ? new Date(product.discount_start_date) : null;
  const end = product.discount_end_date ? new Date(product.discount_end_date) : null;
  if (start) start.setHours(0, 0, 0, 0);
  if (end) end.setHours(0, 0, 0, 0);

  if (product.discount_percentage && start && end && today >= start && today <= end) {
    return (product.price - (product.price * product.discount_percentage) / 100).toFixed(2);
  }
  return product.price;
}

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
      WHERE pt.product_id = ? AND t.type != 'platform' AND t.type != 'other'`;

    connection.query(tagsSql, [product.id], (err, tagResults) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json({
          success: false,
          result: "Errore nel recupero dei tag",
        });
      }

      product.tags = tagResults;

      product.final_price = getFinalPrice(product);

      const tagIds = product.tags.map((tag) => tag.id);

      if (tagIds.length < 1) {
        product.relatedProducts = [];
        return res.json(product);
      }

      const placeholders = tagIds.map(() => "?").join(",");

      const relatedSql = `
        SELECT 
          p.id, p.name, p.slug, p.price, p.cover_image,
          d.percentage AS discount_percentage,
          d.start_date AS discount_start_date,
          d.end_date AS discount_end_date,
          COUNT(pt.tag_id) AS common_tags
        FROM products p
        JOIN product_tags pt ON p.id = pt.product_id
        LEFT JOIN discounts d ON p.discount_id = d.id
        WHERE pt.tag_id IN (${placeholders}) AND p.id != ?
        GROUP BY p.id, d.id
        HAVING common_tags >= 1
        ORDER BY common_tags DESC, p.price ASC
        LIMIT 4`;

      connection.query(relatedSql, [...tagIds, product.id], (err, relatedResults) => {
        if (err) {
          console.log(err.message);
          product.relatedProducts = [];
          return res.json(product);
        }

        product.relatedProducts = relatedResults.map((related) => ({
          id: related.id,
          name: related.name,
          slug: related.slug,
          price: related.price,
          percentage: related.discount_percentage,
          final_price: getFinalPrice(related),
          cover_image: related.cover_image,
          common_tags: related.common_tags,
        }));

        res.json(product);
      });
    });
  });
}

module.exports = { show };
