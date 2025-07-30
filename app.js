// Real-time contest data based on current poetry contest landscape
function generateCurrentContests() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Generate realistic deadlines for upcoming months
    const contests = [
        {
            id: 1,
            name: "Rattle Poetry Prize",
            organization: "Rattle Magazine",
            deadline: getNextDeadline(currentDate, 7, 15), // July 15th
            prize: 15000,
            fee: 25,
            url: "https://rattle.com/page/poetryprize/",
            favicon: "R",
            description: "$15,000 for a single poem plus publication. Ten finalists receive $500 each.",
            entryFee: "One-year subscription"
        },
        {
            id: 2,
            name: "National Poetry Competition",
            organization: "The Poetry Society",
            deadline: getNextDeadline(currentDate, 10, 31), // October 31st
            prize: 5000,
            fee: 8,
            url: "https://poetrysociety.org.uk/competitions/national-poetry-competition/",
            favicon: "P",
            description: "One of the world's most prestigious poetry prizes. £5,000 first prize.",
            entryFee: "£8 first poem"
        },
        {
            id: 3,
            name: "Tom Howard Poetry Contest",
            organization: "Winning Writers",
            deadline: getNextDeadline(currentDate, 9, 30), // September 30th
            prize: 3000,
            fee: 25,
            url: "https://winningwriters.com/our-contests/tom-howard-margaret-reid-poetry-contest",
            favicon: "W",
            description: "$3,000 first prize. Accepts both published and unpublished poetry.",
            entryFee: "$25"
        },
        {
            id: 4,
            name: "Button Poetry First Book Contest",
            organization: "Button Poetry",
            deadline: getNextDeadline(currentDate, 6, 8), // June 8th
            prize: 1000,
            fee: 25,
            url: "https://buttonpoetry.submittable.com/submit",
            favicon: "B",
            description: "Publication plus $1,000 for unpublished full-length manuscript",
            entryFee: "$25"
        },
        {
            id: 5,
            name: "William Matthews Poetry Prize",
            organization: "Asheville Poetry Review",
            deadline: getNextDeadline(currentDate, 8, 31), // August 31st
            prize: 1000,
            fee: 25,
            url: "https://ashevillereview.com/contests/",
            favicon: "A",
            description: "$1,000 and publication in Asheville Poetry Review",
            entryFee: "$25"
        },
        {
            id: 6,
            name: "Magma Poetry Competition",
            organization: "Magma Poetry",
            deadline: getNextDeadline(currentDate, 9, 30), // September 30th
            prize: 1000,
            fee: 15,
            url: "https://magmapoetry.com/competitions/",
            favicon: "M",
            description: "£1000 first prize, £300 second, £150 third",
            entryFee: "£15"
        },
        {
            id: 7,
            name: "Red Wheelbarrow Poetry Prize",
            organization: "Red Wheelbarrow Literary Magazine",
            deadline: getNextDeadline(currentDate, 7, 31), // July 31st
            prize: 1000,
            fee: 15,
            url: "https://redwheelbarrow.submittable.com/submit",
            favicon: "R",
            description: "$1,000 first place plus letterpress broadside",
            entryFee: "$15"
        },
        {
            id: 8,
            name: "Narrative Poetry Contest",
            organization: "Narrative Magazine",
            deadline: getNextDeadline(currentDate, 7, 18), // July 18th
            prize: 1500,
            fee: 26,
            url: "https://www.narrativemagazine.com/submission",
            favicon: "N",
            description: "$1,500 plus publication in Narrative Magazine",
            entryFee: "$26"
        },
        {
            id: 9,
            name: "Academy of American Poets Contest",
            organization: "Academy of American Poets",
            deadline: getNextDeadline(currentDate, 11, 1), // November 1st
            prize: 2500,
            fee: 20,
            url: "https://poets.org/academy-american-poets-prize",
            favicon: "A",
            description: "$2,500 for outstanding achievement in poetry",
            entryFee: "$20"
        },
        {
            id: 10,
            name: "Four Way Books Poetry Prize",
            organization: "Four Way Books",
            deadline: getNextDeadline(currentDate, 3, 31), // March 31st
            prize: 1000,
            fee: 25,
            url: "https://fourwaybooks.com/site/levis-prize/",
            favicon: "F",
            description: "$1,000 and publication for poetry collection",
            entryFee: "$25"
        }
    ];

    // Filter out contests with past deadlines and return only future ones
    return contests.filter(contest => {
        const deadline = new Date(contest.deadline);
        return deadline > currentDate;
    });
}

// Helper function to get next occurrence of a month/day deadline
function getNextDeadline(currentDate, targetMonth, targetDay) {
    const currentYear = currentDate.getFullYear();
    let targetYear = currentYear;

    // Create target date for current year
    let targetDate = new Date(targetYear, targetMonth - 1, targetDay);

    // If the target date has already passed this year, use next year
    if (targetDate <= currentDate) {
        targetYear++;
        targetDate = new Date(targetYear, targetMonth - 1, targetDay);
    }

    // Format as YYYY-MM-DD
    return targetDate.toISOString().split('T')[0];
}

const sampleContests = generateCurrentContests();

// App state
let currentDate = new Date();
let contests = [...sampleContests];
let filteredContests = [...sampleContests];
let poems = [];
let filteredPoems = [];
let userProfile = {};
let submissions = [];
let currentTheme = localStorage.getItem('theme') || 'system';
let activeFilters = {
    prize: '',
    fee: '',
    deadline: ''
};

// Initialize app
document.addEventListener('DOMContentLoaded', function () {
    // Set current date to today (not April 2025)
    currentDate = new Date();

    initializeTheme();
    generateCalendar();
    initializeEventListeners();
    loadSavedContests();
    loadPoems();
    loadUserProfile();
    loadSubmissions();
    updateAppStats();

    // Initialize filter panel as hidden
    const filterPanel = document.getElementById('filterPanel');
    if (filterPanel) {
        filterPanel.style.display = 'none';
    }

    // Add submissions tab after DOM is ready
    setTimeout(addSubmissionsTab, 100);
});

// Theme Management
function initializeTheme() {
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.value = currentTheme;
    }
    applyTheme(currentTheme);
}

function applyTheme(theme) {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');

    body.removeAttribute('data-theme');

    if (theme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        if (themeToggle) themeToggle.textContent = '☀️';
    } else if (theme === 'light') {
        if (themeToggle) themeToggle.textContent = '🌙';
    } else { // system
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            body.setAttribute('data-theme', 'dark');
            if (themeToggle) themeToggle.textContent = '☀️';
        } else {
            if (themeToggle) themeToggle.textContent = '🌙';
        }
    }
}

function toggleTheme() {
    const themes = ['system', 'light', 'dark'];
    const currentIndex = themes.indexOf(currentTheme);
    currentTheme = themes[(currentIndex + 1) % themes.length];

    localStorage.setItem('theme', currentTheme);
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.value = currentTheme;
    }
    applyTheme(currentTheme);
}

// Data Loading Functions
function loadSavedContests() {
    const saved = localStorage.getItem('poetryContests');
    if (saved) {
        try {
            const savedContests = JSON.parse(saved);
            contests = [...sampleContests, ...savedContests];
            filteredContests = [...contests];
            generateCalendar();
        } catch (error) {
            console.error('Error loading saved contests:', error);
        }
    }
}

function saveContests() {
    try {
        const contestsToSave = contests.filter(contest =>
            !sampleContests.some(sample => sample.id === contest.id)
        );
        localStorage.setItem('poetryContests', JSON.stringify(contestsToSave));
        localStorage.setItem('lastContestSearch', new Date().toISOString());
    } catch (error) {
        console.error('Error saving contests:', error);
    }
}

function loadPoems() {
    const saved = localStorage.getItem('poetryPoems');
    if (saved) {
        try {
            poems = JSON.parse(saved);
            filteredPoems = [...poems];
            renderPoems();
        } catch (error) {
            console.error('Error loading poems:', error);
        }
    }
}

function savePoems() {
    try {
        localStorage.setItem('poetryPoems', JSON.stringify(poems));
        updateAppStats();
    } catch (error) {
        console.error('Error saving poems:', error);
    }
}

