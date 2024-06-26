const checkAuth = (req, res, next) => {
    const userId = req.session.userId;

    if (!userId) {
        res.locals.isAuth = false;
        return next();
    };

    res.locals.isAdmin = req.session.isAdmin;

    res.locals.userId = userId;
    res.locals.isAuth = true;
    next();
};

module.exports = checkAuth;