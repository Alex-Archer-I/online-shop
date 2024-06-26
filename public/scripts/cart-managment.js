const cartItemsForms = document.querySelectorAll('.cart-item-managment');
const cartTotalAmountElement = document.querySelector('#cart-amount p');

const productInCartActionsElements = document.querySelectorAll('.product-in-cart-actions');

let isCart = false;

if (document.querySelector('#cart-list')) {isCart = true};

const updateCart = async (event) => {
    const actions = event.target.parentElement;
    const input = actions.querySelector('input');

    const id = actions.parentElement.dataset.id;
    const csrf = actions.parentElement.dataset.csrf;

    let amount = input.value;

    if (event.target.classList.contains('product-inc')) {
        amount++;
    };

    if (event.target.classList.contains('product-dec')) {
        amount--;
    };

    let response;

    try {
        response = await fetch('/cart/items', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                amount: amount,
                _csrf: csrf,
            }),
        });
    } catch (error) {};

    input.value = amount;

    if (!response.ok) {
        console.log(`Server error. Status ${response.status}`);
    };

    const data = await response.json();

    if (isCart) {
        let itemTotalPrice;

        for (const item of data.cartData.items) {
            if (item.product.id === id) {
                itemTotalPrice = item.totalPrice;
            };
        };

        if (amount === 0) {
            actions.parentElement.remove();
        } else {
            actions.parentElement.querySelector('.cart-item-total-price').textContent = itemTotalPrice.toFixed(2);
        };

        document.querySelector('#cart-amount').firstElementChild.innerHTML = `Total: ${data.cartData.totalPrice.toFixed(2)} coins.`;

    } else if (!isCart && amount === 0) {
        actions.classList.toggle('hidden');

        const actionButton = actions.nextElementSibling.querySelector('.remove-from-cart');

        actionButton.classList.add('add-to-cart');
        actionButton.classList.remove('remove-from-cart');

        actionButton.querySelector('img').src = '/icons/add.png';
    };

    badgeUpdate(data.cartData.totalQuantity);
};

for (const element of productInCartActionsElements) {
    element.querySelector('.product-inc').addEventListener('click', updateCart);
    element.querySelector('.product-dec').addEventListener('click', updateCart);
};