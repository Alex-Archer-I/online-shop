const errorHandler = (error, req, res, next) => {
    console.log(error);

    if (error.code === 404) {
        return res.status(404).render('common/404');
    };

    res.status(500).render('common/500');
};

module.exports = errorHandler;