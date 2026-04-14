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
    WHERE discount_id IS NOT NULL AND NOW() >= discounts.start_date AND NOW() <= discounts.end_date
    ORDER BY RAND()
    LIMIT 4;`;

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
      message: "Discounted Products List:",
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
    LIMIT 4;`;

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
    SELECT * FROM newsletter
    WHERE email = ?;`;

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
        subject: "Benvenuto nella Newsletter di 8 Bit Heroes! 🎮",
        html: `
            <div style="background-color: #1a1a1a; padding: 40px; font-family: 'Segoe UI', Arial, sans-serif; color: #ffffff; text-align: center;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #2d2d2d; border: 2px solid #ffcc00; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                    
                    <div style="background-color: #ffcc00; padding: 15px;">
                        <h1 style="color: #1a1a1a; margin: 0; font-size: 26px; letter-spacing: 2px; text-transform: uppercase; font-weight: 900;">8 BIT HEROES</h1>
                    </div>

                    <div style="padding: 40px 20px;">
                        
                        <div style="margin-bottom: 30px;">
                            <img src="cid:8bit_heroes_logo_email" alt="Logo 8 Bit Heroes" style="width: 280px; height: auto; filter: drop-shadow(0 5px 15px rgba(0,0,0,0.3));">
                        </div>
                        
                        <h2 style="color: #ffcc00; margin-bottom: 15px; font-size: 24px;">LEVEL UP!</h2>
                        <p style="font-size: 18px; line-height: 1.6; color: #eeeeee; margin-bottom: 25px;">
                            Grazie per esserti unito alla nostra community.<br>
                            Da oggi sei ufficialmente un <strong>Hero</strong> del nostro mondo!
                        </p>
                        
                        <a href="http://localhost:5173/" style="display: inline-block; padding: 15px 35px; background-color: #ffcc00; color: #1a1a1a; text-decoration: none; font-weight: bold; border-radius: 6px; font-size: 16px; text-transform: uppercase;">Esplora il Catalogo</a>
                    </div>

                    <div style="padding: 20px; background-color: #1f1f1f; border-top: 1px solid #3d3d3d; font-size: 12px; color: #888888;">
                        <p style="margin: 5px 0;">Ricevi questa email perché ti sei iscritto alla newsletter di 8 Bit Heroes.</p>
                        <p style="margin: 5px 0;">Questa è una email automatica, ti chiediamo di non rispondere.</p>
                        <p style="margin: 5px 0;">&copy; 2026 BitBros_Dev Team. Tutti i diritti riservati.</p>
                    </div>
                </div>
            </div>
            `,
        attachments: [
          {
            filename: "8bit_heroes_logo.png",
            path: "./public/8bit_heroes_logo.png",
            cid: "8bit_heroes_logo_email",
          },
        ],
      };

      trasporter
        .sendMail(mailOptions)
        .then((info) => console.log("MAIL NEWSLETTER INVIATA:", email, info.response))
        .catch((err) => console.log("ERRORE MAIL NEWSLETTER:", err));

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
