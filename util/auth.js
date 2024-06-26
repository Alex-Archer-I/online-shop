const createUserSession = (req, user, action) => {
    req.session.userId = user._id.toString();
    req.session.isAdmin = user.isAdmin;
    req.session.save(action);
};

const removeUserSession = (req) => {
    req.session.userId = null;
};

module.exports = {
    createUserSession: createUserSession,
    removeUserSession: removeUserSession,
};