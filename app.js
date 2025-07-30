// Global variables for contest data
// These need to be declared at a scope accessible by all functions that use them.
let contests = [];
let filteredContests = [];
// Assuming sampleContests is defined elsewhere or is an empty array initially.
// If it's meant to be a baseline, it should be populated with initial data.
const sampleContests = []; // Initialize as empty, or with your default contests if any.

// Placeholder functions for external dependencies (if not defined elsewhere in your app.js)
// In a real application, ensure these are properly defined.
function saveContests() {
    console.log('Contests saved (placeholder function).');
}

function generateCalendar() {
    console.log('Calendar regenerated (placeholder function).');
    // This is where you would update your UI to display the contests.
    // For this example, we'll log the current state of filteredContests.
    console.log('Current filtered contests:', filteredContests);
    // You might also want to trigger a UI update for the list of contests here.
    updateContestsDisplay(); // Call a new function to update the display
}

function showNotification(message, type) {
    console.log(`Notification (${type}): ${message}`);
    // Implement your actual notification display logic here (e.g., a toast message)
}

// Function to parse contest data from NewPages and add to your existing contests
function addNewPagesContests() {
    const newPagesContests = [
        // JULY CONTESTS
        {
            id: 'rattle-poetry-prize-2025',
            name: 'Rattle Poetry Prize',
            organization: 'Rattle Magazine',
            deadline: '2025-07-15',
            prize: 15000,
            fee: 25,
            url: 'https://rattle.com/page/poetryprize/',
            favicon: 'R',
            description: '$15,000 for a single poem plus publication. Ten finalists receive $500 each.',
            entryFee: '$25',
            isFromNewPages: true
        },
        {
            id: 'red-wheelbarrow-2025',
            name: 'Red Wheelbarrow Poetry Prize',
            organization: 'Red Wheelbarrow Literary Magazine',
            deadline: '2025-07-31',
            prize: 1000,
            fee: 15,
            url: 'https://redwheelbarrow.submittable.com/submit',
            favicon: 'R',
            description: '$1,000 first place plus letterpress broadside, $500 second, $250 third. Top five published.',
            entryFee: '$15',
            isFromNewPages: true
        },
        {
            id: 'press53-poetry-award-2026',
            name: '2026 Press 53 Award for Poetry',
            organization: 'Press 53',
            deadline: '2025-07-31',
            prize: 1000,
            fee: 30,
            url: 'https://www.press53.com/award-for-poetry/',
            favicon: 'P',
            description: 'Publication, $1,000 advance, and 53 copies to an outstanding, unpublished poetry manuscript.',
            entryFee: '$30',
            isFromNewPages: true
        },
        {
            id: 'new-england-poetry-club-2025',
            name: 'New England Poetry Club Annual Contest',
            organization: 'New England Poetry Club',
            deadline: '2025-07-31',
            prize: 500,
            fee: 20,
            url: 'https://nepoetryclub.org/contests/',
            favicon: 'N',
            description: 'Annual writing & book contests with multiple categories.',
            entryFee: '$20',
            isFromNewPages: true
        },
        
        // AUGUST CONTESTS
        {
            id: 'coniston-prize-2025',
            name: 'The Coniston Prize',
            organization: 'Radar Poetry',
            deadline: '2025-08-01',
            prize: 1000,
            fee: 20,
            url: 'https://radarpoetry.submittable.com/submit',
            favicon: 'R',
            description: 'Recognizes exceptional group of poems by a woman writing in English. Winner receives $1,000, up to 10 finalists receive $175.',
            entryFee: '$20',
            isFromNewPages: true
        },
        {
            id: 'inverted-syntax-sublingua-2025',
            name: 'Sublingua Prize for Poetry',
            organization: 'Inverted Syntax',
            deadline: '2025-08-15',
            prize: 500,
            fee: 25,
            url: 'https://invertedsyntax.submittable.com/submit',
            favicon: 'I',
            description: '1st Book Award for exceptional debut collections by female-identifying writers.',
            entryFee: '$25',
            isFromNewPages: true
        },
        {
            id: 'inverted-syntax-aggrey-2025',
            name: 'Aggrey & Tabbikha Prize for Poetry',
            organization: 'Inverted Syntax',
            deadline: '2025-08-15',
            prize: 500,
            fee: 25,
            url: 'https://invertedsyntax.submittable.com/submit',
            favicon: 'I',
            description: 'For writers with first or second collections who identify as Black and/or part of the S.W.A.N.A diaspora.',
            entryFee: '$25',
            isFromNewPages: true
        },
        {
            id: 'banyan-poetry-prize-2025',
            name: 'The Banyan Poetry Prize',
            organization: 'The Banyan Review',
            deadline: '2025-08-31',
            prize: 1000,
            fee: 20,
            url: 'https://thebanyanreview.submittable.com/submit',
            favicon: 'B',
            description: 'Annual poetry prize recognizing outstanding contemporary poetry.',
            entryFee: '$20',
            isFromNewPages: true
        },
        
        // SEPTEMBER CONTESTS
        {
            id: 'academy-american-poets-first-book-2025',
            name: 'Academy of American Poets First Book Award',
            organization: 'Academy of American Poets',
            deadline: '2025-09-01',
            prize: 2500,
            fee: 25,
            url: 'https://poets.org/academy-american-poets/prizes/first-book-award',
            favicon: 'A',
            description: 'Recognizes and rewards a poet\'s first book published by an established press.',
            entryFee: '$25',
            isFromNewPages: true
        },
        {
            id: 'frontier-poetry-debut-2025',
            name: 'Debut Chapbook Prize',
            organization: 'Frontier Poetry',
            deadline: '2025-09-01',
            prize: 1000,
            fee: 20,
            url: 'https://www.frontierpoetry.com/calendar/',
            favicon: 'F',
            description: 'Annual debut chapbook prize for emerging poets.',
            entryFee: '$20',
            isFromNewPages: true
        },
        {
            id: 'naugatuck-river-narrative-2025',
            name: 'Narrative Poetry Contest',
            organization: 'Naugatuck River Review',
            deadline: '2025-09-01',
            prize: 500,
            fee: 15,
            url: 'https://naugatuckriverreview.com/contest/',
            favicon: 'N',
            description: 'Annual contest celebrating narrative poetry.',
            entryFee: '$15',
            isFromNewPages: true
        },
        
        // OCTOBER CONTESTS
        {
            id: 'tom-howard-poetry-2025',
            name: 'Tom Howard/Margaret Reid Poetry Contest',
            organization: 'Winning Writers',
            deadline: '2025-10-01',
            prize: 3000,
            fee: 20,
            url: 'https://winningwriters.com/our-contests/tom-howard-margaret-reid-poetry-contest',
            favicon: 'W',
            description: 'Accepts both published and unpublished poetry. $3,000 first prize.',
            entryFee: '$20',
            isFromNewPages: true
        },
        {
            id: 'wheelbarrow-books-prize-2025',
            name: 'Wheelbarrow Books Poetry Prize',
            organization: 'RCAH Center for Poetry',
            deadline: '2025-10-01',
            prize: 1000,
            fee: 25,
            url: 'https://poetry.rcah.msu.edu/wheelbarrow-books/index.html',
            favicon: 'W',
            description: 'Poetry prize for established poets (must have published at least one full-length book).',
            entryFee: '$25',
            isFromNewPages: true
        },
        
        // DECEMBER CONTESTS
        {
            id: 'birdcoat-quarterly-poetry-2025',
            name: 'Editors\' Choice Prize in Poetry',
            organization: 'Birdcoat Quarterly',
            deadline: '2025-12-01',
            prize: 500,
            fee: 20,
            url: 'https://www.birdcoatquarterly.com/contest',
            favicon: 'B',
            description: 'Annual poetry contest with cash prize and publication.',
            entryFee: '$20',
            isFromNewPages: true
        },
        {
            id: 'five-points-dickey-2025',
            name: 'James Dickey Prize for Poetry',
            organization: 'Five Points',
            deadline: '2025-12-01',
            prize: 1000,
            fee: 25,
            url: 'https://fivepoints.gsu.edu/james-dickey-prize-poetry/',
            favicon: 'F',
            description: 'Annual prize honoring James Dickey, recognizing outstanding contemporary poetry.',
            entryFee: '$25',
            isFromNewPages: true
        },
        {
            id: 'slipstream-chapbook-2025',
            name: 'Poetry Chapbook Competition',
            organization: 'Slipstream',
            deadline: '2025-12-01',
            prize: 1000,
            fee: 20,
            url: 'http://www.slipstreampress.org/contest.html',
            favicon: 'S',
            description: 'Annual chapbook competition with publication and cash prize.',
            entryFee: '$20',
            isFromNewPages: true
        },
        
        // JANUARY CONTESTS
        {
            id: 'smartish-pace-beullah-2026',
            name: 'Beullah Rose Poetry Prize',
            organization: 'Smartish Pace',
            deadline: '2026-01-01',
            prize: 1000,
            fee: 20,
            url: 'https://smartishpace.com/poetry-prizes/',
            favicon: 'S',
            description: 'Annual poetry prize recognizing excellence in contemporary poetry.',
            entryFee: '$20',
            isFromNewPages: true
        },
        {
            id: 'colorado-prize-poetry-2026',
            name: 'Colorado Prize for Poetry',
            organization: 'Colorado Review',
            deadline: '2026-01-14',
            prize: 2500,
            fee: 25,
            url: 'http://coloradoreview.colostate.edu/colorado-prize-for-poetry/',
            favicon: 'C',
            description: 'International poetry book manuscript contest. Winner receives $2,500 honorarium and publication.',
            entryFee: '$25',
            isFromNewPages: true
        },
        {
            id: 'rattle-chapbook-prize-2026',
            name: 'Rattle Chapbook Prize',
            organization: 'Rattle',
            deadline: '2026-01-15',
            prize: 1000,
            fee: 20,
            url: 'https://www.rattle.com/chapbooks/prize/',
            favicon: 'R',
            description: 'Annual chapbook contest with publication and cash prize.',
            entryFee: '$20',
            isFromNewPages: true
        },
        
        // FEBRUARY CONTESTS
        {
            id: 'arc-poetry-year-2026',
            name: 'Poem of the Year Contest',
            organization: 'Arc Poetry Magazine',
            deadline: '2026-02-01',
            prize: 1500,
            fee: 25,
            url: 'https://arcpoetry.ca/contest/poem-of-the-year/',
            favicon: 'A',
            description: 'Annual contest celebrating outstanding contemporary poetry.',
            entryFee: '$25 CAD',
            isFromNewPages: true
        },
        {
            id: 'malahat-long-poem-2026',
            name: 'Long Poem Prize',
            organization: 'The Malahat Review',
            deadline: '2026-02-01',
            prize: 1500,
            fee: 35,
            url: 'http://www.malahatreview.ca/contests/long_poem_prize/info.html',
            favicon: 'M',
            description: 'Biennial contest for long poems (300+ lines). Open in odd-numbered years.',
            entryFee: '$35 CAD',
            isFromNewPages: true
        },
        
        // APRIL CONTESTS
        {
            id: 'atlanta-review-international-2026',
            name: 'International Poetry Competition',
            organization: 'Atlanta Review',
            deadline: '2026-05-01',
            prize: 1000,
            fee: 25,
            url: 'https://atlantareview.submittable.com/submit',
            favicon: 'A',
            description: 'International poetry competition with multiple prizes.',
            entryFee: '$25',
            isFromNewPages: true
        },
        {
            id: 'wick-poetry-prize-2026',
            name: 'Stan & Tom Wick Poetry Prize',
            organization: 'Wick Poetry Center',
            deadline: '2026-05-01',
            prize: 2000,
            fee: 25,
            url: 'https://www.kent.edu/wick/stan-and-tom-wick-poetry-prize',
            favicon: 'W',
            description: 'Annual first book poetry prize with publication and cash award.',
            entryFee: '$25',
            isFromNewPages: true
        }
    ];

    return newPagesContests;
}

