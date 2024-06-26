const cartBadges = document.querySelectorAll('.nav-content .badge');

const badgeUpdate = (amount) => {
    for (const element of cartBadges) {
        element.textContent = amount;
    };
};