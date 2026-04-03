const connection = require("../db/connection");
const trasporter = require("../mailer/transporter");

//? INDEX (4 DISCOUNTED PRODUCTS)
const discountedIndex = (req, res) => {
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
    LIMIT 4
  `;

  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err.message);
      return res.status(500).json({
        success: false,
        result: "Database query failed",
      });
    }

    const responseData = {
      success: true,
      result: results,
      messsage: "Discounted Products List:",
    };

    res.json(responseData);
  });
};

//? INDEX (4 TOP SALES PRODUCTS)
const salesIndex = (req, res) => {
  const sql = `
    SELECT
	    products.id,
        products.cover_image,
        products.name,
        products.slug,
        products.price,
        products.sold_copies,
        discounts.percentage,
        discounts.start_date,
        discounts.end_date
    FROM products
    LEFT JOIN discounts
    ON products.discount_id = discounts.id
    WHERE sold_copies IS NOT NULL
    ORDER BY RAND()
    LIMIT 4
  `;

  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err.message);
      return res.status(500).json({
        success: false,
        result: "Database query failed",
      });
    }

    const responseData = {
      success: true,
      result: results,
      messsage: "Sales Products List:",
    };

    res.json(responseData);
  });
};

//? STORE (NEWSLETTERS)
const newsletterStore = (req, res) => {
  const { email } = req.body;

  const checkSql = `
    SELECT * 
    FROM newsletter
    WHERE email = ?
  `;

  connection.query(checkSql, [email], (err, result) => {
    if (err) {
      console.log(err.message);
      return res.status(500).json({
        success: false,
        result: "Database query failed",
      });
    }
    if (result.length > 0) {
      const responseData = {
        success: false,
        result: "Email Already Registered!",
      };
      return res.status(409).json(responseData);
    }

    const insertSql = `
        INSERT INTO newsletter (email)
        VALUES (?)
        `;

    connection.query(insertSql, [email], (err, result) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json({
          success: false,
          result: "Database query failed",
        });
      }

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Benvenuto nella Newsletter",
        text: "Benvenuto nella Newsletter di 8 Bit Heroes",
      };

      trasporter
        .sendMail(mailOptions)
        .then((info) => console.log("MAIL INVIATA:", email, info.response))
        .catch((err) => console.log("ERRORE:", err));

      console.log(result.insertId);

      const responseData = {
        success: true,
        result: "Email Added Successfully!",
      };
      res.status(200).json(responseData);
    });
  });
};

module.exports = { discountedIndex, salesIndex, newsletterStore };