// Function to merge NewPages contests with existing contests
function integrateNewPagesContests() {
    const newPagesContests = addNewPagesContests();
    
    // Filter out any duplicates based on name and organization
    const uniqueNewContests = newPagesContests.filter(newContest => {
        // Access the global 'contests' variable here
        return !contests.some(existingContest => 
            existingContest.name === newContest.name && 
            existingContest.organization === newContest.organization
        );
    });
    
    // Add unique contests to the main contests array
    // Reassign the global 'contests' variable
    contests = [...contests, ...uniqueNewContests];
    // Reassign the global 'filteredContests' variable
    filteredContests = [...contests];
    
    // Save the updated contests
    saveContests();
    
    // Regenerate calendar to show new contests
    generateCalendar();
    
    return uniqueNewContests.length;
}

// Enhanced search functionality to find contests from NewPages
function searchNewPagesContests(searchTerm = '') {
    // Access the global 'contests' variable here
    const allContests = [...contests, ...addNewPagesContests()];
    
    if (!searchTerm) return allContests;
    
    const searchLower = searchTerm.toLowerCase();
    return allContests.filter(contest => 
        contest.name.toLowerCase().includes(searchLower) ||
        contest.organization.toLowerCase().includes(searchLower) ||
        contest.description.toLowerCase().includes(searchLower)
    );
}

