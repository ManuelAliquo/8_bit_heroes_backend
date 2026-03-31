const connection = require('../db/connection');

function index(req, res) { };

function show(req, res) {
    const { id } = req.params;
    const sql = `
    SELECT * 
    FROM orders 
    WHERE id = ?`;

    connection.query(sql, [id], (err, results) => {
        if (err) return errors(err);

        const orderedProductsSql =
            `SELECT * FROM orders_products  
        INNER JOIN products 
        ON orders_products.product_id = products.id
        WHERE order_id = ?`

        connection.query(orderedProductsSql, [id], (err, orderedProducts) => {
            if (err) return errors(err);
            return res.status(200).json({
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
        sameAddress,
        orderedProducts //é un array di oggetti che contiene tutti i prodotti che erano nel carrello
    } = req.body;

    // variabile per salvare l'id dell'ordine creato. servirà dopo per associare i prodotti nel carrello all'ordine.
    let orderId;

    const sql = `
    INSERT INTO orders (name,
        surname,
        email,
        shipping_address,
        shipping_cap,
        shipping_city,
        shipping_country,
        billing_address,
        billing_cap,
        billing_city,
        billing_country)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)
    `;

    const orderData = (sameAddress) => {
        return sameAddress ? [
            name,
            surname,
            email,
            shipping_address,
            shipping_cap,
            shipping_city,
            shipping_country,
            shipping_address,
            shipping_cap,
            shipping_city,
            shipping_country
        ] : [
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
            billing_country
        ]
    }

    connection.query(sql,
        orderData(sameAddress), (err, results) => {
            if (err) return errors(err);
            // ritorno l'id dell'ordine creato salvandolo direttamente nella variabile orderId appositamente creata.
            return orderId = results.insertedId
        });


    // mappo gli orderedproducts così da salvarli nella apposita sezione del database
    orderedProducts.map((orderedProduct) => {
        const orderedGames = `
        INSERT INTO products_orders (order_id, product_id, quantity, product_price, digital_copy_code) 
        VALUES (?,?,?,?,?)`;

        connection.query(orderedGames, [orderId, orderedProduct.id, orderedProduct.quantity, orderedProduct.price, digitalCopyCodeGenerator()], (err, orderedProductsList) => {
            res.json({
                success: true,
                message: 'Ordine inviato con successo'
            })
        })
    })

}

function errors(err) {
    return res.status(500).json({ success: false, message: 'Errore interno del database operazione fallita' });
};

// Genera il codice o token per la copia digitale del gioco
function digitalCopyCodeGenerator(maxChar = 15) {
    // Stringa dei caratteri validi
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    // Genera un array lungo tanto quanto il valore numerico inserito tra le parentesi
    const randomNums = new Uint8Array(maxChar);

    // riempe l'array con numeri random compresi tra 0 e 255
    crypto.getRandomValues(randomNums);

    // sfruttando l'array randomNums crea un nuovo array che conterra il codice per la copia digitale.
    // per selezionare il carattere da inserire fa un calcolo con il resto di num % characters.length che fa in modo di non avere mai un id che non esiste nella stringa dei caratteri validi.
    const digitalCopyCode = Array.from(randomNums, num => characters[num % characters.length]).join('');

    return digitalCopyCode
}

module.exports = { index, show, store }