const connection = require("../db/connection");

const index = (req, res) => {
  // 1. Recupero parametri dalla query string
  const searchTerm = req.query.q || "";
  const sortOption = req.query.sort || "recenti";

  // 2. Logica di ordinamento
  let orderBy;
  switch (sortOption) {
    case "prezzo_asc":
      orderBy = "price ASC";
      break;
    case "prezzo_desc":
      orderBy = "price DESC";
      break;
    case "nome":
      orderBy = "name ASC";
      break;
    case "recenti":
    default:
      orderBy = "created_at DESC";
      break;
  }

  // 3. Query SQL con ricerca LIKE e ordinamento dinamico

  const sql = `
        SELECT * FROM products 
        WHERE name LIKE ? 
        ORDER BY ${orderBy}
    `;

  const formattedSearch = `%${searchTerm}%`;

  // 4. Esecuzione query
  connection.query(sql, [formattedSearch], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Errore interno del server" });
    }

    // Rispondiamo con i dati reali del database
    res.json(results);
  });
};

module.exports = {
  index,
};
