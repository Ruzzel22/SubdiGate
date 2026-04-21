(function() {
    // DOM elements
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

// Redirect to demo.html
function goToDemo() {
    window.location.href = "demo.html";
}

// Bind all launch buttons to redirect
const launchBtnIds = [
    'launchFrameBtn',
    'launchFrameBtn2',
    'launchFrameBtn3',
    'launchFrameBtn4',
    'launchFrameBtnMobile'
];

launchBtnIds.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            goToDemo();
        });
    }
});

// Hamburger menu toggle
if (hamburger) {
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
    });
}

// Close mobile menu function
window.closeMobileMenu = function() {
    if (mobileMenu) {
        mobileMenu.classList.remove('open');
    }
};

// Contact form handler
window.handleFormSubmit = function(e) {
    e.preventDefault();
    const successMsg = document.getElementById('formSuccess');
    if (successMsg) {
        successMsg.style.display = 'block';
        e.target.reset();
        setTimeout(() => { 
            successMsg.style.display = 'none'; 
        }, 5000);
    }
};

// Navbar scroll shadow
const navbar = document.querySelector('.navbar');
const welcomeScreen = document.getElementById('welcomeScreen');

if (welcomeScreen && navbar) {
    welcomeScreen.addEventListener('scroll', () => {
        if (welcomeScreen.scrollTop > 10) {
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });
}
})();