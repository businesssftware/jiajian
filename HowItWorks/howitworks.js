// Traditional scrolling animation observer
const observerOptions = {
    threshold: 0.3,
    rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const content = entry.target.querySelector(".section-content");
            const visual = entry.target.querySelector(".section-visual");

            if (content) content.classList.add("animate");
            if (visual) visual.classList.add("animate");
        }
    });
}, observerOptions);

// Observe traditional sections
document.querySelectorAll(".traditional-section").forEach((section) => {
    observer.observe(section);
});

// Interactive showcase functionality
let currentSectionIndex = 0;
let isAutoPlaying = false;
let autoPlayInterval;
let showcaseStarted = false;

const sections = document.querySelectorAll(".content-section");
const progressDots = document.querySelectorAll(".progress-dot");

function showSection(index) {
    // Remove all active classes
    sections.forEach((section) => section.classList.remove("active"));
    progressDots.forEach((dot) => dot.classList.remove("active"));

    // Show current section
    sections[index].classList.add("active");
    progressDots[index].classList.add("active");

    currentSectionIndex = index;
}

function nextSection() {
    const nextIndex = (currentSectionIndex + 1) % sections.length;
    showSection(nextIndex);
}

function startShowcase() {
    if (showcaseStarted) return;
    showcaseStarted = true;

    showSection(0);
    isAutoPlaying = true;

    autoPlayInterval = setInterval(() => {
        if (isAutoPlaying) {
            nextSection();
        }
    }, 4000); // Switch every 4 seconds
}

// Click handler for progress dots
function handleDotClick(index) {
    isAutoPlaying = false;
    clearInterval(autoPlayInterval);
    showSection(index);

    // Resume auto-play after 3 seconds
    setTimeout(() => {
        isAutoPlaying = true;
        autoPlayInterval = setInterval(() => {
            if (isAutoPlaying) {
                nextSection();
            }
        }, 4000);
    }, 3000);
}

// Bind click events to progress dots
progressDots.forEach((dot, index) => {
    dot.addEventListener("click", () => handleDotClick(index));
});

// Scroll detection for showcase activation
const showcaseObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !showcaseStarted) {
                startShowcase();
            }
        });
    },
    {
        threshold: 0.5,
    }
);

// Observe the showcase wrapper
const showcaseWrapper = document.querySelector(".showcase-wrapper");
if (showcaseWrapper) {
    showcaseObserver.observe(showcaseWrapper);
}

// Hero scroll indicator click
const scrollIndicator = document.querySelector(".scroll-indicator");
if (scrollIndicator) {
    scrollIndicator.addEventListener("click", () => {
        const firstSection = document.querySelector(".traditional-section");
        if (firstSection) {
            firstSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    });
}



// Pause auto-play when user interacts with showcase
const mainContent = document.querySelector(".main-content");
if (mainContent) {
    mainContent.addEventListener("mouseenter", () => {
        isAutoPlaying = false;
    });

    mainContent.addEventListener("mouseleave", () => {
        if (showcaseStarted) {
            isAutoPlaying = true;
        }
    });
}

// Handle visibility change (pause when tab is hidden)
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        isAutoPlaying = false;
    } else if (showcaseStarted) {
        isAutoPlaying = true;
    }
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchStartY = 0;

if (mainContent) {
    mainContent.addEventListener("touchstart", (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    mainContent.addEventListener("touchend", (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Only handle horizontal swipes (ignore vertical scrolling)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            isAutoPlaying = false;
            clearInterval(autoPlayInterval);

            if (deltaX > 0) {
                // Swipe right - previous section
                const prevIndex =
                    currentSectionIndex === 0
                        ? sections.length - 1
                        : currentSectionIndex - 1;
                showSection(prevIndex);
            } else {
                // Swipe left - next section
                nextSection();
            }

            // Resume auto-play after swipe
            setTimeout(() => {
                isAutoPlaying = true;
                autoPlayInterval = setInterval(() => {
                    if (isAutoPlaying) {
                        nextSection();
                    }
                }, 4000);
            }, 3000);
        }
    });
}

// Keyboard navigation
document.addEventListener("keydown", (e) => {
    if (
        showcaseStarted &&
        (e.key === "ArrowLeft" || e.key === "ArrowRight")
    ) {
        e.preventDefault();
        isAutoPlaying = false;
        clearInterval(autoPlayInterval);

        if (e.key === "ArrowLeft") {
            const prevIndex =
                currentSectionIndex === 0
                    ? sections.length - 1
                    : currentSectionIndex - 1;
            showSection(prevIndex);
        } else {
            nextSection();
        }

        // Resume auto-play after keyboard navigation
        setTimeout(() => {
            isAutoPlaying = true;
            autoPlayInterval = setInterval(() => {
                if (isAutoPlaying) {
                    nextSection();
                }
            }, 4000);
        }, 3000);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const cookiePopup = document.getElementById('cookiePopup');
    const overlay = document.getElementById('overlay');
    const acceptAllBtn = document.getElementById('acceptAllBtn');
    const necessaryBtn = document.getElementById('necessaryBtn');

    // Check if cookie consent was already given
    if (!getCookie('cookie_consent')) {
        // Show popup and overlay after short delay
        setTimeout(() => {
            cookiePopup.classList.add('show');
            overlay.classList.add('show');
        }, 1000);
    }

    // Accept all cookies
    acceptAllBtn.addEventListener('click', function () {
        setCookie('cookie_consent', 'all', 5); // 5min expiry
        setCookie('analytics_cookies', 'true', 5);
        setCookie('marketing_cookies', 'true', 5);
        closePopup();
    });

    // Accept only necessary cookies
    necessaryBtn.addEventListener('click', function () {
        setCookie('cookie_consent', 'necessary', 5);
        setCookie('analytics_cookies', 'false', 5);
        setCookie('marketing_cookies', 'false', 5);
        closePopup();
    });

    function closePopup() {
        cookiePopup.classList.remove('show');
        overlay.classList.remove('show');
    }

    // Cookie helper functions
    function setCookie(name, value, minutes) {
        const date = new Date();
        date.setTime(date.getTime() + (minutes * 1000 * 60));
        const expires = "expires=" + date.toUTCString();
        document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax`;
    }

    function getCookie(name) {
        const cookieName = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');

        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
        return "";
    }

});

