// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Cart functionality
const cartBtn = document.getElementById('cart-btn');
const cartDropdown = document.getElementById('cart-dropdown');
const cartCount = document.getElementById('cart-count');
const mobileCartCount = document.getElementById('mobile-cart-count');
let cartItems = [];

// Toggle cart dropdown
cartBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    cartDropdown.classList.toggle('hidden');
});

// Close cart dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!cartBtn.contains(e.target) && !cartDropdown.contains(e.target)) {
        cartDropdown.classList.add('hidden');
    }
});

// Add to cart functionality
function addToCart(product) {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({ ...product, quantity: 1 });
    }
    updateCart();
}

// Update cart UI
function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
    
    let total = 0;
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'flex items-center justify-between py-2 border-b border-gray-200';
        itemElement.innerHTML = `
            <div class="flex-1">
                <div class="font-semibold text-gray-800">${item.name}</div>
                <div class="text-sm text-gray-600">Số lượng: ${item.quantity}</div>
            </div>
            <div class="text-amber-600 font-bold">${itemTotal.toLocaleString('vi-VN')}đ</div>
        `;
        cartItemsContainer.appendChild(itemElement);
    });
    
    document.getElementById('cart-total').textContent = `${total.toLocaleString('vi-VN')}đ`;
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    mobileCartCount.textContent = totalItems;
}

// Login functionality
const loginBtn = document.getElementById('login-btn');
const mobileLoginBtn = document.getElementById('mobile-login-btn');
const loginModal = document.getElementById('login-modal');
const closeModal = document.getElementById('close-modal');
const loginForm = document.getElementById('login-form');

// Open login modal
function openLoginModal() {
    loginModal.classList.remove('hidden');
    loginModal.classList.add('flex');
}

loginBtn.addEventListener('click', openLoginModal);
mobileLoginBtn.addEventListener('click', openLoginModal);

// Close login modal
function closeLoginModal() {
    loginModal.classList.add('hidden');
    loginModal.classList.remove('flex');
}

closeModal.addEventListener('click', closeLoginModal);

// Close modal when clicking outside
loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        closeLoginModal();
    }
});

// Handle login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Here you would typically make an API call to authenticate
    console.log('Login attempt:', { email, password });
    
    // For demo purposes, just close the modal
    closeLoginModal();
    loginForm.reset();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            mobileMenu.classList.add('hidden');
        }
    });
});

// Contact form submission
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Simple form validation
    if (name && email && message) {
        alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
        this.reset();
    } else {
        alert('Vui lòng điền đầy đủ thông tin.');
    }
});

// Add active class to navigation links based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('text-amber-600');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('text-amber-600');
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-5');
        }
    });
}, observerOptions);

// Observe all cards and menu items
document.querySelectorAll('.card-hover, .menu-item').forEach(el => {
    el.classList.add('opacity-0', 'translate-y-5', 'transition-all', 'duration-600', 'ease-out');
    observer.observe(el);
}); 