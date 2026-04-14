const validEndpoint = (req, res) => {
  res.status(404).json({
    errorCode: "404",
    message: "Questo endpoint non esiste",
  });
};

module.exports = validEndpoint;
