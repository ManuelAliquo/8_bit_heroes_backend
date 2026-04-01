const connection = require("../db/connection");

// INDEX
function unsortedIndex(req, res) {
  const indexSQL = `SELECT * FROM products;`;

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

// SORTED
function sortedIndex(req, res) {
  const order = req.query.order === "desc" ? "DESC" : "ASC";
  const field = req.query.field;

  const allowedFields = ["price", "name", "created_at"];
  if (!field || !allowedFields.includes(field))
    return res.status(400).json({
      success: false,
      result: "Invalid or missing field",
    });

  const sortSQL = `
  SELECT * FROM products
  ORDER BY ${field} ${order};
  `;

  connection.query(sortSQL, (err, result) => {
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

module.exports = { unsortedIndex, sortedIndex };

// ###################################################

// const index = (req, res) => {
//   // 1. Recupero parametri dalla query string
//   const searchTerm = req.query.q || "";
//   const sortOption = req.query.sort || "recenti";

//   // 2. Logica di ordinamento
//   let orderBy;
//   switch (sortOption) {
//     case "prezzo_asc":
//       orderBy = "price ASC";
//       break;
//     case "prezzo_desc":
//       orderBy = "price DESC";
//       break;
//     case "nome":
//       orderBy = "name ASC";
//       break;
//     case "recenti":
//     default:
//       orderBy = "created_at DESC";
//       break;
//   }

//   // 3. Query SQL con ricerca LIKE e ordinamento dinamico

//   const sql = `
//         SELECT * FROM products
//         WHERE name LIKE ?
//         ORDER BY ${orderBy}
//     `;

//   const formattedSearch = `%${searchTerm}%`;

//   // 4. Esecuzione query
//   connection.query(sql, [formattedSearch], (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: "Errore interno del server" });
//     }

//     // Rispondiamo con i dati reali del database
//     res.json(results);
//   });
// };

// module.exports = { index };
