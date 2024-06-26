const csurfToken = (req, res, next) => {
    res.locals.csurfToken = req.csrfToken();
    next();
};

module.exports = csurfToken;