// Function to add a "Sync NewPages" button to your interface
function addNewPagesSyncButton() {
    const headerActions = document.querySelector('.header-actions');
    const searchButton = document.getElementById('searchContests');
    
    if (headerActions && searchButton) {
        const syncButton = document.createElement('button');
        syncButton.className = 'btn';
        syncButton.innerHTML = '🔄 Sync NewPages';
        syncButton.id = 'syncNewPages';
        syncButton.title = 'Import latest poetry contests from NewPages';
        
        syncButton.addEventListener('click', function() {
            const addedCount = integrateNewPagesContests();
            showNotification(`Added ${addedCount} new contests from NewPages!`, 'success');
        });
        
        headerActions.insertBefore(syncButton, searchButton);
    }
}

// Enhanced contest modal to show NewPages source
function showNewPagesContestDetails(contest) {
    // Assuming showContestDetails is defined elsewhere
    // For now, let's just log the contest details.
    console.log('Showing contest details:', contest);
    // const modal = showContestDetails(contest); // Call existing function
    
    // Add NewPages attribution if it's from NewPages
    if (contest.isFromNewPages) {
        // This part needs the actual modal structure to append to.
        // For demonstration, we'll just log.
        console.log('This contest is from NewPages.com Contest Database');
        /*
        const modalDetails = document.querySelector('#contestModal .modal-details');
        if (modalDetails) {
            const sourceElement = document.createElement('div');
            sourceElement.className = 'detail-item newpages-source';
            sourceElement.innerHTML = `
                <span class="detail-label">Source</span>
                <span class="detail-value" style="color: var(--primary);">
                    📚 NewPages.com Contest Database
                </span>
            `;
            modalDetails.appendChild(sourceElement);
        }
        */
    }
}

