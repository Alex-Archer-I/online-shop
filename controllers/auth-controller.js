const User = require('../models/user-model');
const authUtil = require('../util/auth');
const userValidation = require('../util/validation');
const flashData = require('../util/session-flash');

const singupPage = (req, res) => {
    let data = flashData.getSessionData(req);

    if (!data) {
        data = {
            email: '',
            confirmEmail: '',
            password: '',
            name: '',
            address: '',
        };
    };

    res.render('customer/auth/singup', {value: data});
};

const singupAction = async (req, res, next) => {
    const enteredData = {
        email: req.body.email,
        confirmEmail: req.body['confirm-email'],
        password: req.body.password,
        name: req.body.name,
        address: req.body.address,
    };
    
    if (!userValidation.userDataValidation(
        enteredData.email,
        enteredData.password,
        enteredData.name,
        enteredData.address
    ) || !userValidation.compareEmails(req.body.email, req.body['confirm-email'])) {
        const data = {
            error: 'Please, check entered data.',
            ...enteredData,
        };

        flashData.flashSessionData(req, data, () => {
            res.redirect('/singup');
        });

        return;
    };

    const user = new User(
        req.body.email,
        req.body.password,
        req.body.name,
        req.body.address
    );

    try {
        const existingUser = await user.checkUserByEmail();

        if (existingUser) {
            const data = {
                error: 'User already exist!',
                ...enteredData,
            };

            flashData.flashSessionData(req, data, () => {
                res.redirect('/singup');
            });

            return;
        };

        await user.singUp();
    } catch(error) {
        return next(error);
    };

    res.redirect('/login');
};

const loginPage = (req, res) => {
    let data = flashData.getSessionData(req);

    if (!data) {
        data = {
            email: '',
            password: '',
        };
    };

    res.render('customer/auth/login', {value: data});
};

const loginAction = async (req, res, next) => {
    const user = new User(req.body.email, req.body.password);
    let existingUser;
    let isPasswordCorrect;

    try {
        existingUser = await user.getUserByEmail();
    } catch(error) {
        return next(error);
    };

    const errorData = {
        error: 'Please, check input data',
        email: user.email,
        password: user.password,
    };

    if (!existingUser) {
        flashData.flashSessionData(req, errorData, () => {
            res.redirect('/login');
        });
        
        return;
    };

    try {
        isPasswordCorrect = await user.comparePasswords(existingUser.password);
    } catch(error) {
        return next(error);
    };

    if (!isPasswordCorrect) {
        flashData.flashSessionData(req, errorData, () => {
            res.redirect('/login');
        });

        return;
    };

    authUtil.createUserSession(req, existingUser, () => {
        res.redirect('/');
    });
};

const logOut = (req, res) => {
    authUtil.removeUserSession(req);
    res.redirect('/login');
};

module.exports = {
    singupPage: singupPage,
    singupAction: singupAction,
    loginPage: loginPage,
    loginAction: loginAction,
    logOut: logOut,
};