
function validId (req, res, next) {
    const {id} = req.params;
    if (isNaN(parseInt(id))) return res.status(400).json({
        success: false,
        message: "questo order id non è valido."
    });

    next();
}

module.exports = {validId}