// Function to filter contests by source
function filterContestsBySource(source = 'all') {
    switch (source) {
        case 'newpages':
            // Access the global 'contests' variable here
            filteredContests = contests.filter(contest => contest.isFromNewPages);
            break;
        case 'builtin':
            // Access the global 'contests' variable here
            filteredContests = contests.filter(contest => !contest.isFromNewPages);
            break;
        default:
            // Access the global 'contests' variable here
            filteredContests = [...contests];
    }
    
    generateCalendar();
}

// Enhanced filter panel with source filter
function enhanceFilterPanel() {
    const filterPanel = document.getElementById('filterPanel');
    if (!filterPanel) return;
    
    const sourceFilterHTML = `
        <div>
            <label style="font-size: 0.875rem; color: var(--text-secondary); display: block; margin-bottom: 0.25rem;">Contest Source</label>
            <select id="sourceFilter" style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; background: var(--surface); color: var(--text-primary);">
                <option value="all">All Sources</option>
                <option value="builtin">Built-in Contests</option>
                <option value="newpages">NewPages.com</option>
            </select>
        </div>
    `;
    
    const gridContainer = filterPanel.querySelector('div[style*="grid-template-columns"]');
    if (gridContainer) {
        gridContainer.insertAdjacentHTML('beforeend', sourceFilterHTML);
        
        // Add event listener for source filter
        const sourceFilter = document.getElementById('sourceFilter');
        if (sourceFilter) {
            sourceFilter.addEventListener('change', function() {
                filterContestsBySource(this.value);
            });
        }
    }
}

