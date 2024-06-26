const isEmpty = (data) => {
    return (!data || data.trim() === '');
};

const userCredentialsValid = (email, password) => {
    return (email
        && email.includes('@')
        && password
        && password.trim().length >= 7);
};

const userDataValidation = (email, password, name, address) => {
    return (userCredentialsValid(email, password)
            && !isEmpty(name)
            && !isEmpty(address));
};

const compareEmails = (email, confirmEmail) => {
    return email === confirmEmail;
};

module.exports = {
    userDataValidation: userDataValidation,
    compareEmails: compareEmails,
};