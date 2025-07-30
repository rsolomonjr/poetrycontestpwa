// Real contest data based on current poetry contest landscape
const sampleContests = [
    {
        id: 1,
        name: "Rattle Poetry Prize",
        organization: "Rattle Magazine",
        deadline: "2025-07-15",
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
        deadline: "2025-10-31",
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
        deadline: "2025-09-30",
        prize: 3000,
        fee: 25,
        url: "https://winningwriters.com/our-contests/tom-howard-margaret-reid-poetry-contest",
        favicon: "W",
        description: "$3,000 first prize. Accepts both published and unpublished poetry.",
        entryFee: "$25"
    }
];

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
document.addEventListener('DOMContentLoaded', function() {
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
        tab.addEventListener('click', function() {
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
        themeSelect.addEventListener('change', function() {
            currentTheme = this.value;
            localStorage.setItem('theme', currentTheme);
            applyTheme(currentTheme);
        });
    }

    // Contest management
    const addContest = document.getElementById('addContest');
    const searchContests = document.getElementById('searchContests');
    
    if (addContest) {
        addContest.addEventListener('click', addCustomContest);
    }
    
    if (searchContests) {
        searchContests.addEventListener('click', searchContests);
    }

    // Poem management
    const addNewPoem = document.getElementById('addNewPoem');
    const importPoems = document.getElementById('importPoems');
    const poemSearch = document.getElementById('poemSearch');
    const tagFilter = document.getElementById('tagFilter');
    const sortPoems = document.getElementById('sortPoems');
    
    if (addNewPoem) {
        addNewPoem.addEventListener('click', addNewPoem);
    }
    
    if (importPoems) {
        importPoems.addEventListener('click', importPoems);
    }
    
    const words = text.trim().split(/\s+/).length;
    const lines = text.split('\n').length;

    const poem = {
        id: existingPoem ? existingPoem.id : `poem-${Date.now()}`,
        title,
        text,
        category,
        status,
        tags,
        notes,
        wordCount: words,
        lineCount: lines,
        created: existingPoem ? existingPoem.created : new Date().toISOString(),
        modified: new Date().toISOString()
    };

    if (existingPoem) {
        const index = poems.findIndex(p => p.id === existingPoem.id);
        poems[index] = poem;
    } else {
        poems.push(poem);
    }

    savePoems();
    filteredPoems = [...poems];
    renderPoems();
    updateTagFilter();
    
    document.querySelector('.modal')?.remove();
    
    showNotification('Poem saved successfully!', 'success');
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
        <div class="poem-card" style="background: var(--surface); border: 1px solid var(--border); border-radius: 0.75rem; padding: 1.5rem; transition: all 0.2s; cursor: pointer;" onclick="viewPoem('${poem.id}')">
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
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        card.addEventListener('mouseleave', function() {
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
                    ${poem.text}
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
    const poem = poems.find(p => p.id === poemId);
    if (!poem) return;

    addNewPoem(); // Open the form

    // Populate with existing data
    setTimeout(() => {
        const poemTitle = document.getElementById('poemTitle');
        const poemText = document.getElementById('poemText');
        const poemCategory = document.getElementById('poemCategory');
        const poemStatus = document.getElementById('poemStatus');
        const poemTags = document.getElementById('poemTags');
        const poemNotes = document.getElementById('poemNotes');
        
        if (poemTitle) poemTitle.value = poem.title;
        if (poemText) poemText.value = poem.text;
        if (poemCategory) poemCategory.value = poem.category;
        if (poemStatus) poemStatus.value = poem.status;
        if (poemTags) poemTags.value = poem.tags.join(', ');
        if (poemNotes) poemNotes.value = poem.notes;

        // Update word count display
        const wordCountSpan = document.getElementById('poemWordCount');
        const lineCountSpan = document.getElementById('poemLineCount');
        if (wordCountSpan) wordCountSpan.textContent = poem.wordCount;
        if (lineCountSpan) lineCountSpan.textContent = poem.lineCount;

        // Change save button behavior
        const saveBtn = document.querySelector('.modal .btn-primary');
        if (saveBtn) {
            saveBtn.textContent = 'Update Poem';
            saveBtn.onclick = () => savePoem(poem);
        }
    }, 100);
}

function deletePoem(poemId) {
    const poem = poems.find(p => p.id === poemId);
    if (!poem) return;

    if (confirm(`Are you sure you want to delete "${poem.title}"? This action cannot be undone.`)) {
        poems = poems.filter(p => p.id !== poemId);
        filteredPoems = filteredPoems.filter(p => p.id !== poemId);
        savePoems();
        renderPoems();
        updateTagFilter();
        showNotification('Poem deleted', 'success');
    }
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
        alert('Please select an image file');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image file too large. Please choose a file under 5MB.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
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
    navTabs.insertBefore(submissionsTab, navTabs.children[navTabs.children.length - 1]);

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
    submissionsTab.addEventListener('click', function() {
        switchTab('submissions');
        renderSubmissions();
    });
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

    const newStatus = prompt(`Update status for "${submission.poemTitle}":\n\nCurrent: ${submission.status}\n\nEnter new status (submitted/pending/accepted/rejected):`, submission.status);
    
    if (newStatus && ['submitted', 'pending', 'accepted', 'rejected'].includes(newStatus.toLowerCase())) {
        submission.status = newStatus.toLowerCase();
        submission.lastUpdated = new Date().toISOString();
        saveSubmissions();
        renderSubmissions();
        showNotification('Submission status updated!', 'success');
    }
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

// Placeholder functions for features to be implemented
function addCustomContest() {
    showNotification('Custom contest feature coming soon!', 'info');
}

function searchContests() {
    showNotification('Contest search feature coming soon!', 'info');
}

function importPoems() {
    showNotification('Poem import feature coming soon!', 'info');
}

function exportData() {
    showNotification('Data export feature coming soon!', 'info');
}

function importData() {
    showNotification('Data import feature coming soon!', 'info');
}

function clearCache() {
    showNotification('Cache clear feature coming soon!', 'info');
}

function resetApp() {
    showNotification('App reset feature coming soon!', 'info');
}

function submitToContests(poemId) {
    showNotification('Contest submission feature coming soon!', 'info');
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
    const existingElements = modal.querySelectorAll('.contest-description, .contest-submissions');
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
                alert('You need to add some poems first before submitting to contests!');
                closeModal();
                switchTab('poems');
                return;
            }
            window.open(contest.url, '_blank');
        };
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
    const filterSummary = document.createElement('div');
    filterSummary.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary);
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        font-size: 0.875rem;
        word-wrap: break-word;
        max-width: 250px;
    `;
    filterSummary.textContent = `Showing ${filteredContests.length} of ${contests.length} contests`;
    document.body.appendChild(filterSummary);
    
    setTimeout(() => filterSummary.remove(), 3000);
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
function addNewPoem() {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header">
                <div class="modal-favicon">📝</div>
                <div>
                    <div class="modal-title">New Poem</div>
                    <div class="modal-organization">Create a new poem for submissions</div>
                </div>
            </div>
            
            <form id="poemForm" style="display: flex; flex-direction: column; gap: 1rem;">
                <div>
                    <label style="display: block; margin-bottom: 0.25rem; font-weight: 500;">Title *</label>
                    <input type="text" id="poemTitle" required style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; background: var(--surface); color: var(--text-primary);">
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 0.25rem; font-weight: 500;">Poem Text *</label>
                    <textarea id="poemText" required rows="12" placeholder="Enter your poem here..." style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; background: var(--surface); color: var(--text-primary); resize: vertical; font-family: 'Georgia', serif; line-height: 1.6; word-wrap: break-word; overflow-wrap: break-word; white-space: pre-wrap;"></textarea>
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
                    <input type="text" id="poemTags" placeholder="love, nature, personal, contest2025" style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; background: var(--surface); color: var(--text-primary);">
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 0.25rem; font-weight: 500;">Notes</label>
                    <textarea id="poemNotes" rows="3" placeholder="Notes about this poem, inspiration, contest targets..." style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; background: var(--surface); color: var(--text-primary); resize: vertical;"></textarea>
                </div>
            </form>

            <div class="modal-actions">
                <button class="btn" onclick="this.closest('.modal').remove()">Cancel</button>
                <button class="btn" id="saveDraft">Save as Draft</button>
                <button class="btn btn-primary" onclick="savePoem()">Save Poem</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    
    // Add event listeners for word count
    const textArea = modal.querySelector('#poemText');
    const wordCountSpan = modal.querySelector('#poemWordCount');
    const lineCountSpan = modal.querySelector('#poemLineCount');
    
    if (textArea && wordCountSpan && lineCountSpan) {
        textArea.addEventListener('input', function() {
            const text = this.value;
            const words = text.trim() ? text.trim().split(/\s+/).length : 0;
            const lines = text.split('\n').length;
            wordCountSpan.textContent = words;
            lineCountSpan.textContent = lines;
        });
    }
    
    // Save as draft handler
    const saveDraftBtn = modal.querySelector('#saveDraft');
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', function() {
            const poemStatus = document.getElementById('poemStatus');
            if (poemStatus) {
                poemStatus.value = 'draft';
            }
            savePoem();
        });
    }
}

function savePoem(existingPoem = null) {
    const title = document.getElementById('poemTitle')?.value;
    const text = document.getElementById('poemText')?.value;
    const category = document.getElementById('poemCategory')?.value;
    const status = document.getElementById('poemStatus')?.value;
    const tags = document.getElementById('poemTags')?.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    const notes = document.getElementById('poemNotes')?.value;

    if (!title || !text) {
        alert('Please fill in the title and poem text');
        return;
    }

    const words = text.trim// Real contest data based on current poetry contest landscape
const sampleContests = [
    {
        id: 1,
        name: "Rattle Poetry Prize",
        organization: "Rattle Magazine",
        deadline: "2025-07-15",
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
        deadline: "2025-10-31",
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
        deadline: "2025-09-30",
        prize: 3000,
        fee: 25,
        url: "https://winningwriters.com/our-contests/tom-howard-margaret-reid-poetry-contest",
        favicon: "W",
        description: "$3,000 first prize. Accepts both published and unpublished poetry.",
        entryFee: "$25"
    }
];

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
document.addEventListener('DOMContentLoaded', function() {
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
        tab.addEventListener('click', function() {
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
        themeSelect.addEventListener('change', function() {
            currentTheme = this.value;
            localStorage.setItem('theme', currentTheme);
            applyTheme(currentTheme);
        });
    }

    // Contest management
    const addContest = document.getElementById('addContest');
    const searchContests = document.getElementById('searchContests');
    
    if (addContest) {
        addContest.addEventListener('click', addCustomContest);
    }
    
    if (searchContests) {
        searchContests.addEventListener('click', searchContests);
    }

    // Poem management
    const addNewPoem = document.getElementById('addNewPoem');
    const importPoems = document.getElementById('importPoems');
    const poemSearch = document.getElementById('poemSearch');
    const tagFilter = document.getElementById('tagFilter');
    const sortPoems = document.getElementById('sortPoems');
    
    if (addNewPoem) {
        addNewPoem.addEventListener('click', addNewPoem);
    }
    
    if (importPoems) {
        importPoems.addEventListener('click', importPoems);
    }
    
    if