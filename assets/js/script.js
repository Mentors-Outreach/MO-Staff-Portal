function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Add form submission handling
document.addEventListener('DOMContentLoaded', () => {
    // Utility function for debouncing
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Announcement slider functionality
    const announcements = document.querySelectorAll('.announcement-card');
    let currentAnnouncement = 0;
    let rotationInterval;

    function rotateAnnouncements() {
        if (!announcements.length) return;
        
        announcements.forEach((announcement, index) => {
            announcement.style.opacity = index === currentAnnouncement ? '1' : '0';
            announcement.style.display = index === currentAnnouncement ? 'block' : 'none';
        });
        currentAnnouncement = (currentAnnouncement + 1) % announcements.length;
    }

    if (announcements.length > 1) {
        // Initial state
        rotateAnnouncements();
        
        // Start rotation with intersection observer
        const announcementSection = document.querySelector('.announcements');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    rotationInterval = setInterval(rotateAnnouncements, 5000);
                } else {
                    clearInterval(rotationInterval);
                }
            });
        }, { threshold: 0.5 });

        if (announcementSection) {
            observer.observe(announcementSection);
        }
    }

    // Category filtering
    const categoryBtns = document.querySelectorAll('.category-btn');
    const linkCards = document.querySelectorAll('.link-card');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.category;
            linkCards.forEach(card => {
                const shouldShow = category === 'all' || card.dataset.category === category;
                card.style.display = shouldShow ? 'flex' : 'none';
            });
        });
    });

    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('#navMenu');

    if (mobileMenuBtn && navMenu) {
        let isMenuOpen = false;

        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            isMenuOpen = !isMenuOpen;
            
            // Force display flex when open
            if (isMenuOpen) {
                navMenu.style.display = 'flex';
                navMenu.style.flexDirection = 'column';
                navMenu.classList.add('active');
                mobileMenuBtn.querySelector('i').className = 'fas fa-times';
            } else {
                navMenu.style.display = 'none';
                navMenu.classList.remove('active');
                mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
            }
            
            console.log('Menu toggled:', isMenuOpen);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                isMenuOpen = false;
                navMenu.style.display = 'none';
                navMenu.classList.remove('active');
                mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
            }
        });

        // Reset menu state on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                isMenuOpen = false;
                navMenu.style.removeProperty('display');
                navMenu.classList.remove('active');
                mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
            } else if (isMenuOpen) {
                navMenu.style.display = 'flex';
                navMenu.style.flexDirection = 'column';
            }
        });
    }

    // Enhanced search functionality
    const searchBar = document.querySelector('.search-bar input');
    if (searchBar) {
        searchBar.setAttribute('placeholder', 'Search portal... (Ctrl + K)');
        
        searchBar.addEventListener('input', debounce((e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const searchableElements = document.querySelectorAll('.link-card, .quick-action');
            
            searchableElements.forEach(element => {
                const text = element.textContent.toLowerCase();
                const isMatch = text.includes(searchTerm);
                
                // Handle different element types
                if (element.classList.contains('link-card')) {
                    element.style.display = isMatch ? 'flex' : 'none';
                } else if (element.classList.contains('quick-action')) {
                    element.style.display = isMatch ? 'flex' : 'none';
                }
            });

            // Show/hide "no results" message
            const noResults = document.querySelector('.no-results');
            const hasVisibleResults = Array.from(searchableElements)
                .some(el => el.style.display !== 'none');

            if (!hasVisibleResults && searchTerm) {
                if (!noResults) {
                    const message = document.createElement('div');
                    message.className = 'no-results';
                    message.innerHTML = `
                        <p>No results found for "${searchTerm}"</p>
                    `;
                    searchBar.parentElement.appendChild(message);
                }
            } else if (noResults) {
                noResults.remove();
            }
        }, 300));

        // Add keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchBar.focus();
            }
        });
    }

    // Accordion functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const icon = header.querySelector('i');
            
            content.classList.toggle('active');
            icon.style.transform = content.classList.contains('active') 
                ? 'rotate(180deg)' 
                : 'rotate(0)';
            icon.style.transition = 'transform 0.3s ease';
        });
    });

    // Banner close functionality
    const bannerClose = document.querySelector('.banner-close');
    if (bannerClose) {
        bannerClose.addEventListener('click', () => {
            const banner = document.querySelector('.banner');
            banner.style.height = banner.offsetHeight + 'px';
            banner.style.transition = 'all 0.3s ease';
            
            // Trigger reflow
            banner.offsetHeight;
            
            banner.style.height = '0';
            banner.style.padding = '0';
            banner.style.overflow = 'hidden';
            
            setTimeout(() => {
                banner.style.display = 'none';
            }, 300);
        });
    }

    // Add dark mode functionality
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            themeToggle.querySelector('i').className = 
                `fas fa-${newTheme === 'light' ? 'moon' : 'sun'}`;
        });
    }

    // Add user preferences management
    const UserPreferences = {
        save: function(key, value) {
            localStorage.setItem(`userPref_${key}`, JSON.stringify(value));
        },
        
        load: function(key, defaultValue) {
            const saved = localStorage.getItem(`userPref_${key}`);
            return saved ? JSON.parse(saved) : defaultValue;
        },
        
        // Example preferences
        defaultLayout: 'grid',
        defaultCategory: 'all',
        showNotifications: true
    };

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchBar = document.querySelector('.search-bar input');
            if (searchBar) searchBar.focus();
        }
        
        // Esc to close mobile menu
        if (e.key === 'Escape') {
            const navMenu = document.getElementById('navMenu');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        }
    });

    // Add keyboard shortcut hints
    const searchInput = document.querySelector('.search-bar input');
    searchInput.setAttribute('placeholder', 'Search portal... (Ctrl + K)');

    // Quick Actions Menu
    const quickActions = document.getElementById('quickActions');
    if (!quickActions) return; // Guard clause if element doesn't exist
    
    const trigger = quickActions.querySelector('.quick-actions-trigger');
    const menu = quickActions.querySelector('.quick-actions-menu');
    const actionButtons = quickActions.querySelectorAll('.quick-action');
    const quickActionSearchInput = document.getElementById('quickActionSearch'); // Renamed variable

    // Toggle menu
    trigger.addEventListener('click', () => {
        quickActions.classList.toggle('active');
        if (quickActions.classList.contains('active')) {
            quickActionSearchInput.focus();
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!quickActions.contains(e.target)) {
            quickActions.classList.remove('active');
        }
    });

    // Search functionality
    quickActionSearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        actionButtons.forEach(button => {
            const text = button.querySelector('span').textContent.toLowerCase();
            button.style.display = text.includes(searchTerm) ? 'flex' : 'none';
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Global search shortcut (Ctrl+K)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            quickActions.classList.add('active');
            quickActionSearchInput.focus();
        }

        // Close menu with Escape
        if (e.key === 'Escape') {
            quickActions.classList.remove('active');
        }
    });

    // Handle action clicks
    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            handleQuickAction(action);
            quickActions.classList.remove('active');
        });
    });
});

