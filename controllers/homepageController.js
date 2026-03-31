const connection = require("../db/connection");
const trasporter = require("../mailer/transporter");

//? INDEX (3 DISCOUNTED PRODUCTS)
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
      messsage: "Discounted Products List:",
      status: true,
    };

    res.json(responseData);
  });
};

//? INDEX (3 TOP SALES PRODUCTS)
const salesIndex = (req, res) => {
  const sql = `
    SELECT
	    products.id,
        products.cover_image,
        products.name,
        products.slug,
        products.price,
        products.sold_copies
    FROM products
    WHERE sold_copies IS NOT NULL
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
      messsage: "Sales Products List:",
      status: true,
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
      console.log(err);
      return res.status(500).json({
        message: "Database query failed",
        status: false,
      });
    }
    if (result.length > 0) {
      const responseData = {
        message: "Email Already Registered!",
        status: false,
      };
      return res.status(409).json(responseData);
    }

    const insertSql = `
        INSERT INTO newsletter (email)
        VALUES (?)
        `;

    connection.query(insertSql, [email], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Database query failed",
          status: false,
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
        message: "Email Added Successfully!",
        status: true,
      };
      res.status(200).json(responseData);
    });
  });
};

module.exports = { discountedIndex, salesIndex, newsletterStore };
