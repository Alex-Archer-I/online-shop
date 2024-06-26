const addToCartElement = document.querySelector('#product-details button');
const cartBadges = document.querySelectorAll('.nav-content .badge');

const addToCart = async () => {
    const id = addToCartElement.dataset.id;
    const csrf = addToCartElement.dataset.csrf;

    let response;
    try {
        response = await fetch('/cart/items', {
            method: 'POST',
            body: JSON.stringify({
                id: id,
                _csrf: csrf,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.log(error);
        return;
    };

    if (!response.ok) {
        console.log('Error!');
        return;
    };

    const responseData = await response.json();

    for (const element of cartBadges) {
        element.textContent = responseData.itemsAmount;
    };
};

addToCartElement.addEventListener('click', addToCart);