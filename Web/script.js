// Global variables for table management
let allBookings = [];
let currentPage = 1;
let entriesPerPage = 10;
let sortColumn = 'BID';
let sortDirection = 'asc';
let currentSearchTerm = '';

// Handle login form submission
document.getElementById('loginForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Store authentication token
            localStorage.setItem('authToken', data.token);
            window.location.href = 'dashboard.html';
        } else {
            errorMsg.textContent = data.message || 'Login failed';
            errorMsg.style.display = 'block';
        }
    } catch (error) {
        errorMsg.textContent = 'An error occurred. Please try again.';
        errorMsg.style.display = 'block';
        console.error('Login error:', error);
    }
});

// Handle logout
document.getElementById('logoutBtn')?.addEventListener('click', function() {
    localStorage.removeItem('authToken');
    window.location.href = 'index.html';
});

// Check if user is authenticated
function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (!token && window.location.pathname.endsWith('dashboard.html')) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Load all bookings
async function loadAllBookings() {
    if (!checkAuth()) return;
    
    const loadingElement = document.getElementById('loading');
    const bookingDetails = document.getElementById('bookingDetails');
    
    loadingElement.style.display = 'block';
    bookingDetails.innerHTML = '';
    
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('/api/all-bookings', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            allBookings = data.bookings;
            loadingElement.style.display = 'none';
            renderBookingsTable();
            setupTableSorting();
        } else {
            bookingDetails.innerHTML = `<p>Error: ${data.message}</p>`;
            loadingElement.style.display = 'none';
        }
    } catch (error) {
        bookingDetails.innerHTML = '<p>An error occurred. Please try again.</p>';
        loadingElement.style.display = 'none';
        console.error('Load bookings error:', error);
    }
}

// Render bookings table with pagination
function renderBookingsTable() {
    const bookingDetails = document.getElementById('bookingDetails');
    const pageInfo = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    
    // Filter bookings if search term exists
    let filteredBookings = allBookings;
    if (currentSearchTerm) {
        const searchTerm = currentSearchTerm.toLowerCase();
        filteredBookings = allBookings.filter(booking => 
            Object.values(booking).some(value => 
                value && value.toString().toLowerCase().includes(searchTerm)
            )
        );
    }
    
    // Sort bookings
    filteredBookings.sort((a, b) => {
        let valueA = a[sortColumn];
        let valueB = b[sortColumn];
        
        // Handle numeric values
        if (!isNaN(valueA) && !isNaN(valueB)) {
            valueA = Number(valueA);
            valueB = Number(valueB);
        }
        
        if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredBookings.length / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = Math.min(startIndex + entriesPerPage, filteredBookings.length);
    const pageBookings = filteredBookings.slice(startIndex, endIndex);
    
    // Update pagination controls
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    // Create table
    if (filteredBookings.length === 0) {
        bookingDetails.innerHTML = '<div class="no-results">No bookings found</div>';
        return;
    }
    
    let tableHTML = `
        <table class="booking-table">
            <thead>
                <tr>
                    <th data-column="BID">Booking ID ${sortColumn === 'BID' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                    <th data-column="date1">Date ${sortColumn === 'date1' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                    <th data-column="time1">Time ${sortColumn === 'time1' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                    <th data-column="rooms">Rooms ${sortColumn === 'rooms' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                    <th data-column="roomtype">Room Type ${sortColumn === 'roomtype' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                    <th data-column="days">Days ${sortColumn === 'days' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                    <th data-column="cost">Cost ${sortColumn === 'cost' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                    <th data-column="confirm">Confirmed ${sortColumn === 'confirm' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    pageBookings.forEach(booking => {
        tableHTML += `
            <tr>
                <td>${booking.BID}</td>
                <td>${booking.date1}</td>
                <td>${booking.time1}</td>
                <td>${booking.rooms}</td>
                <td>${booking.roomtype}</td>
                <td>${booking.days}</td>
                <td>${booking.cost}</td>
                <td>${booking.confirm ? 'Yes' : 'No'}</td>
            </tr>
        `;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    bookingDetails.innerHTML = tableHTML;
}

// Setup table sorting
function setupTableSorting() {
    document.querySelectorAll('.booking-table th[data-column]').forEach(th => {
        th.addEventListener('click', () => {
            const column = th.getAttribute('data-column');
            
            if (sortColumn === column) {
                sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                sortColumn = column;
                sortDirection = 'asc';
            }
            
            renderBookingsTable();
        });
    });
}

// Handle search form submission
document.getElementById('searchForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!checkAuth()) return;
    
    const bookingId = document.getElementById('bookingId').value;
    
    if (!bookingId) {
        loadAllBookings();
        return;
    }
    
    const bookingDetails = document.getElementById('bookingDetails');
    const loadingElement = document.getElementById('loading');
    
    loadingElement.style.display = 'block';
    bookingDetails.innerHTML = '';
    
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`/api/booking/${bookingId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            loadingElement.style.display = 'none';
            
            if (data.booking) {
                // Highlight the searched booking in the full table
                currentSearchTerm = bookingId;
                loadAllBookings();
                
                // After a short delay, scroll to the booking
                setTimeout(() => {
                    const rows = document.querySelectorAll('.booking-table tr');
                    for (let row of rows) {
                        if (row.textContent.includes(bookingId)) {
                            row.classList.add('highlight');
                            row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            break;
                        }
                    }
                }, 500);
            } else {
                bookingDetails.innerHTML = '<div class="no-results">No booking found with that ID.</div>';
            }
        } else {
            bookingDetails.innerHTML = `<p>Error: ${data.message}</p>`;
            loadingElement.style.display = 'none';
        }
    } catch (error) {
        bookingDetails.innerHTML = '<p>An error occurred. Please try again.</p>';
        loadingElement.style.display = 'none';
        console.error('Search error:', error);
    }
});

// Show all bookings
document.getElementById('showAllBtn')?.addEventListener('click', function() {
    document.getElementById('bookingId').value = '';
    currentSearchTerm = '';
    loadAllBookings();
});

// Handle entries per page change
document.getElementById('entriesSelect')?.addEventListener('change', function() {
    entriesPerPage = parseInt(this.value);
    currentPage = 1;
    renderBookingsTable();
});

// Handle table search
document.getElementById('searchInput')?.addEventListener('input', function() {
    currentSearchTerm = this.value;
    currentPage = 1;
    renderBookingsTable();
});

// Pagination handlers
document.getElementById('prevPageBtn')?.addEventListener('click', function() {
    if (currentPage > 1) {
        currentPage--;
        renderBookingsTable();
    }
});

document.getElementById('nextPageBtn')?.addEventListener('click', function() {
    const totalPages = Math.ceil(allBookings.length / entriesPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderBookingsTable();
    }
});

// Check authentication on page load and load bookings
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.endsWith('dashboard.html')) {
        if (checkAuth()) {
            loadAllBookings();
        }
    }
    
    // Test database connection on load
    if (window.location.pathname.endsWith('index.html')) {
        fetch('/api/test-db')
            .then(response => response.json())
            .then(data => {
                console.log('Database test:', data);
            })
            .catch(error => {
                console.error('Database test failed:', error);
            });
    }
});