function loadUserProfile() {
    const saved = localStorage.getItem('poetryProfile');
    if (saved) {
        try {
            userProfile = JSON.parse(saved);
            populateProfileForm();
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }
}

function saveUserProfile() {
    try {
        localStorage.setItem('poetryProfile', JSON.stringify(userProfile));
        showNotification('Profile saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving profile:', error);
        showNotification('Error saving profile', 'error');
    }
}

function loadSubmissions() {
    const saved = localStorage.getItem('poetrySubmissions');
    if (saved) {
        try {
            submissions = JSON.parse(saved);
        } catch (error) {
            console.error('Error loading submissions:', error);
        }
    }
}

function saveSubmissions() {
    try {
        localStorage.setItem('poetrySubmissions', JSON.stringify(submissions));
    } catch (error) {
        console.error('Error saving submissions:', error);
    }
}

// Event Listeners
function initializeEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            const tabName = this.dataset.tab;
            switchTab(tabName);
        });
    });

    // Calendar navigation
    const prevMonth = document.getElementById('prevMonth');
    const nextMonth = document.getElementById('nextMonth');

    if (prevMonth) {
        prevMonth.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            generateCalendar();
        });
    }

    if (nextMonth) {
        nextMonth.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            generateCalendar();
        });
    }

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    const themeSelect = document.getElementById('themeSelect');

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    if (themeSelect) {
        themeSelect.addEventListener('change', function () {
            currentTheme = this.value;
            localStorage.setItem('theme', currentTheme);
            applyTheme(currentTheme);
        });
    }

    // Contest management
    const addContest = document.getElementById('addContest');
    const searchContestsBtn = document.getElementById('searchContests'); // Renamed to avoid conflict
    const filterContestsBtn = document.getElementById('filterContests'); // Renamed to avoid conflict
    const applyFiltersBtn = document.getElementById('applyFilters'); // Renamed to avoid conflict
    const clearFiltersBtn = document.getElementById('clearFilters'); // Renamed to avoid conflict

    if (addContest) {
        addContest.addEventListener('click', addCustomContest);
    }

    if (searchContestsBtn) { // Use renamed variable
        searchContestsBtn.addEventListener('click', searchContests);
    }

    if (filterContestsBtn) { // Use renamed variable
        filterContestsBtn.addEventListener('click', toggleFilterPanel);
    }

    if (applyFiltersBtn) { // Use renamed variable
        applyFiltersBtn.addEventListener('click', applyFilters);
    }

    if (clearFiltersBtn) { // Use renamed variable
        clearFiltersBtn.addEventListener('click', clearFilters);
    }

    // Poem management
    const addNewPoemBtn = document.getElementById('addNewPoem');
    const importPoemsBtn = document.getElementById('importPoems');
    const poemSearch = document.getElementById('poemSearch');
    const tagFilter = document.getElementById('tagFilter');
    const sortPoems = document.getElementById('sortPoems');

    if (addNewPoemBtn) {
        addNewPoemBtn.addEventListener('click', () => addNewPoem()); // Call without ID for new poem
    }

    if (importPoemsBtn) {
        importPoemsBtn.addEventListener('click', importPoems);
    }

    if (poemSearch) {
        poemSearch.addEventListener('input', filterPoems);
    }

    if (tagFilter) {
        tagFilter.addEventListener('change', filterPoems);
    }

    if (sortPoems) {
        sortPoems.addEventListener('change', filterPoems);
    }

    // Profile management
    const saveProfileBtn = document.getElementById('saveProfile'); // Renamed
    const profilePhotoInput = document.getElementById('profilePhotoInput');
    const authorBio = document.getElementById('authorBio');

    if (saveProfileBtn) { // Use renamed variable
        saveProfileBtn.addEventListener('click', saveProfile);
    }

    if (profilePhotoInput) {
        profilePhotoInput.addEventListener('change', handleProfilePhotoUpload);
    }

    if (authorBio) {
        authorBio.addEventListener('input', updateBioWordCount);
    }

    // Settings
    const exportDataBtn = document.getElementById('exportData'); // Renamed
    const importDataBtn = document.getElementById('importData'); // Renamed
    const clearCacheBtn = document.getElementById('clearCache'); // Renamed
    const resetAppBtn = document.getElementById('resetApp'); // Renamed

    if (exportDataBtn) { // Use renamed variable
        exportDataBtn.addEventListener('click', exportData);
    }

    if (importDataBtn) { // Use renamed variable
        importDataBtn.addEventListener('click', importData);
    }

    if (clearCacheBtn) { // Use renamed variable
        clearCacheBtn.addEventListener('click', clearCache);
    }

    if (resetAppBtn) { // Use renamed variable
        resetAppBtn.addEventListener('click', resetApp);
    }
}

