const addToCartElements = document.querySelectorAll('.product-actions .add-to-cart');
const removeFromCartElements = document.querySelectorAll('.product-actions .remove-from-cart');

const addAndDeleteCartItem = async (event) => {
    const target = event.currentTarget;
    const actionsElement = target.parentElement;

    const id = actionsElement.parentElement.dataset.id;
    const csrf = actionsElement.parentElement.dataset.csrf;

    const inCartElement = actionsElement.previousElementSibling;

    let response;
    let method;

    if (target.classList.contains('add-to-cart')) {
        method = 'POST';
    };

    if (target.classList.contains('remove-from-cart')) {
        method = 'PATCH';
    };

    try {
        response = await fetch('/cart/items', {
            method: method,
            body: JSON.stringify({
                id: id,
                _csrf: csrf,
                amount: 0,
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
        console.log(`Server Error! Status ${responce.status}`);
    };

    const newData = await response.json();

    if (target.classList.contains('add-to-cart')) {
        inCartElement.classList.remove('hidden');
        inCartElement.querySelector('input').value = 1;

        target.querySelector('img').src = '/icons/delete.png';
    };

    if (target.classList.contains('remove-from-cart')) {
        inCartElement.classList.add('hidden');
        inCartElement.querySelector('input').value = 0;

        target.querySelector('img').src = '/icons/add.png';
    };

    target.classList.toggle('add-to-cart');
    target.classList.toggle('remove-from-cart');

    badgeUpdate(newData.cartData.totalQuantity);
};

for (const element of addToCartElements) {
    element.addEventListener('click', addAndDeleteCartItem);
};

for (const element of removeFromCartElements) {
    element.addEventListener('click', addAndDeleteCartItem);
};