// Auto-sync function to periodically check for new contests
function setupAutoSync() {
    const lastSync = localStorage.getItem('lastNewPagesSync');
    const now = new Date().getTime();
    const oneWeek = 7 * 24 * 60 * 60 * 1000; // One week in milliseconds
    
    if (!lastSync || (now - parseInt(lastSync)) > oneWeek) {
        // Auto-sync if it's been more than a week
        setTimeout(() => {
            const addedCount = integrateNewPagesContests();
            if (addedCount > 0) {
                showNotification(`Auto-synced ${addedCount} new contests from NewPages!`, 'info');
            }
            localStorage.setItem('lastNewPagesSync', now.toString());
        }, 2000); // Delay to let the app load first
    }
}

// Initialize NewPages integration
function initializeNewPagesIntegration() {
    // Add sync button to interface
    addNewPagesSyncButton();
    
    // Enhance filter panel
    enhanceFilterPanel();
    
    // Setup auto-sync
    setupAutoSync();
    
    // Add NewPages contests on first load if none exist
    // This condition needs to be carefully managed if sampleContests is dynamic or empty.
    // For now, it will always add NewPages contests if 'contests' is empty or only contains sampleContests.
    if (contests.length <= sampleContests.length) {
        const addedCount = integrateNewPagesContests();
        if (addedCount > 0) {
            showNotification(`Loaded ${addedCount} poetry contests from NewPages!`, 'success');
        }
    }
}

// Function to update the display of contests (e.g., in a list or calendar)
// This is a new function added to help visualize the changes.
function updateContestsDisplay() {
    const contestsListElement = document.getElementById('contestsList'); // Assuming you have an element with this ID
    if (contestsListElement) {
        contestsListElement.innerHTML = ''; // Clear existing list
        if (filteredContests.length === 0) {
            contestsListElement.innerHTML = '<p>No contests to display.</p>';
            return;
        }
        filteredContests.forEach(contest => {
            const li = document.createElement('li');
            li.textContent = `${contest.name} (${contest.organization}) - Deadline: ${contest.deadline}`;
            contestsListElement.appendChild(li);
        });
    } else {
        console.log('No element with ID "contestsList" found to display contests.');
    }
}


// Call this function after your DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add a delay to ensure your existing app is initialized first
    setTimeout(() => {
        // Load initial contests (if any) or from localStorage
        // For this fix, we assume initial contests might be loaded here
        // or that the first call to integrateNewPagesContests will populate it.
        // If you have existing contests stored, load them here before calling initializeNewPagesIntegration.
        // Example: loadContestsFromLocalStorage();
        
        initializeNewPagesIntegration();
        generateCalendar(); // Initial calendar generation after integration
    }, 1000);
});

// Export functions for use in other parts of your app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addNewPagesContests,
        integrateNewPagesContests,
        searchNewPagesContests,
        filterContestsBySource,
        initializeNewPagesIntegration
    };
}