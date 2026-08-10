/* ==========================================================================
   VoltSpot EV Network - External JavaScript (script.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Welcome Message Prompt
    const welcomeContainer = document.getElementById('welcome-message-container');
    if (welcomeContainer) {
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
        welcomeContainer.innerHTML = `
            <div style="background: #233554; padding: 15px; border-radius: 6px; border-left: 4px solid #00d285; margin-bottom: 20px;">
                <h3>⚡ Welcome, <span id="user-display-name">${escapeHTML(userName)}</span>!</h3>
                <p>Ready to charge up? Book a charging bay ahead of time.</p>
                <button id="change-name-btn" class="btn btn-secondary" style="margin-top:8px; padding: 4px 10px; font-size: 0.8rem;">Change Name</button>
            </div>
        `;
        document.getElementById('change-name-btn').addEventListener('click', () => {
            const newName = prompt('Enter your name:', userName);
            if (newName && newName.trim() !== '') {
                localStorage.setItem('voltspot_user', newName.trim());
                document.getElementById('user-display-name').textContent = newName.trim();
            }
        });
    }

    // 2. Interactive Search Filter
    const searchInput = document.getElementById('station-search');
    const stationCards = document.querySelectorAll('.station-card');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            stationCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(query) ? 'block' : 'none';
            });
        });
    }

    // 3. Dynamic Toggle Buttons
    const toggleBtns = document.querySelectorAll('.toggle-details-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const details = document.getElementById(targetId);
            if (details) {
                const isHidden = details.style.display === 'none' || details.style.display === '';
                details.style.display = isHidden ? 'block' : 'none';
                btn.textContent = isHidden ? 'Hide Details ▲' : 'View Station Details ▼';
            }
        });
    });

    // 4. Client-side Form Validation
    const reserveForm = document.getElementById('reservation-form');
    if (reserveForm) {
        reserveForm.addEventListener('submit', (event) => {
            let isValid = true;
            clearFormErrors();

            const fullname = document.getElementById('fullname');
            if (!fullname.value.trim()) {
                showError(fullname, 'Full name is required.');
                isValid = false;
            }

            const email = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
                showError(email, 'Valid email address is required.');
                isValid = false;
            }

            const phone = document.getElementById('phone');
            if (!phone.value.trim()) {
                showError(phone, 'Phone number is required.');
                isValid = false;
            }

            const location = document.getElementById('location');
            if (!location.value) {
                showError(location, 'Please select a station.');
                isValid = false;
            }

            const date = document.getElementById('date');
            if (!date.value) {
                showError(date, 'Reservation date is required.');
                isValid = false;
            }

            const time = document.getElementById('time');
            if (!time.value) {
                showError(time, 'Arrival time is required.');
                isValid = false;
            }

            // Stop form submit ONLY if validation fails
            if (!isValid) {
                event.preventDefault();
            }
        });
    }
});

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

function clearFormErrors() {
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    document.querySelectorAll('.error-message').forEach(el => el.remove());
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}
