const removeProductsElement = document.querySelectorAll('.product-item button');

const removeProduct = async (event) => {
    const id = event.target.dataset.productId;
    const csrf = event.target.dataset.csrf;

    const response = await fetch(`/admin/products/${id}?_csrf=${csrf}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        console.log('Server Error');
        return;
    };

    event.target.parentElement.parentElement.parentElement.parentElement.remove();
};

removeProductsElement.forEach((element) => {
    element.addEventListener('click', removeProduct);
});