function renderPoems() {
    const grid = document.getElementById('poemsGrid');
    const noPoems = document.getElementById('noPoemsMessage');

    if (!grid || !noPoems) return;

    if (filteredPoems.length === 0) {
        grid.style.display = 'none';
        noPoems.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    noPoems.style.display = 'none';

    grid.innerHTML = filteredPoems.map(poem => `
        <div class="poem-card" data-poem-id="${poem.id}" style="background: var(--surface); border: 1px solid var(--border); border-radius: 0.75rem; padding: 1.5rem; transition: all 0.2s; cursor: pointer;" onclick="viewPoem('${poem.id}')">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <h3 style="margin: 0; font-size: 1.125rem; font-weight: 600; color: var(--text-primary);">${poem.title}</h3>
                <div style="display: flex; gap: 0.25rem;">
                    <button class="btn" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="event.stopPropagation(); editPoem('${poem.id}')">✏️</button>
                    <button class="btn" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="event.stopPropagation(); deletePoem('${poem.id}')">🗑️</button>
                </div>
            </div>

            <div style="background: var(--background); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; font-family: 'Georgia', serif; line-height: 1.5; font-size: 0.875rem; color: var(--text-secondary); max-height: 120px; overflow: hidden; position: relative;">
                ${poem.text.split('\n').slice(0, 6).join('\n')}
                ${poem.lineCount > 6 ? '<div style="position: absolute; bottom: 0; right: 0; background: var(--background); padding: 0.25rem;">...</div>' : ''}
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
                <span style="background: ${getStatusColor(poem.status)}; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 500;">${poem.status}</span>
                <span style="background: var(--background); color: var(--text-secondary); padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">${poem.category}</span>
                ${poem.tags.slice(0, 2).map(tag => `<span style="background: var(--primary); color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">#${tag}</span>`).join('')}
                ${poem.tags.length > 2 ? `<span style="background: var(--text-secondary); color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">+${poem.tags.length - 2}</span>` : ''}
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-secondary);">
                <span>${poem.wordCount} words • ${poem.lineCount} lines</span>
                <span>Modified ${new Date(poem.modified).toLocaleDateString()}</span>
            </div>
        </div>
    `).join('');

    // Add hover effects
    grid.querySelectorAll('.poem-card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
}

function getStatusColor(status) {
    const colors = {
        'draft': '#6b7280',
        'ready': '#059669',
        'submitted': '#2563eb',
        'published': '#7c3aed'
    };
    return colors[status] || '#6b7280';
}

function viewPoem(poemId) {
    const poem = poems.find(p => p.id === poemId);
    if (!poem) return;

    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header">
                <div class="modal-favicon">📖</div>
                <div>
                    <div class="modal-title">${poem.title}</div>
                    <div class="modal-organization">${poem.category} • ${poem.wordCount} words</div>
                </div>
            </div>

            <div style="margin: 1.5rem 0;">
                <div style="background: var(--background); padding: 1.5rem; border-radius: 0.5rem; font-family: 'Georgia', serif; line-height: 1.8; white-space: pre-wrap; font-size: 1rem; word-wrap: break-word; overflow-wrap: break-word;">
                    ${poem.htmlContent ? poem.htmlContent : poem.text.replace(/\n/g, '<br>')}
                </div>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1rem 0;">
                <span style="background: ${getStatusColor(poem.status)}; color: white; padding: 0.25rem 0.75rem; border-radius: 0.375rem; font-size: 0.875rem; font-weight: 500;">${poem.status}</span>
                ${poem.tags.map(tag => `<span style="background: var(--primary); color: white; padding: 0.25rem 0.75rem; border-radius: 0.375rem; font-size: 0.875rem;">#${tag}</span>`).join('')}
            </div>

            ${poem.notes ? `
                <div style="margin: 1rem 0;">
                    <h4 style="margin-bottom: 0.5rem;">Notes:</h4>
                    <div style="background: var(--background); padding: 1rem; border-radius: 0.5rem; font-size: 0.875rem;">${poem.notes}</div>
                </div>
            ` : ''}

            <div style="font-size: 0.875rem; color: var(--text-secondary); margin: 1rem 0;">
                <div>Created: ${new Date(poem.created).toLocaleString()}</div>
                <div>Modified: ${new Date(poem.modified).toLocaleString()}</div>
            </div>

            <div class="modal-actions">
                <button class="btn" onclick="this.closest('.modal').remove()">Close</button>
                <button class="btn" onclick="this.closest('.modal').remove(); editPoem('${poem.id}')">Edit</button>
                <button class="btn btn-primary" onclick="this.closest('.modal').remove(); submitToContests('${poem.id}')">Submit to Contests</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function editPoem(poemId) {
    // Open the form with the existing poem's ID
    addNewPoem(poemId);
}

// Modified addNewPoem to accept an optional poemId for editing
function addNewPoem(poemIdToEdit = null) {
    const existingPoem = poemIdToEdit ? poems.find(p => p.id === poemIdToEdit) : null;

    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content" data-poem-id="${existingPoem ? existingPoem.id : ''}" style="max-width: 800px; max-height: 95vh; overflow-y: auto;">
            <div class="modal-header">
                <div class="modal-favicon">📝</div>
                <div>
                    <div class="modal-title">${existingPoem ? 'Edit Poem' : 'New Poem'}</div>
                    <div class="modal-organization">${existingPoem ? 'Update your poem' : 'Create a new poem for submissions'}</div>
                </div>
            </div>

            <form id="poemForm" style="display: flex; flex-direction: column; gap: 1rem;">
                <div>
                    <label style="display: block; margin-bottom: 0.25rem; font-weight: 500;">Title *</label>
                    <input type="text" id="poemTitle" required value="${existingPoem ? existingPoem.title : ''}" style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; background: var(--surface); color: var(--text-primary);">
                </div>

                <div>
                    <label style="display: block; margin-bottom: 0.25rem; font-weight: 500;">Poem Text *</label>

                    <!-- Formatting Toolbar -->
                    <div id="formatToolbar" style="display: flex; flex-wrap: wrap; gap: 0.25rem; padding: 0.5rem; background: var(--background); border: 1px solid var(--border); border-bottom: none; border-radius: 0.375rem 0.375rem 0 0;">
                        <!-- Text Formatting -->
                        <button type="button" class="format-btn" data-command="bold" title="Bold (Ctrl+B)" style="padding: 0.25rem 0.5rem; border: 1px solid var(--border); background: var(--surface); border-radius: 0.25rem; cursor: pointer; font-weight: bold;">B</button>
                        <button type="button" class="format-btn" data-command="italic" title="Italic (Ctrl+I)" style="padding: 0.25rem 0.5rem; border: 1px solid var(--border); background: var(--surface); border-radius: 0.25rem; cursor: pointer; font-style: italic;">I</button>
                        <button type="button" class="format-btn" data-command="underline" title="Underline (Ctrl+U)" style="padding: 0.25rem 0.5rem; border: 1px solid var(--border); background: var(--surface); border-radius: 0.25rem; cursor: pointer; text-decoration: underline;">U</button>

                        <div style="width: 1px; height: 24px; background: var(--border); margin: 0 0.25rem;"></div>

                        <!-- Font Family -->
                        <select id="fontFamily" title="Font Family" style="padding: 0.25rem; border: 1px solid var(--border); background: var(--surface); border-radius: 0.25rem; font-size: 0.875rem;">
                            <option value="'Georgia', serif">Georgia (Serif)</option>
                            <option value="'Times New Roman', serif">Times New Roman</option>
                            <option value="Arial, sans-serif">Arial (Sans-serif)</option>
                            <option value="'Helvetica Neue', sans-serif">Helvetica</option>
                            <option value="'Courier New', monospace">Courier (Monospace)</option>
                            <option value="'Monaco', monospace">Monaco</option>
                            <option value="'Roboto', sans-serif">Roboto</option>
                        </select>

                        <!-- Font Size -->
                        <select id="fontSize" title="Font Size" style="padding: 0.25rem; border: 1px solid var(--border); background: var(--surface); border-radius: 0.25rem; font-size: 0.875rem;">
                            <option value="12px">12px</option>
                            <option value="14px">14px</option>
                            <option value="16px" selected>16px</option>
                            <option value="18px">18px</option>
                            <option value="20px">20px</option>
                            <option value="24px">24px</option>
                            <option value="28px">28px</option>
                            <option value="32px">32px</option>
                        </select>

                        <div style="width: 1px; height: 24px; background: var(--border); margin: 0 0.25rem;"></div>

                        <!-- Alignment -->
                        <button type="button" class="format-btn" data-command="justifyLeft" title="Align Left" style="padding: 0.25rem 0.5rem; border: 1px solid var(--border); background: var(--surface); border-radius: 0.25rem; cursor: pointer;">⬅</button>
                        <button type="button" class="format-btn" data-command="justifyCenter" title="Center" style="padding: 0.25rem 0.5rem; border: 1px solid var(--border); background: var(--surface); border-radius: 0.25rem; cursor: pointer;">⬄</button>
                        <button type="button" class="format-btn" data-command="justifyRight" title="Align Right" style="padding: 0.25rem 0.5rem; border: 1px solid var(--border); background: var(--surface); border-radius: 0.25rem; cursor: pointer;">➡</button>

                        <div style="width: 1px; height: 24px; background: var(--border); margin: 0 0.25rem;"></div>

                        <!-- Special formatting -->
                        <button type="button" class="format-btn" id="insertTab" title="Insert Tab" style="padding: 0.25rem 0.5rem; border: 1px solid var(--border); background: var(--surface); border-radius: 0.25rem; cursor: pointer; font-size: 0.75rem;">TAB</button>
                        <button type="button" class="format-btn" data-command="removeFormat" title="Clear Formatting" style="padding: 0.25rem 0.5rem; border: 1px solid var(--border); background: var(--surface); border-radius: 0.25rem; cursor: pointer; font-size: 0.75rem;">✕</button>

                        <div style="width: 1px; height: 24px; background: var(--border); margin: 0 0.25rem;"></div>

                        <!-- View Toggle -->
                        <button type="button" id="toggleView" title="Toggle HTML/Visual View" style="padding: 0.25rem 0.5rem; border: 1px solid var(--border); background: var(--surface); border-radius: 0.25rem; cursor: pointer; font-size: 0.75rem;">&lt;/&gt;</button>
                    </div>

                    <!-- Rich Text Editor -->
                    <div id="poemTextEditor" contenteditable="true" style="min-height: 300px; max-height: 400px; overflow-y: auto; padding: 1rem; border: 1px solid var(--border); border-top: none; border-radius: 0 0 0.375rem 0.375rem; background: var(--surface); color: var(--text-primary); font-family: 'Georgia', serif; font-size: 16px; line-height: 1.8; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word; outline: none;" placeholder="Enter your poem here..."></div>

                    <!-- HTML Source View (hidden by default) -->
                    <textarea id="poemTextHTML" style="display: none; min-height: 300px; max-height: 400px; padding: 1rem; border: 1px solid var(--border); border-top: none; border-radius: 0 0 0.375rem 0.375rem; background: var(--surface); color: var(--text-primary); font-family: 'Courier New', monospace; font-size: 14px; resize: vertical; white-space: pre-wrap; word-wrap: break-word; outline: none;" placeholder="HTML source code..."></textarea>

                    <div style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.25rem; display: flex; justify-content: space-between;">
                        <span><span id="poemWordCount">0</span> words</span>
                        <span><span id="poemLineCount">0</span> lines</span>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                    <div>
                        <label style="display: block; margin-bottom: 0.25rem; font-weight: 500;">Category</label>
                        <select id="poemCategory" style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; background: var(--surface); color: var(--text-primary);">
                            <option value="free-verse">Free Verse</option>
                            <option value="sonnet">Sonnet</option>
                            <option value="haiku">Haiku</option>
                            <option value="ballad">Ballad</option>
                            <option value="narrative">Narrative</option>
                            <option value="lyric">Lyric</option>
                            <option value="experimental">Experimental</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 0.25rem; font-weight: 500;">Status</label>
                        <select id="poemStatus" style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; background: var(--surface); color: var(--text-primary);">
                            <option value="draft">Draft</option>
                            <option value="ready">Ready to Submit</option>
                            <option value="submitted">Submitted</option>
                            <option value="published">Published</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label style="display: block; margin-bottom: 0.25rem; font-weight: 500;">Tags (comma-separated)</label>
                    <input type="text" id="poemTags" placeholder="love, nature, personal, contest2025" value="${existingPoem && existingPoem.tags ? existingPoem.tags.join(', ') : ''}" style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; background: var(--surface); color: var(--text-primary);">
                </div>

                <div>
                    <label style="display: block; margin-bottom: 0.25rem; font-weight: 500;">Notes</label>
                    <textarea id="poemNotes" rows="3" placeholder="Notes about this poem, inspiration, contest targets..." style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; background: var(--surface); color: var(--text-primary); resize: vertical;">${existingPoem ? existingPoem.notes : ''}</textarea>
                </div>
            </form>

            <div class="modal-actions">
                <button class="btn" onclick="this.closest('.modal').remove()">Cancel</button>
                <button class="btn" id="saveDraft">Save as Draft</button>
                <button class="btn btn-primary" id="savePoemBtn">${existingPoem ? 'Update Poem' : 'Save Poem'}</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Populate fields if editing existing poem
    if (existingPoem) {
        const poemTextEditor = modal.querySelector('#poemTextEditor');
        const poemCategory = modal.querySelector('#poemCategory');
        const poemStatus = modal.querySelector('#poemStatus');

        if (poemTextEditor) {
            poemTextEditor.innerHTML = existingPoem.htmlContent || existingPoem.text.replace(/\n/g, '<br>');
        }
        if (poemCategory) poemCategory.value = existingPoem.category;
        if (poemStatus) poemStatus.value = existingPoem.status;
    }

    // Initialize rich text editor
    initializeRichTextEditor(modal);

    // Save as draft handler
    const saveDraftBtn = modal.querySelector('#saveDraft');
    const savePoemBtn = modal.querySelector('#savePoemBtn');
    const modalContent = modal.querySelector('.modal-content'); // Get the content div to read data-poem-id

    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', function () {
            const poemStatus = document.getElementById('poemStatus');
            if (poemStatus) {
                poemStatus.value = 'draft';
            }
            savePoem(modalContent.dataset.poemId); // Pass the ID
        });
    }

    if (savePoemBtn) {
        savePoemBtn.addEventListener('click', function () {
            savePoem(modalContent.dataset.poemId); // Pass the ID
        });
    }
}

// Modified savePoem to handle updates or new poems based on poemId
// Modified savePoem to handle updates or new poems based on poemId
function savePoem(poemId = null) {
    const title = document.getElementById('poemTitle')?.value;
    const editor = document.getElementById('poemTextEditor');
    const htmlSource = document.getElementById('poemTextHTML');
    const category = document.getElementById('poemCategory')?.value;
    const status = document.getElementById('poemStatus')?.value;
    const tags = document.getElementById('poemTags')?.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    const notes = document.getElementById('poemNotes')?.value;

    if (!title || !title.trim()) {
        showNotification('Please fill in the title', 'error');
        return;
    }

    let text, htmlContent;

    // Get content from rich text editor
    if (editor) {
        htmlContent = editor.innerHTML;
        text = editor.innerText || editor.textContent || '';

        // Remove placeholder text if it's still there
        if (text === 'Enter your poem here...') {
            text = '';
            htmlContent = '';
        }

        // Clean up HTML content - remove empty tags and placeholders
        htmlContent = htmlContent.replace(/<div><br><\/div>/g, '\n')
            .replace(/<div>/g, '\n')
            .replace(/<\/div>/g, '')
            .replace(/^<br>/, '')
            .trim();

        // If HTML content is just placeholder, clear it
        if (htmlContent === 'Enter your poem here...' || htmlContent === '<br>' || htmlContent === '&nbsp;') {
            htmlContent = '';
            text = '';
        }
    } else {
        // Fallback for plain text editor (editing existing poems) - should not be reached with current setup
        const plainTextArea = document.getElementById('poemText');
        if (plainTextArea) {
            text = plainTextArea.value || '';
            htmlContent = text.replace(/\n/g, '<br>');
        } else {
            text = '';
            htmlContent = '';
        }
    }

    if (!text || !text.trim() || text.trim() === 'Enter your poem here...') {
        showNotification('Please enter some poem text', 'error');
        return;
    }

    const words = text.trim().split(/\s+/).length;
    const lines = text.split('\n').length;

    let poemData = {
        title: title.trim(),
        text: text.trim(),
        htmlContent: htmlContent, // Store formatted HTML version
        category,
        status,
        tags,
        notes: notes || '',
        wordCount: words,
        lineCount: lines,
        modified: new Date().toISOString()
    };

    if (poemId) {
        // Update existing poem
        const index = poems.findIndex(p => p.id === poemId);
        if (index !== -1) {
            poems[index] = { ...poems[index], ...poemData };
        }
    } else {
        // Check for existing poem with the same title
        const existingPoemIndex = poems.findIndex(p => p.title.toLowerCase() === poemData.title.toLowerCase());
        if (existingPoemIndex !== -1) {
            // Update the existing poem instead of creating a new one
            poems[existingPoemIndex] = { ...poems[existingPoemIndex], ...poemData };
            showNotification('Poem with this title already exists. Updated existing poem.', 'info');
        } else {
            // Create new poem
            poemData.id = `poem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            poemData.created = new Date().toISOString();
            poems.push(poemData);
        }
    }

    savePoems();
    filteredPoems = [...poems];
    renderPoems();
    updateTagFilter();

    document.querySelector('.modal')?.remove();

    showNotification('Poem saved successfully!', 'success');
}

function deletePoem(poemId) {
    const poem = poems.find(p => p.id === poemId);
    if (!poem) return;

    // Custom confirmation dialog instead of alert/confirm
    createConfirmationDialog(`Are you sure you want to delete "${poem.title}"? This action cannot be undone.`, () => {
        poems = poems.filter(p => p.id !== poemId);
        filteredPoems = filteredPoems.filter(p => p.id !== poemId);
        savePoems();
        renderPoems();
        updateTagFilter();
        showNotification('Poem deleted', 'success');
    });
}

function updateTagFilter() {
    const tagFilter = document.getElementById('tagFilter');
    if (!tagFilter) return;

    const allTags = new Set();
    poems.forEach(poem => poem.tags.forEach(tag => allTags.add(tag)));

    const currentValue = tagFilter.value;
    tagFilter.innerHTML = '<option value="">All Tags</option>';
    Array.from(allTags).sort().forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = `#${tag}`;
        tagFilter.appendChild(option);
    });
    tagFilter.value = currentValue;
}

