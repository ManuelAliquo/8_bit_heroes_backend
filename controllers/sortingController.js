const connection = require("../db/connection");

// INDEX
function index(req, res) {
  const order = req.query.order === "desc" ? "DESC" : "ASC";
  const field = req.query.field;
  const onlyDiscounted = req.query.onlyDiscounted;

  const baseSQL =
    onlyDiscounted === "true"
      ? `SELECT products.*, discounts.percentage, discounts.start_date, discounts.end_date
   FROM products
   LEFT JOIN discounts ON products.discount_id = discounts.id
   WHERE discount_id IS NOT NULL
   AND NOW() BETWEEN discounts.start_date AND discounts.end_date
   GROUP BY products.id`
      : `
   SELECT products.*, discounts.percentage, discounts.start_date, discounts.end_date
   FROM products
   LEFT JOIN discounts ON products.discount_id = discounts.id`;

  const allowedFields = ["price", "name", "created_at", "default"];
  if (field && !allowedFields.includes(field))
    return res.status(400).json({
      success: false,
      result: "Invalid or missing field",
    });

  let indexSQL = baseSQL;
  if (field === "default") {
    indexSQL;
  } else if (field === "price") {
    indexSQL += ` ORDER BY 
    CASE
    WHEN discounts.percentage IS NOT NULL AND discounts.percentage > 0
        THEN products.price - (products.price * discounts.percentage / 100)
        ELSE products.price
      END ${order}`;
  } else if (field === "name") {
    indexSQL += ` ORDER BY products.name ${order}`;
  } else if (field === "created_at") {
    indexSQL += ` ORDER BY products.created_at ${order}`;
  }

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

// SEARCH QUERY PARAMS
function searchQueryParam(req, res) {
  const searchWord = req.query.search;
  const formattedSearchWord = `%${searchWord}%`;
  const onlyDiscounted = req.query.onlyDiscounted;
  const order = req.query.order === "desc" ? "DESC" : "ASC";
  const field = req.query.field;

  const allowedFields = ["price", "name", "created_at", "default"];
  if (field && !allowedFields.includes(field))
    return res.status(400).json({
      success: false,
      result: "Invalid or missing field",
    });

  const baseSQL =
    onlyDiscounted === "true"
      ? `
  SELECT 
    products.id,
	  cover_image,
    name,
    slug,
    description,
    price,
    discounts.percentage,
    discounts.start_date,
    discounts.end_date
  FROM products

  LEFT JOIN discounts
  ON discount_id = discounts.id

  INNER JOIN product_tags
  ON products.id = product_tags.product_id

  INNER JOIN tags
  ON product_tags.tag_id = tags.id

  WHERE name LIKE ? OR tags.tag_name LIKE ?
  AND discount_id IS NOT NULL
  AND NOW() BETWEEN discounts.start_date AND discounts.end_date
  GROUP BY products.id
  `
      : `
  SELECT 
    products.id,
	  cover_image,
    name,
    slug,
    description,
    price,
    discounts.percentage,
    discounts.start_date,
    discounts.end_date
  FROM products

  LEFT JOIN discounts
  ON discount_id = discounts.id

  INNER JOIN product_tags
  ON products.id = product_tags.product_id

  INNER JOIN tags
  ON product_tags.tag_id = tags.id

  WHERE name LIKE ? OR tags.tag_name LIKE ?

  GROUP BY products.id
  `;

  let indexSQL = baseSQL;

  if (field === "price") {
    indexSQL += ` ORDER BY 
    CASE
    WHEN discounts.percentage IS NOT NULL AND discounts.percentage > 0
        THEN products.price - (products.price * discounts.percentage / 100)
        ELSE products.price
      END ${order}`;
  } else if (field === "name") {
    indexSQL += ` ORDER BY products.name ${order}`;
  } else if (field === "created_at") {
    indexSQL += ` ORDER BY products.created_at ${order}`;
  }

  connection.query(
    indexSQL,
    [formattedSearchWord, formattedSearchWord],
    (err, result) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json({
          success: false,
          result: "query failed",
        });
      }

      const resultData = {
        result: result,
        message: `Risultati di ricerca con parola: ${searchWord}`,
        success: true,
      };
      res.json(resultData);
    },
  );
}

module.exports = { index, searchQueryParam };