// Handle different quick actions
function handleQuickAction(action) {
    switch (action) {
        case 'search':
            // Implement global search
            document.querySelector('.search-bar input').focus();
            break;
        case 'notifications':
            // Navigate to notifications
            window.location.href = 'https://social.mentorsoutreach.org/account/notifications';
            break;
        case 'create-post':
            // Open create post modal/page
            window.location.href = 'https://social.mentorsoutreach.org/feed';
            break;
        case 'messages':
            // Navigate to messages
            window.location.href = 'https://social.mentorsoutreach.org/messages';
            break;
        case 'calendar':
            // Navigate to calendar
            window.location.href = 'https://social.mentorsoutreach.org/events';
            break;
        case 'tasks':
            // Navigate to tasks
            window.location.href = 'https://social.mentorsoutreach.org/c/getting-started/new-here-please-read-me-first';
            break;
        case 'settings':
            // Navigate to settings
            window.location.href = 'https://social.mentorsoutreach.org/account';
            break;
        case 'help':
            // Open help center
            window.location.href = 'https://social.mentorsoutreach.org/c/getting-started/';
            break;
        default:
            console.log('Action not implemented:', action);
    }
}

// Add offline support notification
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus(event) {
    const status = navigator.onLine ? 'online' : 'offline';
    if (status === 'offline') {
        showNotification('You are currently offline. Some features may be limited.');
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'status-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Keyboard shortcuts for quick actions
document.addEventListener('keydown', function(e) {
    // Check if Ctrl key is pressed
    if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
            case 'k':
                e.preventDefault();
                triggerQuickAction('search');
                break;
            case 'n':
                e.preventDefault();
                triggerQuickAction('notifications');
                break;
            case 'p':
                e.preventDefault();
                triggerQuickAction('create-post');
                break;
            case 'm':
                e.preventDefault();
                triggerQuickAction('messages');
                break;
            case 'e':
                e.preventDefault();
                triggerQuickAction('calendar');
                break;
            case 't':
                e.preventDefault();
                triggerQuickAction('tasks');
                break;
            case ',':
                e.preventDefault();
                triggerQuickAction('settings');
                break;
            case 'h':
                e.preventDefault();
                triggerQuickAction('help');
                break;
        }
    }
});

