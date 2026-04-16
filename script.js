(function() {
    // DOM elements
    const welcomeScreen = document.getElementById('welcomeScreen');
    const figmaContainer = document.getElementById('figmaContainer');
    const figmaIframe = document.getElementById('figmaIframe');
    const backBtn = document.getElementById('backToHomeBtn');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    // Figma embed source
    const FIGMA_SRC = "https://www.figma.com/embed?embed_host=share&chrome=minimal&hide-ui=1&url=https://www.figma.com/proto/CpDebdi40nY8GNWXMhDN0Z/SubdiGate?node-id=0-1&scaling=fill&hide-ui=1";

    // Flag to avoid reloading iframe multiple times
    let iframeLoaded = false;

    // ─── Launch Figma fullscreen ──────────────────────────
    function showFigmaFrame() {
        if (!iframeLoaded) {
            figmaIframe.src = FIGMA_SRC;
            iframeLoaded = true;
        }
        welcomeScreen.classList.add('hidden');
        setTimeout(() => {
            figmaContainer.classList.add('active');
            enforcePerfectStretch();
        }, 50);
        backBtn.classList.add('visible');
    }

    // ─── Return to landing page ───────────────────────────
    function showWelcomeHome() {
        figmaContainer.classList.remove('active');
        welcomeScreen.classList.remove('hidden');
        backBtn.classList.remove('visible');
        setTimeout(() => {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
        }, 10);
    }

    // ─── Bind ALL launch buttons ──────────────────────────
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
                showFigmaFrame();
                setTimeout(enforcePerfectStretch, 200);
            });
        }
    });

    // ─── Back button ──────────────────────────────────────
    backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showWelcomeHome();
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    });

    // ─── Hamburger menu ───────────────────────────────────
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
    });

    window.closeMobileMenu = function() {
        mobileMenu.classList.remove('open');
    };

    // ─── Contact form handler ─────────────────────────────
    window.handleFormSubmit = function(e) {
        e.preventDefault();
        const successMsg = document.getElementById('formSuccess');
        if (successMsg) {
            successMsg.style.display = 'block';
            e.target.reset();
            setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
        }
    };

    // ─── Navbar scroll shadow ─────────────────────────────
    const navbar = document.querySelector('.navbar');
    welcomeScreen.addEventListener('scroll', () => {
        if (welcomeScreen.scrollTop > 10) {
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // ─── Stretch function: zero gaps for Figma iframe ─────
    function enforcePerfectStretch() {
        const iframe = figmaIframe;
        if (!iframe) return;
        const width = window.innerWidth;
        const height = window.innerHeight;

        iframe.style.position = 'fixed';
        iframe.style.top = '0px';
        iframe.style.left = '0px';
        iframe.style.right = '0px';
        iframe.style.bottom = '0px';
        iframe.style.width = width + 'px';
        iframe.style.height = height + 'px';
        iframe.style.margin = '0px';
        iframe.style.padding = '0px';
        iframe.style.border = 'none';
        iframe.style.display = 'block';
        iframe.style.overflow = 'hidden';

        if (figmaContainer) {
            figmaContainer.style.position = 'fixed';
            figmaContainer.style.top = '0';
            figmaContainer.style.left = '0';
            figmaContainer.style.width = '100%';
            figmaContainer.style.height = '100%';
            figmaContainer.style.margin = '0';
            figmaContainer.style.padding = '0';
            figmaContainer.style.background = '#000';
        }

        document.documentElement.style.margin = '0';
        document.documentElement.style.padding = '0';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
    }

    // ─── Resize / orientation listeners ──────────────────
    let resizeTimer;
    window.addEventListener('resize', () => {
        requestAnimationFrame(() => {
            if (figmaContainer.classList.contains('active')) enforcePerfectStretch();
        });
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (figmaContainer.classList.contains('active')) enforcePerfectStretch();
        }, 100);
    });

    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            if (figmaContainer.classList.contains('active')) enforcePerfectStretch();
        }, 30);
        enforcePerfectStretch();
    });

    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', () => {
            if (figmaContainer.classList.contains('active')) {
                requestAnimationFrame(enforcePerfectStretch);
            }
        });
    }

    figmaIframe.addEventListener('load', function() {
        if (figmaContainer.classList.contains('active')) {
            enforcePerfectStretch();
            setTimeout(enforcePerfectStretch, 100);
            setTimeout(enforcePerfectStretch, 300);
        }
    });

    // ─── Prevent body scroll when iframe active ──────────
    document.body.addEventListener('touchmove', (e) => {
        if (e.target === document.body || e.target === document.documentElement) {
            if (figmaContainer.classList.contains('active')) {
                e.preventDefault();
            }
        }
    }, { passive: false });

    // ─── Resize observer (safety net) ────────────────────
    const observer = new ResizeObserver(() => {
        if (figmaContainer.classList.contains('active')) enforcePerfectStretch();
    });
    observer.observe(document.documentElement);

    window.addEventListener('pageshow', () => {
        if (figmaContainer.classList.contains('active')) enforcePerfectStretch();
    });

    // Initial call
    enforcePerfectStretch();
})();