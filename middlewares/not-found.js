const notFoundPage = (req, res, next) => {
    console.log('Not Found page rendered');
    res.render('common/404');
};

module.exports = notFoundPage;