// Function to trigger quick action
function triggerQuickAction(action) {
    const button = document.querySelector(`[data-action="${action}"]`);
    if (button) {
        button.click();
        // You can add specific functionality for each action here
        console.log(`Quick action triggered: ${action}`);
    }
}

// Toggle quick actions menu
const quickActionsTrigger = document.querySelector('.quick-actions-trigger');
const quickActionsMenu = document.querySelector('.quick-actions-menu');

if (quickActionsTrigger && quickActionsMenu) {
    quickActionsTrigger.addEventListener('click', () => {
        quickActionsMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.quick-actions')) {
            quickActionsMenu.classList.remove('active');
        }
    });
}

// Add this function to your existing script.js file

// Function to fetch and update blog posts
async function fetchLatestUpdates() {
    setLoadingState(true);
    try {
        // Instead of fetching from the blog, we'll use a static announcement
        const announcementSlider = document.querySelector('.announcement-slider');
        if (!announcementSlider) return;
        
        // Clear existing announcements
        announcementSlider.innerHTML = '';
        
        // Create a static announcement card
        const card = document.createElement('div');
        card.className = 'announcement-card';
        card.innerHTML = `
            <div class="announcement-badge">Notice</div>
            <span class="date">${new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}</span>
            <h3>Welcome to the Portal</h3>
            <p>Stay tuned for updates and announcements. Visit our website for the latest news and information.</p>
            <a href="https://mentorsoutreach.org" class="learn-more-btn" target="_blank" rel="noopener noreferrer">
                <span>Visit Website</span>
                <i class="fas fa-external-link-alt"></i>
            </a>
        `;
        
        announcementSlider.appendChild(card);
        
    } catch (error) {
        console.error('Error updating announcements:', error);
        const slider = document.querySelector('.announcement-slider');
        if (slider) {
            slider.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>Unable to load announcements. Please check back later.</span>
                </div>
            `;
        }
    } finally {
        setLoadingState(false);
    }
}
// Function to initialize announcement rotation
function initializeAnnouncementRotation() {
    const announcements = document.querySelectorAll('.announcement-card');
    let currentAnnouncement = 0;
    let rotationInterval;

    function rotateAnnouncements() {
        if (!announcements.length) return;
        
        announcements.forEach((announcement, index) => {
            announcement.style.opacity = index === currentAnnouncement ? '1' : '0';
            announcement.style.display = index === currentAnnouncement ? 'block' : 'none';
        });
        currentAnnouncement = (currentAnnouncement + 1) % announcements.length;
    }

    // Initial state
    if (announcements.length > 1) {
        rotateAnnouncements();
        
        // Start rotation with intersection observer
        const announcementSection = document.querySelector('.announcements');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    rotationInterval = setInterval(rotateAnnouncements, 5000);
                } else {
                    clearInterval(rotationInterval);
                }
            });
        }, { threshold: 0.5 });

        if (announcementSection) {
            observer.observe(announcementSection);
        }
    }
}

// Call fetchLatestUpdates when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchLatestUpdates();
    
    // Fetch updates every 5 minutes
    setInterval(fetchLatestUpdates, 5 * 60 * 1000);
});

// Add loading state handling
function setLoadingState(isLoading) {
    const slider = document.querySelector('.announcement-slider');
    if (!slider) return;
    
    if (isLoading) {
        slider.classList.add('loading');
        slider.innerHTML = `
            <div class="loading-indicator">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Loading updates...</span>
            </div>
        `;
    } else {
        slider.classList.remove('loading');
    }
}

// Replace the fetchBlogPosts function with this simpler version
function updateAnnouncements() {
    const announcementSlider = document.querySelector('.announcement-slider');
    if (!announcementSlider) return;

    // Clear any existing content
    announcementSlider.innerHTML = '';

    // Static announcement data
    const announcement = {
        title: "We are celebrating 1400+ in Mentors Outreach!",
        date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        content: "Celebrating over 1400+ incredible people who have joined the Mentors Outreach community.",
        link: "https://mentorsoutreach.org/blog/"
    };

    // Create single announcement card
    const card = document.createElement('div');
    card.className = 'announcement-card';
    card.innerHTML = `
        <div class="announcement-badge">New</div>
        <span class="date">
            <i class="fas fa-calendar-alt"></i>
            ${announcement.date}
        </span>
        <h3>${announcement.title}</h3>
        <p>${announcement.content}</p>
        <a href="${announcement.link}" class="learn-more-btn" target="_blank" rel="noopener">
            <span>Read More</span>
            <i class="fas fa-external-link-alt"></i>
        </a>
    `;

    // Add the single card to the slider
    announcementSlider.appendChild(card);
}
// Update the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // Initialize announcements
    updateAnnouncements();
    
    // Rest of your existing code...
});

// Add this inside your DOMContentLoaded event listener
const toolsSection = document.querySelector('.productivity-tools');
if (toolsSection) {
    const filterBtns = toolsSection.querySelectorAll('.filter-btn');
    const toolCards = toolsSection.querySelectorAll('.tool-card');
    const itemsPerPage = 8;
    let currentPage = 1;
    let filteredCards = [...toolCards];

    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter cards
            filteredCards = [...toolCards].filter(card => {
                const categories = card.dataset.category.split(',');
                return filter === 'all' || categories.includes(filter);
            });
            
            // Reset pagination
            currentPage = 1;
            updateToolsDisplay();
        });
    });

    // Pagination functionality
    function updateToolsDisplay() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const totalPages = Math.ceil(filteredCards.length / itemsPerPage);

        // Update pagination info
        document.getElementById('itemsShown').textContent = 
            Math.min(endIndex, filteredCards.length);
        document.getElementById('totalItems').textContent = filteredCards.length;

        // Update pagination buttons
        document.getElementById('prevPage').disabled = currentPage === 1;
        document.getElementById('nextPage').disabled = currentPage === totalPages;

        // Show/hide cards
        toolCards.forEach(card => card.style.display = 'none');
        filteredCards.slice(startIndex, endIndex).forEach(card => {
            card.style.display = 'flex';
        });
    }

    // Pagination button handlers
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updateToolsDisplay();
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            updateToolsDisplay();
        }
    });

    // Initial display
    updateToolsDisplay();
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Single DOMContentLoaded event listener for all initializations
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing...');

    // Initialize Mobile Menu
    const mobileMenuBtn = document.querySelector('.md\\:hidden');
    const navMenu = document.querySelector('.md\\:flex');
    
    if (mobileMenuBtn && navMenu) {
        let isMenuOpen = false;

        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            isMenuOpen = !isMenuOpen;
            
            if (isMenuOpen) {
                navMenu.classList.remove('hidden');
                navMenu.classList.add('flex', 'flex-col', 'absolute', 'top-full', 'left-0', 'w-full', 'bg-white', 'shadow-lg', 'p-4');
                mobileMenuBtn.querySelector('i').className = 'fas fa-times';
            } else {
                navMenu.classList.add('hidden');
                navMenu.classList.remove('flex', 'flex-col', 'absolute');
                mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                isMenuOpen = false;
                navMenu.classList.add('hidden');
                navMenu.classList.remove('flex', 'flex-col', 'absolute');
                mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) {
                isMenuOpen = false;
                navMenu.classList.remove('hidden', 'flex', 'flex-col', 'absolute');
                navMenu.classList.add('md:flex');
                mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
            } else if (isMenuOpen) {
                navMenu.classList.remove('hidden');
                navMenu.classList.add('flex', 'flex-col', 'absolute');
            }
        });
    }

    // Initialize Search - Fixed selector
    const searchInput = document.querySelector('.md\\:flex input[type="text"]');
    if (searchInput) {
        searchInput.setAttribute('placeholder', 'Search portal... (Ctrl + K)');
        
        // Add keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
        });
    }

    // Initialize Quick Actions Menu
    const quickActions = document.getElementById('quickActions');
    if (quickActions) {
        const trigger = quickActions.querySelector('.quick-actions-trigger');
        const menu = quickActions.querySelector('.quick-actions-menu');
        const quickActionSearch = document.getElementById('quickActionSearch');

        if (trigger && menu && quickActionSearch) {
            let isMenuOpen = false;

            // Handle Quick Action clicks
            const actionButtons = quickActions.querySelectorAll('.quick-action');
            actionButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const action = button.dataset.action;
                    handleQuickAction(action);
                    isMenuOpen = false;
                    menu.style.display = 'none';
                });
            });

            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                isMenuOpen = !isMenuOpen;
                menu.style.display = isMenuOpen ? 'block' : 'none';
                if (isMenuOpen) {
                    quickActionSearch.focus();
                }
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (isMenuOpen && !quickActions.contains(e.target)) {
                    isMenuOpen = false;
                    menu.style.display = 'none';
                }
            });
        }
    }
});

// Handle Quick Actions
function handleQuickAction(action) {
    switch (action) {
        case 'search':
            document.querySelector('.md\\:flex input[type="text"]')?.focus();
            break;
        case 'notifications':
            window.location.href = 'https://social.mentorsoutreach.org/account/notifications';
            break;
        case 'create-post':
            window.location.href = 'https://social.mentorsoutreach.org/feed';
            break;
        case 'messages':
            window.location.href = 'https://social.mentorsoutreach.org/messages';
            break;
        case 'calendar':
            window.location.href = 'https://social.mentorsoutreach.org/events';
            break;
        case 'tasks':
            window.location.href = 'https://social.mentorsoutreach.org/c/getting-started/new-here-please-read-me-first';
            break;
        case 'settings':
            window.location.href = 'https://social.mentorsoutreach.org/account';
            break;
        case 'help':
            window.location.href = 'https://social.mentorsoutreach.org/c/getting-started/';
            break;
        default:
            console.log('Action not implemented:', action);
    }
}

// Mobile Menu Functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-right');
    const menuIcon = mobileMenuBtn?.querySelector('i');
    
    if (!mobileMenuBtn || !navMenu) {
        console.error('Mobile menu elements not found');
        return;
    }

    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            navMenu.classList.add('active');
            menuIcon.className = 'fas fa-times';
            // Force display flex when open
            navMenu.style.display = 'flex';
        } else {
            navMenu.classList.remove('active');
            menuIcon.className = 'fas fa-bars';
            // Add a small delay to allow for animation
            setTimeout(() => {
                if (!isMenuOpen) { // Check again in case menu was reopened
                    navMenu.style.display = 'none';
                }
            }, 300);
        }
    }

    // Toggle menu on button click
    mobileMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            toggleMenu();
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && isMenuOpen) {
            isMenuOpen = false;
            navMenu.classList.remove('active');
            menuIcon.className = 'fas fa-bars';
            navMenu.style.removeProperty('display');
        }
    });
}

// Make sure to call initializeMobileMenu when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeMobileMenu();
});

// Announcements Functionality
function initializeAnnouncements() {
    const announcements = document.querySelectorAll('.announcement-card');
    if (!announcements.length) {
        console.log('No announcements found');
        return;
    }
    // ... rest of announcements code
}

// Category Filters Functionality
function initializeCategoryFilters() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const linkCards = document.querySelectorAll('.link-card');
    if (!categoryBtns.length || !linkCards.length) {
        console.log('Category filter elements not found');
        return;
    }
    // ... rest of category filters code
}

// Search Functionality
function initializeSearch() {
    const searchBar = document.querySelector('.search-bar input');
    if (!searchBar) {
        console.log('Search bar not found');
        return;
    }
    // ... rest of search code
}

// Quick Links Functionality
function initializeQuickLinks() {
    const quickLinksSection = document.querySelector('.quick-links');
    if (!quickLinksSection) {
        console.log('Quick links section not found');
        return;
    }

    // Quick Links pagination setup
    const linkCards = quickLinksSection.querySelectorAll('.link-card');
    const itemsPerPage = 8; // Fixed at 8 items per page
    let currentPage = 1;
    let filteredCards = [...linkCards];

    // Category filtering with pagination
    const categoryBtns = quickLinksSection.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter cards
            filteredCards = [...linkCards].filter(card => {
                return category === 'all' || card.dataset.category === category;
            });
            
            // Reset to first page when filtering
            currentPage = 1;
            updateQuickLinksDisplay();
        });
    });

    // Pagination functionality
    function updateQuickLinksDisplay() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const totalPages = Math.ceil(filteredCards.length / itemsPerPage);

        // Update pagination info
        const itemsShown = quickLinksSection.querySelector('.items-shown');
        const totalItems = quickLinksSection.querySelector('.total-items');
        if (itemsShown && totalItems) {
            itemsShown.textContent = Math.min(endIndex, filteredCards.length);
            totalItems.textContent = filteredCards.length;
        }

        // Update pagination buttons
        const prevBtn = quickLinksSection.querySelector('.prev-page');
        const nextBtn = quickLinksSection.querySelector('.next-page');
        if (prevBtn && nextBtn) {
            prevBtn.disabled = currentPage === 1;
            nextBtn.disabled = currentPage === totalPages;
        }

        // Show/hide cards
        linkCards.forEach(card => card.style.display = 'none');
        filteredCards.slice(startIndex, endIndex).forEach(card => {
            card.style.display = 'flex';
        });

        console.log('Quick Links display updated:', {
            currentPage,
            totalPages,
            visibleCards: filteredCards.slice(startIndex, endIndex).length
        });
    }

    // Add pagination button handlers
    const prevBtn = quickLinksSection.querySelector('.prev-page');
    const nextBtn = quickLinksSection.querySelector('.next-page');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updateQuickLinksDisplay();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                updateQuickLinksDisplay();
            }
        });
    }

    // Initial display
    updateQuickLinksDisplay();
    console.log('Quick Links initialization complete');
}

// Tools Section Functionality
function initializeToolsSection() {
    const toolsSection = document.querySelector('.productivity-tools');
    if (!toolsSection) {
        console.log('Tools section not found');
        return;
    }
    // ... rest of tools section code
}

// Error Handler
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    // Add error handling logic here
}

