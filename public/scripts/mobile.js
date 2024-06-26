const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuToggler = document.getElementById('mobile-menu-btn');

const toggleMobileMenu = () => {
    console.log('click');
    mobileMenu.classList.toggle('active');
};

mobileMenuToggler.addEventListener('click', toggleMobileMenu);