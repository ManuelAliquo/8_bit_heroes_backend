const connection = require('../db/connection');
const crypto = require('crypto');

function index(req, res) {
    const sql = `SELECT * FROM orders`;
    connection.query(sql, (err, results) => {
        res.status(200).json({
            success: true,
            result: results
        })
    })
};

function show(req, res) {
    const { id } = req.params;
    const orderId = parseInt(id);
    const sql = `
    SELECT * 
    FROM orders 
    WHERE id = ?`;

    connection.query(sql, [orderId], (err, results) => {
        if (err) return errors(err, res);

        const orderedProductsSql =
            `SELECT * FROM products_orders 
        INNER JOIN products 
        ON products_orders.product_id = products.id
        WHERE order_id = ?`

        connection.query(orderedProductsSql, [orderId], (err, orderedProducts) => {
            if (err) return errors(err);
             res.status(200).json({
                success: true,
                order: results,
                productsOrdered: orderedProducts
            })
        })
    })
};

function store(req, res) {
    // dati che vengono recuperati dal body della richiesta
    const {
        orderedProducts, //é un array di oggetti che contiene tutti i prodotti che erano nel carrello
    } = req.body;

    let total_price = 0;

    orderedProducts.map(prod => total_price = total_price + prod.price * parseInt(prod.quantity));

    // variabile per salvare l'id dell'ordine creato. servirà dopo per associare i prodotti nel carrello all'ordine.
    let orderId;

    const sql = `
    INSERT INTO orders (status, total_price)
        VALUES (?, ?)
    `;


    connection.query(sql, ['Da pagare', total_price.toFixed(2)], (err, results) => {
        if (err) return errors(err, res);
        // ritorno l'id dell'ordine creato salvandolo direttamente nella variabile orderId appositamente creata.
        orderId = results.insertId;

        // mappo gli orderedproducts così da salvarli nella apposita sezione del database
        orderedProducts.map((p) => {
            const orderedGames = `
                INSERT INTO products_orders (order_id, product_id, quantity, product_price, digital_copy_code) 
                VALUES (?,?,?,?,?)`;

            connection.query(orderedGames, [orderId, p.id, p.quantity, p.price, p.copyInDigital ? digitalCopyCodeGenerator() : ""], (err, orderedProductsList) => {
            });
        })
        res.json({
            success: true,
            message: 'Ordine inviato con successo',
            orderCode: orderId
        })
    });



}

function errors(err, res) {
    console.log(err.message);
    return res.status(500).json({ success: false, message: 'Errore interno del database operazione fallita' });
};

// Genera il codice o token per la copia digitale del gioco
function digitalCopyCodeGenerator(maxChar = 15) {
    // Stringa dei caratteri validi
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    // Genera un buffer di bytes casuali
    const randomBytes = crypto.randomBytes(maxChar);

    // sfruttando randomBytes crea un array che conterra il codice per la copia digitale.
    // per selezionare il carattere da inserire fa un calcolo con il resto di num % characters.length che fa in modo di non avere mai un id che non esiste nella stringa dei caratteri validi.
    const digitalCopyCode = Array.from(randomBytes, num => characters[num % characters.length]).join('');

    return digitalCopyCode
}

module.exports = { index, show, store }