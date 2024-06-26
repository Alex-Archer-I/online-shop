const listOfCategories = document.querySelector('#categories');
const formOfCategories = document.querySelector('#categories-form');

const serverPath = '/admin/categories';

const createCategoryElement = (name, text, id) => {
    const li = document.createElement('li');
    const nameElement = document.createElement('p');
    const textElement = document.createElement('p');
    const actionsElement = document.createElement('div');
    const removeAction = document.createElement('button');
    const editAction = document.createElement('button');

    nameElement.textContent = name;
    textElement.textContent = text;
    removeAction.textContent = 'Remove';
    editAction.textContent = 'Edit';

    nameElement.classList.add('c-name');
    textElement.classList.add('c-text');
    removeAction.classList.add('btn');
    editAction.classList.add('btn');

    removeAction.addEventListener('click', removeCategory);
    editAction.addEventListener('click', () => {
        openCategoryForm(id, name, text);
    });

    actionsElement.append(removeAction, editAction);

    li.append(nameElement, textElement, actionsElement);

    li.dataset.id = id;

    listOfCategories.append(li);
};

const openCategoryForm = (id = '0', name = '', text = '') => {
    console.log(id);
    formOfCategories.parentElement.classList.remove('hidden');

    if (id !== '0') {
        formOfCategories.querySelector('#name').value = name;
        formOfCategories.querySelector('#description').value = text;
        formOfCategories.querySelector('#id').value = id;
    };
};

const closeCategoryForm = () => {
    formOfCategories.parentElement.classList.add('hidden');

    formOfCategories.querySelector('#name').value = '';
    formOfCategories.querySelector('#description').value = '';
    formOfCategories.querySelector('#id').value = '0';
};

const removeCategory = async (event) => {
    const id = event.target.parentElement.parentElement.dataset.id;
    const csrf = listOfCategories.dataset.csrf;

    let response;

    try {
        response = await fetch(`${serverPath}/${id}?_csrf=${csrf}`, {
            method: 'DELETE',
        });
    } catch (error) {};

    if (!response.ok) {
        throw new Error('Server error!');
    };

    event.target.parentElement.parentElement.remove();
};

const createAndUpdateCategory = async (event) => {
    event.preventDefault();
    const category = new FormData(event.target);

    const newCategoryName = category.get('name');
    const newCategoryDescription = category.get('description');
    const newCategoryId = category.get('id');
    const csrfToken = category.get('_csrf');

    let response;

    try {
        let categoryData;
        let method;

        if (newCategoryId === '0') {
            categoryData = JSON.stringify({
                name: newCategoryName,
                text: newCategoryDescription,
                _csrf: csrfToken,
            });
            method = 'POST';
        } else {
            categoryData = JSON.stringify({
                name: newCategoryName,
                text: newCategoryDescription,
                id: newCategoryId,
                _csrf: csrfToken,
            });
            method = 'PATCH';
        };

        response = await fetch(`${serverPath}`, {
            method: method,
            body: categoryData,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.log(error);
        return;
    };

    if (!response.ok) {
        throw new Error();
    };

    const allCategories = await response.json();

    if (newCategoryId === '0') {
        listOfCategories.innerHTML = '';

        for (const category of allCategories.categories) {
            createCategoryElement(category.name, category.text, category.id);
        };
    } else {
        for (const element of listOfCategories.querySelectorAll('li')) {
            if (element.dataset.id === newCategoryId) {
                element.querySelector('.c-name').textContent = newCategoryName;
                element.querySelector('.c-text').textContent = newCategoryDescription;
            };
        };
    };

    event.target.reset();
    closeCategoryForm();
};

for (const element of listOfCategories.querySelectorAll('li')) {
    element.querySelector('.action-remove').addEventListener('click', removeCategory);
    element.querySelector('.action-edit').addEventListener('click', (event) => {
        openCategoryForm(element.dataset.id, element.querySelector('.c-name').textContent, element.querySelector('.c-text').textContent);
    });
};

formOfCategories.addEventListener('submit', createAndUpdateCategory);
document.querySelector('.action-new-category').addEventListener('click', () => {openCategoryForm()});
document.querySelector('.action-close-form').addEventListener('click', closeCategoryForm);