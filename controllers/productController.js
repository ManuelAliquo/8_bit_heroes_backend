const connection = require ("../db/connection")

function show (req,res) {
    const {id} = req.params

     const productSql = 
     `SELECT 
      p.*,
      d.percentage AS discount_percentage,
      d.start_date AS discount_start_date,
      d.end_date AS discount_end_date
    FROM products p
    LEFT JOIN discounts d ON p.discount_id = d.id
    WHERE p.id = ?`


connection.query (productSql, [id],(err,results)=>{
    if(err) {
        return res.status(500).json({
            error: "Errore del Server",
        })
    }

    if(results.length===0){
        return res.status(404).json({
            error: "Prodotto non trovato"
        })
    }

    const product =results[0]

    const tagsSql= 
    `SELECT t.id, t.tag_name
      FROM tags t
      JOIN product_tags pt ON t.id = pt.tag_id
      WHERE pt.product_id = ?`

      connection.query (tagsSql,[id],(err,tagResults)=>{
        if(err){
            return res.status(500).json({
                error:"Errore nel recupero tag"
            })
        }

        product.tags=tagResults

        if (product.discount_percentage) {
            product.final_price=(
                product.price - (product.price * product.discount_percentage) / 100
            ).toFixed(2)

        } else {
            product.final_price = product.price
        }
        res.json(product)
      })
})
}

module.exports = {show}