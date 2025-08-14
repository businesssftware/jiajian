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

// Parallax effect for floating ring
window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector(".floating-ring");
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px) rotate(${scrolled * 0.1
            }deg)`;
    }
});

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