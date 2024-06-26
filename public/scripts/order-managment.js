const orderForms = document.querySelectorAll('.order-actions form');

const updateOrder = async (event) => {
    event.preventDefault();

    const form = new FormData(event.target);

    const newStatus = form.get('status');
    const id = form.get('id');
    const csrfToken = form.get('_csrf');

    let response;

    try {
        response = await fetch(`/admin/orders/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                newStatus: newStatus,
                _csrf: csrfToken,
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
        console.log('Server send incorrect answer!');
        return;
    };

    const data = await response.json();

    event.target.parentElement.parentElement.querySelector('.badge').textContent = data.status.toUpperCase();
};

for (const element of orderForms) {
    element.addEventListener('submit', updateOrder);
};