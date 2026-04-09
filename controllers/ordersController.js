const connection = require("../db/connection");
const trasporter = require("../mailer/transporter");
const crypto = require("crypto");

function index(req, res) {
  const sql = `SELECT * FROM orders`;
  connection.query(sql, (err, results) => {
    res.status(200).json({
      success: true,
      result: results,
    });
  });
}

function show(req, res) {
  const { id } = req.params;
  const orderId = parseInt(id);
  const sql = `
    SELECT * 
    FROM orders 
    WHERE id = ?`;

  connection.query(sql, [orderId], (err, results) => {
    if (err) return errors(err, res);

    const orderedProductsSql = `SELECT * FROM products_orders 
        INNER JOIN products 
        ON products_orders.product_id = products.id
        WHERE order_id = ?`;

    connection.query(orderedProductsSql, [orderId], (err, orderedProducts) => {
      if (err) return errors(err);
      res.status(200).json({
        success: true,
        order: results,
        productsOrdered: orderedProducts,
      });
    });
  });
}

function store(req, res) {
  // dati che vengono recuperati dal body della richiesta
  const {
    name,
    surname,
    email,
    shipping_address,
    shipping_cap,
    shipping_city,
    shipping_country,
    billing_address,
    billing_cap,
    billing_city,
    billing_country,
    orderedProducts, //é un array di oggetti che contiene tutti i prodotti che erano nel carrello
  } = req.body;

  let total_price = 0;

  orderedProducts.map(
    (prod) =>
      (total_price = total_price + prod.final_price * parseInt(prod.quantity)),
  );

  // variabile per salvare l'id dell'ordine creato. servirà dopo per associare i prodotti nel carrello all'ordine.
  let orderId;

  const sql = `
    INSERT INTO orders (
    name,
    surname,
    email,
    shipping_address,
    shipping_cap,
    shipping_city,
    shipping_country,
    billing_address,
    billing_cap,
    billing_city,
    billing_country,
    status, 
    total_price)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;

  connection.query(
    sql,
    [
      name,
      surname,
      email,
      shipping_address,
      shipping_cap,
      shipping_city,
      shipping_country,
      billing_address,
      billing_cap,
      billing_city,
      billing_country,
      "Pagato",
      Number(total_price.toFixed(2)),
    ],
    (err, results) => {
      if (err) return errors(err, res);
      // ritorno l'id dell'ordine creato salvandolo direttamente nella variabile orderId appositamente creata.
      orderId = results.insertId;

      const enrichedProducts = [];
      // mappo gli orderedproducts così da salvarli nella apposita sezione del database
      const queries = orderedProducts.map((p) => {
        const code = p.copyInDigital ? digitalCopyCodeGenerator() : "";
        enrichedProducts.push({ ...p, digital_code: code });
        return new Promise((resolve, reject) => {
          const orderedGames = `
      INSERT INTO products_orders (order_id, product_id, quantity, product_price, digital_copy_code) 
      VALUES (?,?,?,?,?)`;

          connection.query(
            orderedGames,
            [
              orderId,
              p.id,
              p.quantity,
              p.price,
              code,
            ],
            (err, result) => {
              if (err) return reject(err);
              resolve(result);
            },
          );
        });
      });

      Promise.all(queries)
        .then(() => {
          const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: `Ordine confermato #${orderId} 🎮`,
            html: `
            <div style="background-color: #1a1a1a; padding: 40px; font-family: 'Segoe UI', Arial, sans-serif; color: #ffffff; text-align: center;">

              <div style="max-width: 600px; margin: 0 auto; background-color: #2d2d2d; border: 2px solid #ffcc00; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">

                <!-- HEADER -->
                <div style="background-color: #ffcc00; padding: 15px;">
                  <h1 style="color: #1a1a1a; margin: 0; font-size: 26px; letter-spacing: 2px; text-transform: uppercase; font-weight: 900;">
                    8 BIT HEROES
                  </h1>
                </div>

                <!-- CONTENT -->
                <div style="padding: 30px 20px;">

                  <img src="cid:8bit_heroes_logo_email" style="width: 200px; margin-bottom: 20px;" />

                  <h2 style="color: #ffcc00;">Ordine Confermato ✅</h2>

                  <p style="font-size: 16px; color: #eeeeee;">
                    Grazie <strong>${name}</strong>!<br>
                    Il tuo ordine è stato ricevuto correttamente.
                  </p>

                  <p style="margin-top: 10px; font-size: 14px; color: #bbbbbb;">
                    Codice ordine: <strong>#${orderId}</strong>
                  </p>

                  <!-- LISTA PRODOTTI -->
                  <div style="margin-top: 25px; text-align: left;">
                    <h3 style="color: #ffcc00;">Riepilogo ordine</h3>

                    ${enrichedProducts
                .map(
                  (prod) => `
                      <div style="border-bottom: 1px solid #444; padding: 10px 0;">
                        <p style="margin: 0; font-weight: bold;">
                          ${prod.name}
                        </p>
                      
                        <p style="margin: 5px 0; font-size: 14px; color: #ccc;">
                          Quantità: ${prod.quantity}
                        </p>
                      
                        <p style="margin: 0; font-size: 14px; color: #ccc;">
                          Prezzo: € ${prod.final_price}
                        </p>
                      
                        ${prod.digital_code
                      ? `<p style="margin-top:5px; font-size: 13px; color:#00ffcc;">
                                 🎮 Codice digitale: <strong>${prod.digital_code}</strong>
                               </p>`
                      : ""
                    }
                      </div>
                    `,
                )
                .join("")}
                    
                  </div>
                    
                  <!-- TOTALE -->
                  <div style="margin-top: 20px; padding: 15px; background-color: #1f1f1f; border-radius: 8px;">
                    <h3 style="margin: 0; color: #ffcc00;">
                      Totale: € ${total_price.toFixed(2)}
                    </h3>
                  </div>
                    
                  <!-- SPEDIZIONE -->
                  <div style="margin-top: 20px; padding: 15px; background-color: #1f1f1f; border-radius: 8px; text-align:left;">
                    <h4 style="margin-bottom: 8px; color:#ffcc00;">📦 Spedizione</h4>
                    <p style="margin:0; font-size:14px; color:#ccc;">
                      ${shipping_address}<br>
                      ${shipping_cap}, ${shipping_city}<br>
                      ${shipping_country}
                    </p>
                  </div>
                    
                  <!-- FATTURAZIONE -->
                  <div style="margin-top: 10px; padding: 15px; background-color: #1f1f1f; border-radius: 8px; text-align:left;">
                    <h4 style="margin-bottom: 8px; color:#ffcc00;">🧾 Fatturazione</h4>
                    <p style="margin:0; font-size:14px; color:#ccc;">
                      ${billing_address}<br>
                      ${billing_cap}, ${billing_city}<br>
                      ${billing_country}
                    </p>
                  </div>
                    
                  
                  <div style="margin-top: 25px;">
                    <a href="http://localhost:5173/" 
                       style="display: inline-block; padding: 12px 30px; background-color: #ffcc00; color: #1a1a1a; text-decoration: none; font-weight: bold; border-radius: 6px;">
                      Torna allo Shop
                    </a>
                  </div>
                    
                </div>
                    
                <!-- FOOTER -->
                <div style="padding: 20px; background-color: #1f1f1f; border-top: 1px solid #3d3d3d; font-size: 12px; color: #888;">
                  <p>Hai ricevuto questa email perché hai effettuato un ordine su 8 Bit Heroes.</p>
                  <p>Questa è una email automatica, ti chiediamo di non rispondere.</p>
                  <p>© 2026 8 Bit Heroes</p>
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

          const vendorMailOptions = {
            from: process.env.SMTP_USER,
            to: process.env.SMTP_USER,
            subject: `🛒 Nuovo ordine #${orderId} - € ${total_price.toFixed(2)}`,
            html: `
            <div style="background-color: #1a1a1a; padding: 40px; font-family: 'Segoe UI', Arial, sans-serif; color: #ffffff;">
                    
              <div style="max-width: 600px; margin: 0 auto; background-color: #2d2d2d; border: 2px solid #ffcc00; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                    
                <!-- HEADER -->
                <div style="background-color: #ffcc00; padding: 15px; text-align:center;">
                  <h1 style="color: #1a1a1a; margin: 0; font-size: 24px; font-weight: 900;">
                    NUOVO ORDINE
                  </h1>
                </div>
                    
                <!-- CONTENT -->
                <div style="padding: 25px;">
                    
                  <p style="margin:0; font-size:14px; color:#bbb;">
                    Ordine ID: <strong>#${orderId}</strong>
                  </p>
                    
                  <p style="margin:10px 0 20px; font-size:14px; color:#bbb;">
                    Cliente: <strong>${name} ${surname}</strong><br/>
                    Email: ${email}
                  </p>
                    
                  <!-- PRODOTTI -->
                  <div style="margin-top: 15px;">
                    <h3 style="color: #ffcc00; margin-bottom:10px;">Prodotti</h3>
                    
                    ${enrichedProducts
                .map(
                  (prod) => `
                      <div style="border-bottom: 1px solid #444; padding: 10px 0;">
                        
                        <p style="margin:0; font-weight:bold;">
                          ${prod.name}
                        </p>
                    
                        <p style="margin:4px 0; font-size:13px; color:#ccc;">
                          Quantità: ${prod.quantity} • € ${prod.final_price}
                        </p>
                    
                        ${prod.copyInDigital
                      ? `<p style="margin:0; font-size:12px; color:#00ffcc;">
                                 🎮 Copia digitale
                               </p>`
                      : ""
                    }
                      
                      </div>
                    `,
                )
                .join("")}
                  </div>
                      
                  <!-- TOTALE -->
                  <div style="margin-top: 20px; padding: 12px; background-color: #1f1f1f; border-radius: 6px;">
                    <strong style="color:#ffcc00;">
                      Totale: € ${total_price.toFixed(2)}
                    </strong>
                  </div>
                      
                  <!-- SPEDIZIONE -->
                  <div style="margin-top: 15px;">
                    <h4 style="color:#ffcc00; margin-bottom:5px;">📦 Spedizione</h4>
                    <p style="margin:0; font-size:13px; color:#ccc;">
                      ${shipping_address}<br>
                      ${shipping_cap}, ${shipping_city}<br>
                      ${shipping_country}
                    </p>
                  </div>
                      
                  <!-- FATTURAZIONE -->
                  <div style="margin-top: 10px;">
                    <h4 style="color:#ffcc00; margin-bottom:5px;">🧾 Fatturazione</h4>
                    <p style="margin:0; font-size:13px; color:#ccc;">
                      ${billing_address}<br>
                      ${billing_cap}, ${billing_city}<br>
                      ${billing_country}
                    </p>
                  </div>
                      
                </div>
                      
                <!-- FOOTER -->
                <div style="padding: 15px; background-color: #1f1f1f; border-top: 1px solid #3d3d3d; font-size: 12px; color: #888; text-align:center;">
                  <p style="margin:0;">Notifica automatica sistema ordini</p>
                </div>
                      
              </div>
            </div>
            `,
          };

          // VENDOR MAIL
          trasporter
            .sendMail(vendorMailOptions)
            .then((info) =>
              console.log("MAIL VENDITORE INVIATA:", email, info.response),
            )
            .catch((err) => console.log("ERRORE MAIL VENDITORE:", err));

          // CUSTOMER MAIL
          trasporter
            .sendMail(mailOptions)
            .then((info) =>
              console.log("MAIL CLIENTE INVIATA:", email, info.response),
            )
            .catch((err) => console.log("ERRORE MAIL CLIENTE:", err));

          console.log(results.insertId);

          res.json({
            success: true,
            message: "Ordine inviato con successo",
            orderCode: orderId,
          });
        })
        .catch((err) => errors(err, res));
    },
  );
}

function errors(err, res) {
  console.log(err.message);
  return res.status(500).json({
    success: false,
    message: "Errore interno del database operazione fallita",
  });
}

// Genera il codice o token per la copia digitale del gioco
function digitalCopyCodeGenerator(maxChar = 15) {
  // Stringa dei caratteri validi
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // Genera un buffer di bytes casuali
  const randomBytes = crypto.randomBytes(maxChar);

  // sfruttando randomBytes crea un array che conterra il codice per la copia digitale.
  // per selezionare il carattere da inserire fa un calcolo con il resto di num % characters.length che fa in modo di non avere mai un id che non esiste nella stringa dei caratteri validi.
  const digitalCopyCode = Array.from(
    randomBytes,
    (num) => characters[num % characters.length],
  ).join("");

  return digitalCopyCode;
}

module.exports = { index, show, store };