function filterPoems() {
    const poemSearch = document.getElementById('poemSearch');
    const tagFilter = document.getElementById('tagFilter');
    const sortPoems = document.getElementById('sortPoems');

    const searchTerm = poemSearch?.value.toLowerCase() || '';
    const selectedTag = tagFilter?.value || '';
    const sortBy = sortPoems?.value || 'modified';

    filteredPoems = poems.filter(poem => {
        const matchesSearch = !searchTerm ||
            poem.title.toLowerCase().includes(searchTerm) ||
            poem.text.toLowerCase().includes(searchTerm) ||
            poem.tags.some(tag => tag.toLowerCase().includes(searchTerm));

        const matchesTag = !selectedTag || poem.tags.includes(selectedTag);

        return matchesSearch && matchesTag;
    });

    // Sort poems
    filteredPoems.sort((a, b) => {
        switch (sortBy) {
            case 'modified':
                return new Date(b.modified) - new Date(a.modified);
            case 'created':
                return new Date(b.created) - new Date(a.created);
            case 'title':
                return a.title.localeCompare(b.title);
            case 'wordcount':
                return b.wordCount - a.wordCount;
            default:
                return 0;
        }
    });

    renderPoems();
}

// Profile Management
function populateProfileForm() {
    const authorName = document.getElementById('authorName');
    const authorEmail = document.getElementById('authorEmail');
    const authorPhone = document.getElementById('authorPhone');
    const authorWebsite = document.getElementById('authorWebsite');
    const authorBio = document.getElementById('authorBio');
    const publicationHistory = document.getElementById('publicationHistory');
    const authorTwitter = document.getElementById('authorTwitter');
    const authorInstagram = document.getElementById('authorInstagram');
    const profilePhoto = document.getElementById('profilePhoto');

    if (authorName) authorName.value = userProfile.name || '';
    if (authorEmail) authorEmail.value = userProfile.email || '';
    if (authorPhone) authorPhone.value = userProfile.phone || '';
    if (authorWebsite) authorWebsite.value = userProfile.website || '';
    if (authorBio) authorBio.value = userProfile.bio || '';
    if (publicationHistory) publicationHistory.value = userProfile.publications || '';
    if (authorTwitter) authorTwitter.value = userProfile.twitter || '';
    if (authorInstagram) authorInstagram.value = userProfile.instagram || '';

    if (userProfile.photo && profilePhoto) {
        profilePhoto.src = userProfile.photo;
        profilePhoto.style.display = 'block';
        const photoContainer = document.querySelector('#profilePhotoContainer span');
        if (photoContainer) photoContainer.style.display = 'none';
    }

    updateBioWordCount();
}

function handleProfilePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file', 'error');
        return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showNotification('Image file too large. Please choose a file under 5MB.', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = document.getElementById('profilePhoto');
        if (img) {
            img.src = e.target.result;
            img.style.display = 'block';
            const photoContainer = document.querySelector('#profilePhotoContainer span');
            if (photoContainer) photoContainer.style.display = 'none';

            userProfile.photo = e.target.result;
        }
    };
    reader.readAsDataURL(file);
}

function updateBioWordCount() {
    const bio = document.getElementById('authorBio');
    const counter = document.getElementById('bioWordCount');
    if (bio && counter) {
        const words = bio.value.trim() ? bio.value.trim().split(/\s+/).length : 0;
        counter.textContent = words;
    }
}

function saveProfile() {
    const authorName = document.getElementById('authorName');
    const authorEmail = document.getElementById('authorEmail');
    const authorPhone = document.getElementById('authorPhone');
    const authorWebsite = document.getElementById('authorWebsite');
    const authorBio = document.getElementById('authorBio');
    const publicationHistory = document.getElementById('publicationHistory');
    const authorTwitter = document.getElementById('authorTwitter');
    const authorInstagram = document.getElementById('authorInstagram');

    userProfile = {
        ...userProfile,
        name: authorName?.value || '',
        email: authorEmail?.value || '',
        phone: authorPhone?.value || '',
        website: authorWebsite?.value || '',
        bio: authorBio?.value || '',
        publications: publicationHistory?.value || '',
        twitter: authorTwitter?.value || '',
        instagram: authorInstagram?.value || '',
        lastUpdated: new Date().toISOString()
    };

    saveUserProfile();
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const colors = {
        success: 'var(--success)',
        error: 'var(--error)',
        warning: 'var(--warning)',
        info: 'var(--primary)'
    };

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        font-weight: 500;
        max-width: 300px;
        word-wrap: break-word;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
}

function createConfirmationDialog(message, onConfirm) {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px; text-align: center;">
            <div class="modal-header" style="justify-content: center;">
                <div class="modal-favicon" style="background: var(--warning);">⚠️</div>
            </div>
            <p style="margin: 1.5rem 0; font-size: 1.1rem; color: var(--text-primary);">${message}</p>
            <div class="modal-actions" style="justify-content: center;">
                <button class="btn" id="cancelConfirm">Cancel</button>
                <button class="btn btn-primary" id="confirmAction" style="background: var(--error); border-color: var(--error);">Confirm</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#cancelConfirm').addEventListener('click', () => modal.remove());
    modal.querySelector('#confirmAction').addEventListener('click', () => {
        onConfirm();
        modal.remove();
    });
}


function updateAppStats() {
    // Update storage statistics
    const storageUsed = JSON.stringify({
        poems: poems,
        profile: userProfile,
        contests: contests,
        submissions: submissions
    }).length;

    const storageUsedElement = document.getElementById('storageUsed');
    const poemsCountElement = document.getElementById('poemsCount');

    if (storageUsedElement) {
        storageUsedElement.textContent = `${(storageUsed / 1024).toFixed(1)} KB`;
    }
    if (poemsCountElement) {
        poemsCountElement.textContent = poems.length;
    }
}

// Add submissions tab functionality
function addSubmissionsTab() {
    // Add submissions tab to navigation
    const navTabs = document.querySelector('.nav-tabs');
    if (!navTabs) return;

    const submissionsTab = document.createElement('button');
    submissionsTab.className = 'nav-tab';
    submissionsTab.setAttribute('data-tab', 'submissions');
    submissionsTab.textContent = 'Submissions';
    // Insert before 'Settings' tab if it exists, otherwise at the end
    const settingsTab = navTabs.querySelector('[data-tab="settings"]');
    if (settingsTab) {
        navTabs.insertBefore(submissionsTab, settingsTab);
    } else {
        navTabs.appendChild(submissionsTab);
    }


    // Add submissions tab content
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    const submissionsContent = document.createElement('div');
    submissionsContent.className = 'tab-content';
    submissionsContent.id = 'submissions';
    submissionsContent.innerHTML = `
        <div style="padding: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 style="margin: 0;">Submission Tracker</h2>
                <div style="display: flex; gap: 0.5rem;">
                    <select id="submissionFilter" style="padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; background: var(--surface); color: var(--text-primary);">
                        <option value="">All Status</option>
                        <option value="submitted">Submitted</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            <div id="submissionsGrid" style="display: grid; gap: 1rem;">
                <!-- Submissions will be populated here -->
            </div>

            <div id="noSubmissionsMessage" style="text-align: center; padding: 3rem; color: var(--text-secondary); display: none;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">📨</div>
                <h3>No submissions yet</h3>
                <p>Submit your poems to contests to start tracking them here!</p>
                <button class="btn btn-primary" onclick="switchTab('poems')">View My Poems</button>
            </div>
        </div>
    `;
    mainContent.appendChild(submissionsContent);

    // Update tab switching to include submissions
    submissionsTab.addEventListener('click', function () {
        switchTab('submissions');
        renderSubmissions();
    });

    // Add event listener for submission filter
    const submissionFilter = document.getElementById('submissionFilter');
    if (submissionFilter) {
        submissionFilter.addEventListener('change', renderSubmissions);
    }
}

