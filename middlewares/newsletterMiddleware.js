function validEmail(req, res, next) {
  const { email } = req.body;
  if (!email || email.trim() === "")
    return res
      .status(400)
      .json({ errorCode: 400, message: "Email non presente. Inserire un email. " });

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!regex.test(email.trim()))
    return res
      .status(400)
      .json({ errorCode: 400, message: "Email non valida. Inserire una mail valida." });
  next();
}

module.exports = { validEmail };
