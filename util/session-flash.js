const getSessionData = (req) => {
    const flash = req.session.flash;

    req.session.flash = null;

    return flash;
};

const flashSessionData = (req, data, action) => {
    req.session.flash = data;
    req.session.save(action);
};

module.exports = {
    getSessionData: getSessionData,
    flashSessionData: flashSessionData,
};