function renderSubmissions() {
    const grid = document.getElementById('submissionsGrid');
    const noSubmissions = document.getElementById('noSubmissionsMessage');
    const filter = document.getElementById('submissionFilter')?.value || '';

    if (!grid || !noSubmissions) return;

    const filteredSubmissions = filter ?
        submissions.filter(s => s.status === filter) :
        submissions;

    if (filteredSubmissions.length === 0) {
        grid.style.display = 'none';
        noSubmissions.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    noSubmissions.style.display = 'none';

    // Sort by submission date (newest first)
    filteredSubmissions.sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate));

    grid.innerHTML = filteredSubmissions.map(submission => {
        const deadline = new Date(submission.deadline);
        const daysUntilDeadline = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));

        return `
            <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 0.75rem; padding: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <h3 style="margin: 0 0 0.5rem 0; font-size: 1.125rem;">${submission.poemTitle}</h3>
                        <div style="color: var(--text-secondary); font-size: 0.875rem;">
                            ${submission.contestName} • ${submission.organization}
                        </div>
                    </div>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <span style="background: ${getStatusColor(submission.status)}; color: white; padding: 0.25rem 0.75rem; border-radius: 0.375rem; font-size: 0.875rem; font-weight: 500;">
                            ${submission.status}
                        </span>
                        <button class="btn" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="updateSubmissionStatus('${submission.id}')">✏️</button>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                    <div>
                        <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">Prize</div>
                        <div style="font-weight: 600; color: var(--success);">${submission.prize.toLocaleString()}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">Submitted</div>
                        <div style="font-weight: 500;">${new Date(submission.submittedDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">Deadline</div>
                        <div style="font-weight: 500; color: ${daysUntilDeadline < 0 ? 'var(--error)' : daysUntilDeadline < 7 ? 'var(--warning)' : 'var(--text-primary)'};">
                            ${deadline.toLocaleDateString()}
                            ${daysUntilDeadline >= 0 ? `(${daysUntilDeadline} days)` : '(Past)'}
                        </div>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                    <button class="btn" onclick="viewSubmissionPoem('${submission.poemId}')">View Poem</button>
                    <button class="btn" onclick="contactContest('${submission.contestId}')">Contact Contest</button>
                </div>
            </div>
        `;
    }).join('');
}

function updateSubmissionStatus(submissionId) {
    const submission = submissions.find(s => s.id === submissionId);
    if (!submission) return;

    createConfirmationDialog(`Update status for "${submission.poemTitle}":\n\nCurrent: ${submission.status}\n\nEnter new status (submitted/pending/accepted/rejected):`, (confirmed) => {
        if (confirmed) {
            const newStatus = prompt(`Update status for "${submission.poemTitle}":\n\nCurrent: ${submission.status}\n\nEnter new status (submitted/pending/accepted/rejected):`, submission.status);
            if (newStatus && ['submitted', 'pending', 'accepted', 'rejected'].includes(newStatus.toLowerCase())) {
                submission.status = newStatus.toLowerCase();
                submission.lastUpdated = new Date().toISOString();
                saveSubmissions();
                renderSubmissions();
                showNotification('Submission status updated!', 'success');
            } else {
                showNotification('Invalid status entered.', 'error');
            }
        }
    });
}


function viewSubmissionPoem(poemId) {
    viewPoem(poemId);
}

function contactContest(contestId) {
    const contest = contests.find(c => c.id == contestId);
    if (contest && contest.url) {
        window.open(contest.url, '_blank');
    }
}

// Tab Management
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    const targetTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (targetTab) targetTab.classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    const targetContent = document.getElementById(tabName);
    if (targetContent) targetContent.classList.add('active');

    // Special handling for different tabs
    if (tabName === 'poems') {
        renderPoems();
        updateTagFilter();
    } else if (tabName === 'submissions') {
        renderSubmissions();
    } else if (tabName === 'profile') {
        populateProfileForm();
    }
}

// Calendar Functions
function generateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Update month display
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentMonthElement = document.getElementById('currentMonth');
    if (currentMonthElement) {
        currentMonthElement.textContent = `${monthNames[month]} ${year}`;
    }

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Clear calendar
    const calendarGrid = document.getElementById('calendarGrid');
    if (!calendarGrid) return;

    calendarGrid.innerHTML = '';

    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'day-header';
        header.textContent = day;
        calendarGrid.appendChild(header);
    });

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendarGrid.appendChild(emptyDay);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';

        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);

        const eventsContainer = document.createElement('div');
        eventsContainer.className = 'contest-events';

        // Add contests for this day using filtered contests
        const currentDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayContests = filteredContests.filter(contest => contest.deadline === currentDateStr);

        dayContests.forEach(contest => {
            const eventElement = document.createElement('div');
            eventElement.className = 'contest-event';
            eventElement.onclick = () => showContestDetails(contest);

            // Check if user has submissions to this contest
            const hasSubmissions = submissions.some(s => s.contestId == contest.id);
            const customIndicator = contest.isCustom ? '👤' : '';
            const submissionIndicator = hasSubmissions ? '📨' : '';

            eventElement.innerHTML = `
                <div class="contest-favicon">${contest.favicon}</div>
                <span class="contest-prize">${contest.prize.toLocaleString()}</span>
                ${customIndicator}${submissionIndicator}
            `;

            // Add special styling for contests with submissions
            if (hasSubmissions) {
                eventElement.style.borderLeft = '3px solid var(--success)';
            }

            eventsContainer.appendChild(eventElement);
        });

        dayElement.appendChild(eventsContainer);
        calendarGrid.appendChild(dayElement);
    }
}

