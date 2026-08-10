/* ==========================================================================
   VoltSpot EV Network - External JavaScript (script.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------------------
    // 1. Personalized Welcome Message (Home Page - Requirement 1)
    // ----------------------------------------------------------------------
    const welcomeContainer = document.getElementById('welcome-message-container');
    
    if (welcomeContainer) {
        // Retrieve name from localStorage or prompt user
        let userName = localStorage.getItem('voltspot_user');

        if (!userName) {
            userName = prompt('Welcome to VoltSpot! Please enter your name:');
            if (userName && userName.trim() !== '') {
                userName = userName.trim();
                localStorage.setItem('voltspot_user', userName);
            } else {
                userName = 'Valued Driver';
            }
        }

        // Display personalized welcome banner
        welcomeContainer.innerHTML = `
            <div class="welcome-banner" style="background: #112240; padding: 15px; border-radius: 8px; border-left: 4px solid #00d285; margin-bottom: 20px;">
                <h3 style="margin: 0 0 5px 0;">⚡ Welcome back, <span id="user-display-name">${escapeHTML(userName)}</span>!</h3>
                <p style="margin: 0 0 10px 0;">Ready to charge up? Check out our available hubs or book a bay ahead of time.</p>
                <button id="change-name-btn" class="btn btn-sm" style="padding: 5px 10px; cursor: pointer;">Change Name</button>
            </div>
        `;

        // Allow user to reset/change their name dynamically
        document.getElementById('change-name-btn').addEventListener('click', () => {
            const newName = prompt('Enter your preferred name:', userName);
            if (newName && newName.trim() !== '') {
                localStorage.setItem('voltspot_user', newName.trim());
                document.getElementById('user-display-name').textContent = newName.trim();
            }
        });
    }

    // ----------------------------------------------------------------------
    // 2. Interactive Feature 1: Live Filter Search (Stations Page - Requirement 3)
    // ----------------------------------------------------------------------
    const searchInput = document.getElementById('station-search');
    const stationCards = document.querySelectorAll('.station-card');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            stationCards.forEach(card => {
                const textContent = card.textContent.toLowerCase();
                if (textContent.includes(query)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // ----------------------------------------------------------------------
    // 3. Interactive Feature 2: Expandable Details & Live Fare Calculator 
    //    (Home & Stations Page - Requirement 3)
    // ----------------------------------------------------------------------
    const toggleBtns = document.querySelectorAll('.toggle-details-btn');

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const detailsElement = document.getElementById(targetId);

            if (detailsElement) {
                const isHidden = detailsElement.style.display === 'none' || detailsElement.style.display === '';
                detailsElement.style.display = isHidden ? 'block' : 'none';
                btn.textContent = isHidden ? 'Hide Details ▲' : 'View Station Details ▼';
            }
        });
    });

    // Dynamic Fare Calculator
    const calculateBtn = document.getElementById('calc-fare-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', () => {
            const hoursInput = document.getElementById('charging-hours').value;
            const rateSelect = document.getElementById('charger-rate').value;
            const resultBox = document.getElementById('calc-result');

            if (!hoursInput || hoursInput <= 0) {
                resultBox.innerHTML = '<span class="error-text" style="color: #e74c3c;">Please enter a valid duration in hours.</span>';
                resultBox.style.display = 'block';
                return;
            }

            const cost = (parseFloat(hoursInput) * parseFloat(rateSelect)).toFixed(2);
            resultBox.innerHTML = `<strong>Estimated Cost:</strong> $${cost} USD`;
            resultBox.style.display = 'block';
            resultBox.style.color = '#00d285';
        });
    }

    // ----------------------------------------------------------------------
    // 4. Form Validation & Database Submission (Reserve Page - Requirement 2 & 5)
    // ----------------------------------------------------------------------
    const reserveForm = document.getElementById('reservation-form');

    if (reserveForm) {
        reserveForm.addEventListener('submit', (event) => {
            let isValid = true;
            clearFormErrors();

            // Validate Text Input (Full Name)
            const fullname = document.getElementById('fullname');
            if (!fullname.value.trim()) {
                showError(fullname, 'Full name is required.');
                isValid = false;
            }

            // Validate Email
            const email = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim()) {
                showError(email, 'Email address is required.');
                isValid = false;
            } else if (!emailRegex.test(email.value.trim())) {
                showError(email, 'Please enter a valid email address.');
                isValid = false;
            }

            // Validate Phone Number
            const phone = document.getElementById('phone');
            if (!phone.value.trim()) {
                showError(phone, 'Phone number is required.');
                isValid = false;
            }

            // Validate Select Option
            const location = document.getElementById('location');
            if (!location.value) {
                showError(location, 'Please select a charging hub location.');
                isValid = false;
            }

            // Validate Date
            const date = document.getElementById('date');
            if (!date.value) {
                showError(date, 'Reservation date is required.');
                isValid = false;
            }

            // Validate Time
            const time = document.getElementById('time');
            if (!time.value) {
                showError(time, 'Arrival time is required.');
                isValid = false;
            }

            // If ANY validation fails, stop form submission to show errors.
            // If validation passes, we DO NOT call preventDefault(), allowing POST to process_reserve.php
            if (!isValid) {
                event.preventDefault();
            }
        });
    }

});

/* ==========================================================================
   Helper Functions
   ========================================================================== */

// Helper to render inline error messages
function showError(inputElement, message) {
    inputElement.classList.add('input-error');
    const parent = inputElement.parentElement;
    
    const errorDisplay = document.createElement('small');
    errorDisplay.className = 'error-message';
    errorDisplay.textContent = message;
    errorDisplay.style.color = '#e74c3c';
    errorDisplay.style.display = 'block';
    errorDisplay.style.marginTop = '4px';

    parent.appendChild(errorDisplay);
}

// Helper to clear existing error indicators
function clearFormErrors() {
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    document.querySelectorAll('.error-message').forEach(el => el.remove());
}

// Security sanitizer against XSS
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
