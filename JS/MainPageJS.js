// Preloader functionality
window.addEventListener('load', function () {
    // Show loading screen for exactly 3 seconds
    setTimeout(function () {
        const preloader = document.getElementById('preloader');
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';

        // Enable body scrolling
        document.body.style.overflow = 'auto';

        // Clean up after transition completes
        setTimeout(function () {
            preloader.style.display = 'none';
        }, 500);
    }, 3000); // 3000ms = 3 seconds
});

// Navigation and timeline functionality
document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const road = document.getElementById('road');
    const car = document.getElementById('car');
    const yearIndicator = document.getElementById('yearIndicator');
    const timelineMarkers = document.querySelectorAll('.timeline-marker');
    const timelineInfos = document.querySelectorAll('.timeline-info');

    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link, .back-btn');
    const aboutParagraph = document.getElementById('aboutParagraph');
    const footerContentContainer = document.querySelector('.footer-content-container');

    // Timeline data
    const timelinePositions = [0, 10, 25, 40, 55, 70, 85];
    const timelineYears = ['Contexte', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

    // State variables
    let currentTimelineIndex = 0;
    let touchStartX = 0;

    // Initialize
    updateYearIndicator();

    // Navigation functionality
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');

            // Hide all content sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });

            // Handle About button specifically
            if (targetId === 'about') {
                // Show the About paragraph and footer container
                if (footerContentContainer.style.display === 'none' || footerContentContainer.style.display === '') {
                    footerContentContainer.style.display = 'flex';
                    aboutParagraph.style.display = 'block';

                    // Scroll to the footer content
                    footerContentContainer.scrollIntoView({ behavior: 'smooth' });

                    // Hide the main timeline container
                    document.querySelector('.main-container').style.display = 'none';
                } else {
                    footerContentContainer.style.display = 'none';
                    aboutParagraph.style.display = 'none';

                    // Show the main timeline container
                    document.querySelector('.main-container').style.display = 'block';
                }
            }
            else if (targetId === 'home') {
                // Hide About paragraph and footer container when going home
                footerContentContainer.style.display = 'none';
                aboutParagraph.style.display = 'none';

                // Show the main timeline container
                document.querySelector('.main-container').style.display = 'block';
            }
            else {
                // Hide About paragraph and footer container for other sections
                footerContentContainer.style.display = 'none';
                aboutParagraph.style.display = 'none';

                // Hide main timeline and show content section
                document.querySelector('.main-container').style.display = 'none';
                document.getElementById(targetId).classList.add('active');
            }
        });
    });

    // Optional: Close About content when clicking outside
    document.addEventListener('click', function (e) {
        const aboutButton = document.querySelector('.nav-link[data-target="about"]');
        const mainContainer = document.querySelector('.main-container');

        // If About content is visible and user clicks outside of it
        if (footerContentContainer && footerContentContainer.style.display === 'flex') {
            if (!footerContentContainer.contains(e.target) &&
                !aboutParagraph.contains(e.target) &&
                e.target !== aboutButton) {
                footerContentContainer.style.display = 'none';
                aboutParagraph.style.display = 'none';
                mainContainer.style.display = 'block';
            }
        }
    });

    // Move to specific timeline point
    function moveToTimelinePoint(index) {
        if (index >= 0 && index < timelinePositions.length) {
            currentTimelineIndex = index;
            const targetPosition = -timelinePositions[index] * 2; // Convert to road translation
            road.style.transform = `translateX(${targetPosition}px)`;
            car.style.left = `${timelinePositions[index]}%`;
            updateYearIndicator();

            // Show info for current marker
            showTimelineInfo(index);
        }
    }

    // Show timeline info
    function showTimelineInfo(index) {
        // Hide all infos
        timelineInfos.forEach(info => {
            info.classList.remove('active');
        });

        // Show current info if available
        if (index > 0 && index <= timelineMarkers.length) {
            const marker = timelineMarkers[index - 1];
            const markerPosition = marker.style.left;
            const info = document.querySelector(`.timeline-info[data-marker="${markerPosition}"]`);
            if (info) {
                info.classList.add('active');
            }
        }
    }

    // Update year indicator
    function updateYearIndicator() {
        yearIndicator.textContent = timelineYears[currentTimelineIndex];
    }

    // Keyboard controls
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') {
            // Move forward in timeline
            if (currentTimelineIndex < timelinePositions.length - 1) {
                moveToTimelinePoint(currentTimelineIndex + 1);
            }
        } else if (e.key === 'ArrowLeft') {
            // Move backward in timeline
            if (currentTimelineIndex > 0) {
                moveToTimelinePoint(currentTimelineIndex - 1);
            }
        } else if (e.key === ' ' || e.key === 'Spacebar') {
            // Spacebar always shows Contexte information (first stop at 10%)
            e.preventDefault(); // Prevent page scrolling
            document.querySelector('.main-container').style.display = 'none';
            document.getElementById('foundation').classList.add('active');
        }
    });

    // Click on timeline markers
    timelineMarkers.forEach(marker => {
        marker.addEventListener('click', function () {
            const index = Array.from(timelineMarkers).indexOf(this) + 1;
            moveToTimelinePoint(index);
        });
    });

    // Click on timeline info buttons
    document.querySelectorAll('.timeline-info .btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            document.querySelector('.main-container').style.display = 'none';
            if (page) {
                document.getElementById(page).classList.add('active');
            }
        });
    });

    // Touch controls for mobile
    document.addEventListener('touchstart', function (e) {
        touchStartX = e.touches[0].clientX;
    });

    document.addEventListener('touchend', function (e) {
        if (!touchStartX) return;

        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentTimelineIndex < timelinePositions.length - 1) {
                // Swipe left - move forward
                moveToTimelinePoint(currentTimelineIndex + 1);
            } else if (diff < 0 && currentTimelineIndex > 0) {
                // Swipe right - move backward
                moveToTimelinePoint(currentTimelineIndex - 1);
            }
        }

        touchStartX = 0;
    });
});