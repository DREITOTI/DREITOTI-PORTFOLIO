document.addEventListener('DOMContentLoaded', () => {
 
    /* ---------------------------------------------------
       MOBILE MENU
       The checkbox (#menu-toggle) already opens/closes the
       menu via CSS. This adds what CSS can't: closing the
       menu after a link is tapped, closing it when the user
       taps outside, and closing it on Escape.
    --------------------------------------------------- */
    const menuToggle = document.getElementById('menu-toggle');
    const topNavLinks = document.querySelectorAll('.menu ul li a');
    const tabItems = document.querySelectorAll('.tab-item');
    const allNavLinks = [...topNavLinks, ...tabItems];
    const navbar = document.querySelector('.navbar');
 
    const closeMenu = () => {
        if (menuToggle) menuToggle.checked = false;
    };
 
    topNavLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
 
    document.addEventListener('click', (e) => {
        if (menuToggle && menuToggle.checked && !navbar.contains(e.target)) {
            closeMenu();
        }
    });
 
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });
 
    /* ---------------------------------------------------
       NAVBAR ON SCROLL
       Adds a subtle blur/shadow boost once the page has
       scrolled, so the bar reads as "elevated" above content.
    --------------------------------------------------- */
    const onScroll = () => {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
 
    /* ---------------------------------------------------
       ACTIVE SECTION TRACKING
       Highlights the matching link in both the top nav and
       the bottom iOS-style tab bar as each section scrolls
       into view — no manual clicking required.
    --------------------------------------------------- */
    const sections = document.querySelectorAll('section[id], header[id]');
 
    const setActive = (id) => {
        allNavLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === id);
        });
    };
 
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActive(entry.target.id);
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
 
    sections.forEach(section => sectionObserver.observe(section));
 








    /* ---------------------------------------------------
       NAV SEARCH
       Filters/highlights the nav links that match what's
       typed. Typing "skill" dims every link except "Skills".
       Clearing the box restores all of them.
    --------------------------------------------------- */
    const searchInput = document.querySelector('.searchtext');
    const searchButton = document.querySelector('.searchbutton');
 
    const runSearch = () => {
        const term = searchInput.value.trim().toLowerCase();
        let firstMatch = null;
 
        topNavLinks.forEach(link => {
            const text = link.textContent.trim().toLowerCase();
            const matches = term === '' || text.includes(term);
            link.parentElement.style.opacity = matches ? '1' : '0.35';
            if (matches && term !== '' && !firstMatch) firstMatch = link;
        });
 
        if (firstMatch) {
            firstMatch.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
 
    if (searchInput) {
        searchInput.addEventListener('input', runSearch);
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                runSearch();
                closeMenu();
            }
        });
    }
    if (searchButton) {
        searchButton.addEventListener('click', (e) => {
            e.preventDefault();
            runSearch();
        });
    }
 






    
    /* ---------------------------------------------------
       HERO ENTRANCE
       Small staggered fade/slide-in for the hero text,
       buttons, and photos on page load.
    --------------------------------------------------- */
    const revealTargets = [
        document.querySelector('.title'),
        document.querySelector('.titlebutton'),
        document.querySelector('.picko1'),
        document.querySelector('.picko2'),
        document.querySelector('.socials')
    ];
 
    revealTargets.forEach((el, i) => {
        if (!el) return;
        el.classList.add('reveal');
        setTimeout(() => {
            el.classList.add('reveal-in');
            // once the entrance animation finishes, drop both classes
            // so nothing keeps overriding transform/opacity afterwards
            // (this is what lets the photo hover effect keep working)
            el.addEventListener('animationend', () => {
                el.classList.remove('reveal', 'reveal-in');
            }, { once: true });
        }, 150 + i * 120);
    });
 
    /* ---------------------------------------------------
       SCROLL-TRIGGERED SECTION REVEALS
       Every card and the section title fade/slide up once
       they enter the viewport, and skill bars fill from 0
       to their target width at the same moment.
    --------------------------------------------------- */
    const revealEls = document.querySelectorAll(
        '.section-title, .eyebrow, .glass-card'
    );
    revealEls.forEach(el => el.classList.add('reveal-on-scroll'));
 
    // stagger cards within each grid so they cascade in rather than
    // popping together all at once
    document.querySelectorAll('.glass-grid, .timeline, .contact-wrap').forEach(grid => {
        [...grid.children].forEach((card, i) => {
            card.style.transitionDelay = `${i * 90}ms`;
        });
    });
 
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
 
                // if this card contains a skill bar, fill it now
                const bar = entry.target.querySelector('.bar span');
                if (bar && !bar.style.width) {
                    const target = bar.dataset.width || 70;
                    requestAnimationFrame(() => {
                        bar.style.width = target + '%';
                    });
                }
 
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
 
    revealEls.forEach(el => revealObserver.observe(el));
 
    /* Fill the footer year automatically */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
 
});
 




