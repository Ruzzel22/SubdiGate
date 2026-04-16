(function() {
    // DOM elements
    const welcomeScreen = document.getElementById('welcomeScreen');
    const figmaContainer = document.getElementById('figmaContainer');
    const figmaIframe = document.getElementById('figmaIframe');
    const launchBtn = document.getElementById('launchFrameBtn');
    const backBtn = document.getElementById('backToHomeBtn');

    // Figma embed source (with best stretch parameters)
    const FIGMA_SRC = "https://www.figma.com/embed?embed_host=share&chrome=minimal&hide-ui=1&url=https://www.figma.com/proto/CpDebdi40nY8GNWXMhDN0Z/SubdiGate?node-id=0-1&scaling=fill&hide-ui=1";

    // flag to avoid reloading iframe multiple times
    let iframeLoaded = false;

    // Function to activate Figma fullscreen view (from welcome -> frame)
    function showFigmaFrame() {
        // if iframe not yet loaded, set src dynamically (ensures fresh load)
        if (!iframeLoaded) {
            figmaIframe.src = FIGMA_SRC;
            iframeLoaded = true;
        }
        
        // hide welcome screen with smooth transition
        welcomeScreen.classList.add('hidden');
        
        // show figma container after short delay (for crossfade elegance)
        setTimeout(() => {
            figmaContainer.classList.add('active');
            // enforce perfect stretch after container visible
            enforcePerfectStretch();
        }, 50);
        
        // show back button for returning home
        backBtn.classList.add('visible');
    }

    // Function to go back to welcome homepage (hides figma)
    function showWelcomeHome() {
        // hide figma container first
        figmaContainer.classList.remove('active');
        // remove hidden class from welcome screen
        welcomeScreen.classList.remove('hidden');
        // hide back button because we are on welcome
        backBtn.classList.remove('visible');
        
        // optional: reset any iframe weirdness but keep content for next time
        // but also re-stretch later just in case iframe was active
        // Note: we do NOT clear iframe src, it stays cached for faster revisit
        // but we need to enforce body styles after returning
        setTimeout(() => {
            // ensure no leftover scroll or gaps on welcome
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
        }, 10);
    }

    // ----- STRETCH FUNCTION: ZERO GAPS, FULL BLEED (critical for Figma iframe) -----
    function enforcePerfectStretch() {
        const iframe = figmaIframe;
        if (!iframe) return;
        // only apply if the container is active or we want to pre-stretch anyway
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // set iframe style to fixed, edge-to-edge with exact pixel values
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
        
        // also ensure parent container has no gaps
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
        
        // reset html/body margins AGAIN to be 100% safe
        document.documentElement.style.margin = '0';
        document.documentElement.style.padding = '0';
        document.documentElement.style.overflow = 'hidden';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.overflow = 'hidden';
        document.body.style.backgroundColor = '#000000';
        document.documentElement.style.backgroundColor = '#000000';
    }

    // event listener for window resize + orientation to keep full stretch
    let resizeTimer;
    window.addEventListener('resize', () => {
        requestAnimationFrame(() => {
            if (figmaContainer.classList.contains('active')) {
                enforcePerfectStretch();
            }
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
    
    // also listen to visualViewport for mobile perfect stretch
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', () => {
            if (figmaContainer.classList.contains('active')) {
                requestAnimationFrame(() => enforcePerfectStretch());
            }
        });
    }
    
    // ensure after iframe loads we stretch it again (content may shift)
    figmaIframe.addEventListener('load', function onIframeLoad() {
        if (figmaContainer.classList.contains('active')) {
            enforcePerfectStretch();
            // extra safety: multiple passes to kill any residual gaps
            setTimeout(enforcePerfectStretch, 100);
            setTimeout(enforcePerfectStretch, 300);
        }
        // also remove loading flicker (if any)
    });
    
    // launch button event
    launchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showFigmaFrame();
        // extra stretch call after transition frame
        setTimeout(() => {
            enforcePerfectStretch();
        }, 200);
    });
    
    // back button: return to home / welcome page
    backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showWelcomeHome();
        // reset body style to make welcome screen fully interactive again
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    });
    
    // initial enforce stretch (though figma container not active yet, but for consistency)
    enforcePerfectStretch();
    
    // bonus: if user tries to go "back" via browser while welcome visible, we handle gracefully
    window.addEventListener('pageshow', () => {
        // if figma is active but somehow welcome not hidden? ensure consistency
        if (figmaContainer.classList.contains('active')) {
            enforcePerfectStretch();
        }
    });
    
    // prevent body scrolling when iframe active (but iframe handles scroll)
    document.body.addEventListener('touchmove', (e) => {
        // do NOT block iframe internal scroll; only block if target is body edge
        if (e.target === document.body || e.target === document.documentElement) {
            // but if figma is active, we allow nothing to move body
            if (figmaContainer.classList.contains('active')) {
                e.preventDefault();
            }
        }
    }, { passive: false });
    
    // extra style: remove any default outline / weird spacing on iframe focus
    figmaIframe.style.outline = 'none';
    
    // In case the iframe src is set later and user rotates before load
    window.addEventListener('load', () => {
        if (figmaContainer.classList.contains('active')) enforcePerfectStretch();
    });
    
    // monitoring for dynamic changes (safe)
    const observer = new ResizeObserver(() => {
        if (figmaContainer.classList.contains('active')) enforcePerfectStretch();
    });
    observer.observe(document.documentElement);
})();