const connection = require("../db/connection");

const index = (req, res) => {
  // Recupero i parametri dalla query string
  const searchTerm = req.query.q || "";
  const sortOption = req.query.sort || "recenti";

  // Gestione dell'ordinamento
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
    default:
      orderBy = "created_at DESC";
  }

  // QUERY CORRETTA: Usiamo i parametri (?) per la ricerca e la variabile per l'ordinamento
  const sql = "SELECT * FROM products WHERE name LIKE ? ORDER BY " + orderBy;
  const formattedSearch = "%" + searchTerm + "%";

  connection.query(sql, [formattedSearch], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Errore nel database" });
    }
    res.json(results);
  });
};

module.exports = { index };
