function validId(req, res, next) {
  const { id } = req.params;
  if (isNaN(parseInt(id)))
    return res.status(400).json({
      success: false,
      result: "questo order id non è valido.",
    });

  next();
}

function validData(req, res, next){
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

  if (!name.trim().toLowerCase()) {
    return res.status(400).json(
      {
        "errorCode": 400,
        "message":"Compilare il campo Nome."
  })}
  if (!surname.trim().toLowerCase()) {
    return res.status(400).json(
      {
        "errorCode": 400,
        "message":"Compilare il campo Cognome."
  })}

  if (!email.trim()) {
    return res.status(400).json(
      {
        "errorCode": 400,
        "message":"Compila il campo Email"
  })}
  if (!email.includes("@") || !email.includes(".com") || !email.includes(".it") || !email.includes(".gov") || !email.includes(".net")) {
    return res.status(400).json(
      {
        "errorCode": 400,
        "message":"Email non valida"
  })}
  if(!shipping_address.trim()) {
    return res.status(400).json(
      {
        "errorCode": 400,
        "message":"Inserisci l'indirizzo di spedizione"
      })
  }
  if (!shipping_cap.trim()) {
    return res.status(400).json(
      {
        "errorCode": 400,
        "message":"Inserisci il CAP di spedizione"
      })
  }
  if (isValidCAP(shipping_cap.trim()) === false) {
    return res.status(400).json(
      {
        "errorCode": 400,
        "message":"il CAP inserito non è valido"
      })
  }
  if (!shipping_city.trim()) {
    return res.status(400).json(
      {
        "errorCode": 400,
        "message":"Inserisci la citta di spedizione"
      })
  }
  if (!shipping_country.trim()) {
    return res.status(400).json(
      {
        "errorCode": 400,
        "message":"Inserisci la Nazione di spedizione"
      })
  }
  if (!billing_address.trim()) {
    return res.status(400).json(
      {
        "errorCode": 400,
        "message":"Inserisci l'indirizzo di fatturazione"
      })
  }
  if (!billing_cap.trim()) {
    return res.status(400).json(
      {
        "errorCode": 400,
        "message": "Inserisci il CAP di fatturazione"
      })
  }
  if (isValidCAP(billing_cap.trim()) === false) {
    return res.status(400).json(
      {
        "errorCode": 400,
        "message": "il CAP inserito non è valido"
      })
  }
  if (!billing_city.trim()) {
    return res.status(400).json(
      {
        "errorCode": 400,
        "message": "Inserisci la citta di fatturazione"
      })
  }
  if (!billing_country.trim()) {
    return res.status(400).json(
      {
        "errorCode": 400,
        "message":"Inserisci la Nazione di fatturazione"
      })
  }

  if(orderedProducts.length === 0){
    return res.status(400).json({
      errorCode: 400,
      message: "Non ci sono prodotti nel carrello"
    })
  }

  next();

}

function isValidCAP (cap) {
  // controlla la lunghezza del cap
  if (cap.length !== 5) return false;

  // controlla che tutti i caratteri siano numeri
  for (let i = 0; i < cap.length; i++) {
    if (cap[i] < '0' || cap[i] > '9') {
      return false;
    }
  }
  return true
}


module.exports = { validId, validData };