// Contest Management
function showContestDetails(contest) {
    const modalFavicon = document.getElementById('modalFavicon');
    const modalTitle = document.getElementById('modalTitle');
    const modalOrganization = document.getElementById('modalOrganization');
    const modalDeadline = document.getElementById('modalDeadline');
    const modalPrize = document.getElementById('modalPrize');
    const modalFee = document.getElementById('modalFee');

    if (modalFavicon) modalFavicon.textContent = contest.favicon;
    if (modalTitle) modalTitle.textContent = contest.name;
    if (modalOrganization) modalOrganization.textContent = contest.organization;
    if (modalDeadline) modalDeadline.textContent = new Date(contest.deadline).toLocaleDateString();
    if (modalPrize) modalPrize.textContent = `${contest.prize.toLocaleString()}`;
    if (modalFee) modalFee.textContent = contest.entryFee || `${contest.fee}`;

    const modal = document.getElementById('contestModal');
    const modalDetails = modal?.querySelector('.modal-details');

    if (!modal || !modalDetails) return;

    // Remove existing dynamic content
    const existingElements = modal.querySelectorAll('.contest-description, .contest-submissions, .contest-link'); // Added .contest-link
    existingElements.forEach(el => el.remove());

    // Add description if available
    if (contest.description) {
        const descElement = document.createElement('div');
        descElement.className = 'detail-item contest-description';
        descElement.style.flexDirection = 'column';
        descElement.style.alignItems = 'flex-start';
        descElement.innerHTML = `
            <span class="detail-label">About This Contest</span>
            <span class="detail-value" style="margin-top: 0.5rem; line-height: 1.5;">${contest.description}</span>
        `;
        modalDetails.appendChild(descElement);
    }

    // Add contest website link
    if (contest.url) {
        const linkElement = document.createElement('div');
        linkElement.className = 'detail-item contest-link';
        linkElement.innerHTML = `
            <span class="detail-label">More Information</span>
            <a href="${contest.url}" target="_blank" rel="noopener noreferrer" class="detail-value" style="color: var(--primary); text-decoration: none; display: flex; align-items: center; gap: 0.5rem; font-weight: 500;">
                Visit Contest Page
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15,3 21,3 21,9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
            </a>
        `;
        linkElement.querySelector('a').addEventListener('mouseenter', function () {
            this.style.textDecoration = 'underline';
        });
        linkElement.querySelector('a').addEventListener('mouseleave', function () {
            this.style.textDecoration = 'none';
        });
        modalDetails.appendChild(linkElement);
    }

    // Add submission tracking
    const relatedSubmissions = submissions.filter(s => s.contestId == contest.id);
    if (relatedSubmissions.length > 0) {
        const submissionElement = document.createElement('div');
        submissionElement.className = 'detail-item contest-submissions';
        submissionElement.style.flexDirection = 'column';
        submissionElement.style.alignItems = 'flex-start';
        submissionElement.innerHTML = `
            <span class="detail-label">Your Submissions</span>
            <div style="margin-top: 0.5rem; width: 100%;">
                ${relatedSubmissions.map(sub => `
                    <div style="background: var(--background); padding: 0.75rem; border-radius: 0.375rem; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-weight: 500;">${sub.poemTitle}</div>
                            <div style="font-size: 0.875rem; color: var(--text-secondary);">
                                Submitted ${new Date(sub.submittedDate).toLocaleDateString()}
                            </div>
                        </div>
                        <span style="background: ${getStatusColor(sub.status)}; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">
                            ${sub.status}
                        </span>
                    </div>
                `).join('')}
            </div>
        `;
        modalDetails.appendChild(submissionElement);
    }

    // Update submit button with real URL
    const submitBtn = document.getElementById('submitToContest');
    if (submitBtn) {
        submitBtn.onclick = () => {
            if (poems.length === 0) {
                showNotification('You need to add some poems first before submitting to contests!', 'info');
                closeModal();
                switchTab('poems');
                return;
            }
            // Open contest website in new tab
            if (contest.url) {
                window.open(contest.url, '_blank', 'noopener,noreferrer');
            }
            closeModal();
        };

        // Update button text to be more descriptive
        submitBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.5rem;">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15,3 21,3 21,9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            Go to Contest Page
        `;
    }

    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('contestModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Filter Functions
function toggleFilterPanel() {
    const panel = document.getElementById('filterPanel');
    const btn = document.getElementById('filterContests');

    if (!panel || !btn) return;

    if (panel.style.display === 'none' || !panel.style.display) {
        panel.style.display = 'block';
        btn.textContent = '🔍 Hide Filters';
    } else {
        panel.style.display = 'none';
        btn.textContent = '🔍 Filter';
    }
}

function applyFilters() {
    const prizeFilter = document.getElementById('prizeFilter')?.value || '';
    const feeFilter = document.getElementById('feeFilter')?.value || '';
    const deadlineFilter = document.getElementById('deadlineFilter')?.value || '';

    activeFilters = { prize: prizeFilter, fee: feeFilter, deadline: deadlineFilter };

    filteredContests = contests.filter(contest => {
        // Prize filter
        if (prizeFilter) {
            const prize = contest.prize;
            switch (prizeFilter) {
                case '0-500':
                    if (prize > 500) return false;
                    break;
                case '500-1000':
                    if (prize < 500 || prize > 1000) return false;
                    break;
                case '1000-5000':
                    if (prize < 1000 || prize > 5000) return false;
                    break;
                case '5000+':
                    if (prize < 5000) return false;
                    break;
            }
        }

        // Fee filter
        if (feeFilter) {
            const fee = contest.fee || 0;
            switch (feeFilter) {
                case 'free':
                    if (fee > 0) return false;
                    break;
                case '0-25':
                    if (fee > 25) return false;
                    break;
                case '25-50':
                    if (fee < 25 || fee > 50) return false;
                    break;
                case '50+':
                    if (fee < 50) return false;
                    break;
            }
        }

        // Deadline filter
        if (deadlineFilter) {
            const deadline = new Date(contest.deadline);
            const now = new Date();
            const diffTime = deadline - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            switch (deadlineFilter) {
                case 'this-month':
                    if (diffDays > 30) return false;
                    break;
                case 'next-month':
                    if (diffDays > 60) return false;
                    break;
                case '3-months':
                    if (diffDays > 90) return false;
                    break;
                case '6-months':
                    if (diffDays > 180) return false;
                    break;
            }
        }

        return true;
    });

    generateCalendar();

    // Show filter summary
    showNotification(`Showing ${filteredContests.length} of ${contests.length} contests`, 'info');
}

function clearFilters() {
    const prizeFilter = document.getElementById('prizeFilter');
    const feeFilter = document.getElementById('feeFilter');
    const deadlineFilter = document.getElementById('deadlineFilter');

    if (prizeFilter) prizeFilter.value = '';
    if (feeFilter) feeFilter.value = '';
    if (deadlineFilter) deadlineFilter.value = '';

    activeFilters = { prize: '', fee: '', deadline: '' };
    filteredContests = [...contests];
    generateCalendar();

    showNotification('Filters cleared', 'success');
}

// Poem Management
// addNewPoem function is now above, modified to accept poemIdToEdit

function initializeRichTextEditor(modal) {
    const editor = modal.querySelector('#poemTextEditor');
    const htmlSource = modal.querySelector('#poemTextHTML');
    const wordCountSpan = modal.querySelector('#poemWordCount');
    const lineCountSpan = modal.querySelector('#poemLineCount');
    const toggleViewBtn = modal.querySelector('#toggleView');
    const fontFamilySelect = modal.querySelector('#fontFamily');
    const fontSizeSelect = modal.querySelector('#fontSize');
    const insertTabBtn = modal.querySelector('#insertTab');

    let isHTMLView = false;

    // Formatting button handlers
    modal.querySelectorAll('.format-btn[data-command]').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const command = this.dataset.command;
            document.execCommand(command, false, null);
            editor.focus();
            updateWordCount();
        });
    });

    // Font family handler
    fontFamilySelect.addEventListener('change', function () {
        document.execCommand('fontName', false, this.value);
        editor.focus();
    });

    // Font size handler
    fontSizeSelect.addEventListener('change', function () {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (!range.collapsed) {
                const span = document.createElement('span');
                span.style.fontSize = this.value;
                range.surroundContents(span);
            }
        }
        editor.focus();
    });

    // Insert tab handler
    insertTabBtn.addEventListener('click', function (e) {
        e.preventDefault();
        document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
        editor.focus();
        updateWordCount();
    });

    // Toggle view handler
    toggleViewBtn.addEventListener('click', function () {
        if (isHTMLView) {
            // Switch back to visual editor
            editor.innerHTML = htmlSource.value;
            editor.style.display = 'block';
            htmlSource.style.display = 'none';
            this.textContent = '</>';
            isHTMLView = false;
        } else {
            // Switch to HTML source
            htmlSource.value = editor.innerHTML;
            editor.style.display = 'none';
            htmlSource.style.display = 'block';
            this.textContent = '👁';
            isHTMLView = true;
        }
    });

    // Sync HTML source changes back to editor
    htmlSource.addEventListener('input', function () {
        if (isHTMLView) {
            editor.innerHTML = this.value;
            updateWordCount();
        }
    });

    // Word count update function
    function updateWordCount() {
        const text = editor.innerText || editor.textContent || '';
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const lines = text.split('\n').length;
        if (wordCountSpan) wordCountSpan.textContent = words;
        if (lineCountSpan) lineCountSpan.textContent = lines;
    }

    // Update word count on input
    editor.addEventListener('input', updateWordCount);

    // Keyboard shortcuts
    editor.addEventListener('keydown', function (e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'b':
                    e.preventDefault();
                    document.execCommand('bold');
                    break;
                case 'i':
                    e.preventDefault();
                    document.execCommand('italic');
                    break;
                case 'u':
                    e.preventDefault();
                    document.execCommand('underline');
                    break;
            }
        }

        // Tab key handler
        if (e.key === 'Tab') {
            e.preventDefault();
            document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
        }

        setTimeout(updateWordCount, 10);
    });

    // Paste handler to clean up pasted content
    editor.addEventListener('paste', function (e) {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
        setTimeout(updateWordCount, 10);
    });

    // Focus the editor
    editor.focus();
}

// Placeholder functions for features to be implemented
function addCustomContest() {
    showNotification('Custom contest feature coming soon!', 'info');
}

function searchContests() {
    showNotification('Contest search feature coming soon!', 'info');
}

function importPoems() {
    // Create file input for importing poems
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.txt,.md,.json';
    fileInput.multiple = true;

    fileInput.onchange = function (event) {
        const files = event.target.files;
        if (files.length === 0) return;

        let importedCount = 0;
        let totalFiles = files.length;

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const content = e.target.result;
                let poemData;

                try {
                    // Try to parse as JSON first (exported poems)
                    if (file.name.endsWith('.json')) {
                        const jsonData = JSON.parse(content);
                        if (Array.isArray(jsonData)) {
                            // Multiple poems
                            jsonData.forEach(poem => {
                                if (poem.title && poem.text) {
                                    const newPoem = {
                                        id: `poem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                                        title: poem.title,
                                        text: poem.text,
                                        category: poem.category || 'free-verse',
                                        status: poem.status || 'draft',
                                        tags: poem.tags || [],
                                        notes: poem.notes || '',
                                        wordCount: poem.wordCount || poem.text.trim().split(/\s+/).length,
                                        lineCount: poem.lineCount || poem.text.split('\n').length,
                                        created: poem.created || new Date().toISOString(),
                                        modified: new Date().toISOString()
                                    };
                                    poems.push(newPoem);
                                    importedCount++;
                                }
                            });
                        } else if (jsonData.title && jsonData.text) {
                            // Single poem
                            const newPoem = {
                                id: `poem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                                title: jsonData.title,
                                text: jsonData.text,
                                category: jsonData.category || 'free-verse',
                                status: jsonData.status || 'draft',
                                tags: jsonData.tags || [],
                                notes: jsonData.notes || '',
                                wordCount: jsonData.wordCount || jsonData.text.trim().split(/\s+/).length,
                                lineCount: jsonData.lineCount || jsonData.text.split('\n').length,
                                created: jsonData.created || new Date().toISOString(),
                                modified: new Date().toISOString()
                            };
                            poems.push(newPoem);
                            importedCount++;
                        }
                    } else {
                        // Plain text file - create poem from filename and content
                        const fileName = file.name.replace(/\.(txt|md)$/, '');
                        const newPoem = {
                            id: `poem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                            title: fileName,
                            text: content,
                            category: 'free-verse',
                            status: 'draft',
                            tags: [],
                            notes: `Imported from ${file.name}`,
                            wordCount: content.trim().split(/\s+/).length,
                            lineCount: content.split('\n').length,
                            created: new Date().toISOString(),
                            modified: new Date().toISOString()
                        };
                        poems.push(newPoem);
                        importedCount++;
                    }
                } catch (error) {
                    console.error('Error parsing file:', file.name, error);
                    // Treat as plain text if JSON parsing fails
                    const fileName = file.name.replace(/\.(txt|md|json)$/, '');
                    const newPoem = {
                        id: `poem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        title: fileName,
                        text: content,
                        category: 'free-verse',
                        status: 'draft',
                        tags: [],
                        notes: `Imported from ${file.name}`,
                        wordCount: content.trim().split(/\s+/).length,
                        lineCount: content.split('\n').length,
                        created: new Date().toISOString(),
                        modified: new Date().toISOString()
                    };
                    poems.push(newPoem);
                    importedCount++;
                }

                // Check if all files have been processed
                if (importedCount > 0 && poems.length >= importedCount) { // Simplified check
                    savePoems();
                    filteredPoems = [...poems];
                    renderPoems();
                    updateTagFilter();
                    showNotification(`Successfully imported ${importedCount} poem(s)!`, 'success');
                }
            };

            reader.readAsText(file);
        });
    };

    fileInput.click();
}

function exportData() {
    // Create export modal with format options
    const exportModal = document.createElement('div');
    exportModal.className = 'modal show';
    exportModal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <div class="modal-favicon">📤</div>
                <div>
                    <div class="modal-title">Export Data</div>
                    <div class="modal-organization">Choose export format and content</div>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 1.5rem; margin: 1.5rem 0;">
                <div>
                    <h4 style="margin-bottom: 1rem;">Export All Data</h4>
                    <button class="btn btn-primary" onclick="exportAllAsJSON()" style="width: 100%; margin-bottom: 0.5rem;">
                        📄 Export Everything as JSON
                    </button>
                    <div style="font-size: 0.875rem; color: var(--text-secondary);">
                        Includes poems, profile, contests, and submissions
                    </div>
                </div>

                <div style="border-top: 1px solid var(--border); padding-top: 1.5rem;">
                    <h4 style="margin-bottom: 1rem;">Export Individual Poems</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.5rem; margin-bottom: 1rem;">
                        <button class="btn" onclick="showPoemExportOptions('word')">
                            📝 Word Doc
                        </button>
                        <button class="btn" onclick="showPoemExportOptions('pdf')">
                            📄 PDF
                        </button>
                        <button class="btn" onclick="showPoemExportOptions('markdown')">
                            📋 Markdown
                        </button>
                    </div>
                    <div style="font-size: 0.875rem; color: var(--text-secondary);">
                        Select individual poems to export in various formats
                    </div>
                </div>
            </div>

            <div class="modal-actions">
                <button class="btn" onclick="this.closest('.modal').remove()">Close</button>
            </div>
        </div>
    `;

    document.body.appendChild(exportModal);
}

function exportAllAsJSON() {
    const exportData = {
        poems: poems,
        profile: userProfile,
        contests: contests.filter(contest =>
            !sampleContests.some(sample => sample.id === contest.id)
        ),
        submissions: submissions,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `poetry-calendar-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    document.querySelector('.modal').remove();
    showNotification('All data exported as JSON successfully!', 'success');
}

function showPoemExportOptions(format) {
    // Close current modal
    document.querySelector('.modal').remove();

    // Create poem selection modal
    const poemModal = document.createElement('div');
    poemModal.className = 'modal show';
    poemModal.innerHTML = `
        <div class="modal-content" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
            <div class="modal-header">
                <div class="modal-favicon">📝</div>
                <div>
                    <div class="modal-title">Export Poems as ${format.toUpperCase()}</div>
                    <div class="modal-organization">Select poems to export</div>
                </div>
            </div>

            <div style="margin: 1.5rem 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: 500;">
                        <input type="checkbox" id="selectAll" onchange="toggleAllPoems(this)">
                        Select All Poems
                    </label>
                    <button class="btn btn-primary" onclick="exportSelectedPoems('${format}')" id="exportBtn" disabled>
                        Export Selected
                    </button>
                </div>

                <div id="poemsList" style="max-height: 400px; overflow-y: auto; border: 1px solid var(--border); border-radius: 0.5rem; padding: 1rem;">
                    ${poems.map(poem => `
                        <label style="display: flex; align-items: start; gap: 0.75rem; padding: 0.75rem; border-radius: 0.375rem; cursor: pointer; transition: background 0.2s;"
                               onmouseover="this.style.background='var(--background)'"
                               onmouseout="this.style.background='transparent'">
                            <input type="checkbox" class="poem-checkbox" value="${poem.id}" onchange="updateExportButton()">
                            <div style="flex: 1;">
                                <div style="font-weight: 600; margin-bottom: 0.25rem;">${poem.title}</div>
                                <div style="font-size: 0.875rem; color: var(--text-secondary);">
                                    ${poem.category} • ${poem.wordCount} words • ${poem.status}
                                </div>
                                <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem; max-height: 40px; overflow: hidden;">
                                    ${poem.text.substring(0, 100)}${poem.text.length > 100 ? '...' : ''}
                                </div>
                            </div>
                        </label>
                    `).join('')}
                </div>

                ${poems.length === 0 ? `
                    <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        <div style="font-size: 2rem; margin-bottom: 0.5rem;">📝</div>
                        <div>No poems to export</div>
                        <div style="font-size: 0.875rem;">Create some poems first!</div>
                    </div>
                ` : ''}
            </div>

            <div class="modal-actions">
                <button class="btn" onclick="this.closest('.modal').remove()">Cancel</button>
                <button class="btn" onclick="exportData()">← Back to Export Options</button>
            </div>
        </div>
    `;

    document.body.appendChild(poemModal);
}

function toggleAllPoems(checkbox) {
    const poemCheckboxes = document.querySelectorAll('.poem-checkbox');
    poemCheckboxes.forEach(cb => {
        cb.checked = checkbox.checked;
    });
    updateExportButton();
}

function updateExportButton() {
    const selectedPoems = document.querySelectorAll('.poem-checkbox:checked');
    const exportBtn = document.getElementById('exportBtn');
    const selectAllCheckbox = document.getElementById('selectAll');

    if (exportBtn) {
        exportBtn.disabled = selectedPoems.length === 0;
        exportBtn.textContent = selectedPoems.length > 0 ?
            `Export ${selectedPoems.length} Poem${selectedPoems.length !== 1 ? 's' : ''}` :
            'Export Selected';
    }

    // Update select all checkbox state
    const allCheckboxes = document.querySelectorAll('.poem-checkbox');
    if (selectAllCheckbox && allCheckboxes.length > 0) {
        selectAllCheckbox.checked = selectedPoems.length === allCheckboxes.length;
        selectAllCheckbox.indeterminate = selectedPoems.length > 0 && selectedPoems.length < allCheckboxes.length;
    }
}

function exportSelectedPoems(format) {
    const selectedPoemIds = Array.from(document.querySelectorAll('.poem-checkbox:checked')).map(cb => cb.value);
    const selectedPoems = poems.filter(poem => selectedPoemIds.includes(poem.id));

    if (selectedPoems.length === 0) {
        showNotification('Please select at least one poem to export', 'error');
        return;
    }

    switch (format) {
        case 'word':
            exportAsWord(selectedPoems);
            break;
        case 'pdf':
            exportAsPDF(selectedPoems);
            break;
        case 'markdown':
            exportAsMarkdown(selectedPoems);
            break;
    }

    document.querySelector('.modal').remove();
}

function exportAsWord(selectedPoems) {
    // Create Word document content using HTML
    const wordContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Poetry Collection</title>
            <style>
                body { font-family: 'Times New Roman', serif; line-height: 1.6; margin: 1in; }
                .poem { page-break-after: always; margin-bottom: 2in; }
                .poem:last-child { page-break-after: avoid; }
                .title { font-size: 18pt; font-weight: bold; text-align: center; margin-bottom: 1in; }
                .poem-content { font-size: 12pt; white-space: pre-wrap; }
                .metadata { font-size: 10pt; color: #666; margin-top: 1in; border-top: 1px solid #ccc; padding-top: 0.5in; }
                @page { margin: 1in; }
            </style>
        </head>
        <body>
            ${selectedPoems.map(poem => `
                <div class="poem">
                    <h1 class="title">${poem.title}</h1>
                    <div class="poem-content">${poem.htmlContent || poem.text.replace(/\n/g, '<br>')}</div>
                    <div class="metadata">
                        <p><strong>Category:</strong> ${poem.category}</p>
                        <p><strong>Word Count:</strong> ${poem.wordCount}</p>
                        <p><strong>Created:</strong> ${new Date(poem.created).toLocaleDateString()}</p>
                        ${poem.notes ? `<p><strong>Notes:</strong> ${poem.notes}</p>` : ''}
                    </div>
                </div>
            `).join('')}
        </body>
        </html>
    `;

    const blob = new Blob([wordContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `poems-${new Date().toISOString().split('T')[0]}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification(`${selectedPoems.length} poem(s) exported as Word document!`, 'success');
}

function exportAsPDF(selectedPoems) {
    // Create a printable HTML page that can be saved as PDF
    const pdfWindow = window.open('', '_blank');
    const pdfContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Poetry Collection</title>
            <style>
                body {
                    font-family: 'Times New Roman', serif;
                    line-height: 1.6;
                    margin: 0;
                    padding: 20px;
                    background: white;
                    color: black;
                }
                .poem {
                    page-break-after: always;
                    margin-bottom: 40px;
                    padding: 20px;
                    border-bottom: 2px solid #eee;
                }
                .poem:last-child {
                    page-break-after: avoid;
                    border-bottom: none;
                }
                .title {
                    font-size: 24px;
                    font-weight: bold;
                    text-align: center;
                    margin-bottom: 30px;
                    color: #333;
                }
                .poem-content {
                    font-size: 14px;
                    white-space: pre-wrap;
                    margin-bottom: 30px;
                    text-align: left;
                }
                .metadata {
                    font-size: 12px;
                    color: #666;
                    border-top: 1px solid #ccc;
                    padding-top: 15px;
                }
                .metadata p { margin: 5px 0; }
                @media print {
                    body { margin: 0; }
                    .poem { page-break-after: always; }
                    .no-print { display: none; }
                }
                .print-instructions {
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    background: #4CAF50;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 5px;
                    font-size: 14px;
                    z-index: 1000;
                }
            </style>
        </head>
        <body>
            <div class="print-instructions no-print">
                Press Ctrl+P (Cmd+P on Mac) to save as PDF
            </div>
            ${selectedPoems.map(poem => `
                <div class="poem">
                    <h1 class="title">${poem.title}</h1>
                    <div class="poem-content">${poem.htmlContent || poem.text.replace(/\n/g, '<br>')}</div>
                    <div class="metadata">
                        <p><strong>Category:</strong> ${poem.category}</p>
                        <p><strong>Word Count:</strong> ${poem.wordCount}</p>
                        <p><strong>Created:</strong> ${new Date(poem.created).toLocaleDateString()}</p>
                        ${poem.notes ? `<p><strong>Notes:</strong> ${poem.notes}</p>` : ''}
                    </div>
                </div>
            `).join('')}
        </body>
        </html>
    `;

    pdfWindow.document.write(pdfContent);
    pdfWindow.document.close();

    // Auto-trigger print dialog after a short delay
    setTimeout(() => {
        pdfWindow.print();
    }, 500);

    showNotification(`${selectedPoems.length} poem(s) opened for PDF export! Use Ctrl+P to save as PDF.`, 'success');
}

function exportAsMarkdown(selectedPoems) {
    const markdownContent = selectedPoems.map(poem => {
        // Convert HTML content to markdown-friendly format
        let content = poem.htmlContent || poem.text;

        // Simple HTML to markdown conversion
        content = content
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
            .replace(/<b>(.*?)<\/b>/gi, '**$1**')
            .replace(/<em>(.*?)<\/em>/gi, '*$1*')
            .replace(/<i>(.*?)<\/i>/gi, '*$1*')
            .replace(/<u>(.*?)<\/u>/gi, '_$1_')
            .replace(/&nbsp;/gi, ' ')
            .replace(/<[^>]*>/g, ''); // Remove any remaining HTML tags

        return `# ${poem.title}

${content}

---

**Metadata:**
- **Category:** ${poem.category}
- **Status:** ${poem.status}
- **Word Count:** ${poem.wordCount}
- **Line Count:** ${poem.lineCount}
- **Created:** ${new Date(poem.created).toLocaleDateString()}
- **Modified:** ${new Date(poem.modified).toLocaleDateString()}
${poem.tags.length > 0 ? `- **Tags:** ${poem.tags.map(tag => `#${tag}`).join(', ')}` : ''}
${poem.notes ? `- **Notes:** ${poem.notes}` : ''}

`;
    }).join('\n\n');

    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `poems-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification(`${selectedPoems.length} poem(s) exported as Markdown!`, 'success');
}

function importData() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';

    fileInput.onchange = function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const importedData = JSON.parse(e.target.result);

                createConfirmationDialog('Imported contests will be merged. Existing contests with the same name will be overwritten. Continue?', () => {
                    // Import poems (unchanged)
                    if (importedData.poems && Array.isArray(importedData.poems)) {
                        poems = importedData.poems;
                        filteredPoems = [...poems];
                        savePoems();
                        renderPoems();
                        updateTagFilter();
                    }

                    // Import profile (unchanged)
                    if (importedData.profile) {
                        userProfile = importedData.profile;
                        saveUserProfile();
                        populateProfileForm();
                    }

                    // NEW: Merge imported contests by name (not id!)
                    if (importedData.contests && Array.isArray(importedData.contests)) {
                        // Build a map of current contests by name (case-insensitive)
                        const contestNameMap = {};
                        contests.forEach(contest => {
                            contestNameMap[contest.name.trim().toLowerCase()] = contest;
                        });

                        importedData.contests.forEach(importedContest => {
                            const key = importedContest.name.trim().toLowerCase();
                            contestNameMap[key] = importedContest; // Overwrite if exists, add if not
                        });

                        // Rebuild contests array from map, keeping sampleContests at the start
                        const mergedContestsList = Object.values(contestNameMap);
                        // Make sure sampleContests are always present at the start of the list (optional)
                        contests = [...sampleContests];
                        mergedContestsList.forEach(contest => {
                            if (!sampleContests.some(sample => sample.name.trim().toLowerCase() === contest.name.trim().toLowerCase())) {
                                contests.push(contest);
                            }
                        });
                        filteredContests = [...contests];
                        saveContests();
                        generateCalendar();
                    }

                    // Import submissions (unchanged)
                    if (importedData.submissions && Array.isArray(importedData.submissions)) {
                        submissions = importedData.submissions;
                        saveSubmissions();
                    }

                    updateAppStats();
                    showNotification('Data imported and merged successfully!', 'success');
                });
            } catch (error) {
                console.error('Error importing data:', error);
                showNotification('Error importing data. Please check the file format.', 'error');
            }
        };

        reader.readAsText(file);
    };

    fileInput.click();
}

function clearCache() {
    showNotification('Cache clear feature coming soon!', 'info');
}

function resetApp() {
    createConfirmationDialog('Are you sure you want to reset the entire app? This will delete all your data (poems, profile, contests, submissions) and cannot be undone.', () => {
        localStorage.clear();
        poems = [];
        filteredPoems = [];
        contests = [...sampleContests];
        filteredContests = [...sampleContests];
        userProfile = {};
        submissions = [];
        currentDate = new Date(); // Reset calendar to current month
        initializeTheme();
        generateCalendar();
        renderPoems();
        renderSubmissions();
        populateProfileForm();
        updateAppStats();
        showNotification('App reset successfully! All data cleared.', 'success');
    });
}

function submitToContests(poemId) {
    // Find the poem to be submitted
    const poem = poems.find(p => p.id === poemId);
    if (!poem) {
        showNotification('Poem not found.', 'error');
        return;
    }

    // Filter contests that are still open and that the user hasn't already submitted this poem to
    const availableContests = contests.filter(c => {
        const deadline = new Date(c.deadline);
        const now = new Date();
        const isFuture = deadline > now;
        const alreadySubmitted = submissions.some(s => s.poemId === poem.id && s.contestId === c.id);
        return isFuture && !alreadySubmitted;
    });

    if (availableContests.length === 0) {
        showNotification('No available contests to submit this poem to at the moment or you have already submitted to all open ones.', 'info');
        return;
    }

    // Create a modal to select a contest
    const selectContestModal = document.createElement('div');
    selectContestModal.className = 'modal show';
    selectContestModal.innerHTML = `
        <div class="modal-content" style="max-width: 600px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header">
                <div class="modal-favicon">📨</div>
                <div>
                    <div class="modal-title">Submit "${poem.title}"</div>
                    <div class="modal-organization">Select a contest to submit your poem to:</div>
                </div>
            </div>

            <div style="margin: 1.5rem 0;">
                <div id="contestSelectionList" style="max-height: 400px; overflow-y: auto; border: 1px solid var(--border); border-radius: 0.5rem; padding: 1rem;">
                    ${availableContests.map(contest => `
                        <label style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border-radius: 0.375rem; cursor: pointer; transition: background 0.2s;"
                               onmouseover="this.style.background='var(--background)'"
                               onmouseout="this.style.background='transparent'">
                            <input type="radio" name="selectedContest" value="${contest.id}">
                            <div style="flex: 1;">
                                <div style="font-weight: 600; margin-bottom: 0.25rem;">${contest.name}</div>
                                <div style="font-size: 0.875rem; color: var(--text-secondary);">
                                    ${contest.organization} • Deadline: ${new Date(contest.deadline).toLocaleDateString()} • Prize: $${contest.prize.toLocaleString()}
                                </div>
                            </div>
                        </label>
                    `).join('')}
                </div>
            </div>

            <div class="modal-actions">
                <button class="btn" onclick="this.closest('.modal').remove()">Cancel</button>
                <button class="btn btn-primary" id="confirmSubmissionBtn" disabled>Confirm Submission</button>
            </div>
        </div>
    `;
    document.body.appendChild(selectContestModal);

    const confirmSubmissionBtn = selectContestModal.querySelector('#confirmSubmissionBtn');
    const radioButtons = selectContestModal.querySelectorAll('input[name="selectedContest"]');

    radioButtons.forEach(radio => {
        radio.addEventListener('change', () => {
            confirmSubmissionBtn.disabled = false;
        });
    });

    confirmSubmissionBtn.addEventListener('click', () => {
        const selectedContestId = selectContestModal.querySelector('input[name="selectedContest"]:checked')?.value;
        if (selectedContestId) {
            const selectedContest = contests.find(c => c.id == selectedContestId);
            if (selectedContest) {
                // Add submission record
                const newSubmission = {
                    id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    poemId: poem.id,
                    poemTitle: poem.title,
                    contestId: selectedContest.id,
                    contestName: selectedContest.name,
                    organization: selectedContest.organization,
                    prize: selectedContest.prize,
                    deadline: selectedContest.deadline,
                    submittedDate: new Date().toISOString(),
                    status: 'submitted', // Initial status
                    notes: ''
                };
                submissions.push(newSubmission);
                saveSubmissions();

                // Update poem status to 'submitted'
                const poemIndex = poems.findIndex(p => p.id === poem.id);
                if (poemIndex !== -1) {
                    poems[poemIndex].status = 'submitted';
                    poems[poemIndex].modified = new Date().toISOString();
                    savePoems();
                    renderPoems(); // Re-render poems to show updated status
                }

                showNotification(`"${poem.title}" submitted to "${selectedContest.name}"!`, 'success');
                selectContestModal.remove();
                // Optionally open the contest URL
                if (selectedContest.url) {
                    window.open(selectedContest.url, '_blank', 'noopener,noreferrer');
                }
                switchTab('submissions'); // Go to submissions tab
            }
        } else {
            showNotification('Please select a contest.', 'error');
        }
    });
}


function openResource(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
}

// Add hover effects for resource cards when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    // ... existing initialization code ...

    // Add resource card hover effects after a delay to ensure they exist
    setTimeout(() => {
        const resourceCards = document.querySelectorAll('.resource-card');
        resourceCards.forEach(card => {
            card.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-4px)';
                this.style.boxShadow = 'var(--shadow-lg)';
                this.style.borderColor = 'var(--primary)';
            });

            card.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
                this.style.borderColor = 'var(--border)';
            });
        });
    }, 500);
});
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js')
            .then(function (registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function (err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Handle install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Show install button
    const installBtn = document.createElement('button');
    installBtn.className = 'btn';
    installBtn.innerHTML = '📱 Install App';
    installBtn.onclick = () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            deferredPrompt = null;
            installBtn.remove();
        });
    };

    const headerActions = document.querySelector('.header-actions');
    const themeToggle = document.getElementById('themeToggle');
    if (headerActions && themeToggle) {
        headerActions.insertBefore(installBtn, themeToggle);
    }
});