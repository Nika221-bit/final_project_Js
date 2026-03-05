let allRooms = [];
let allBookings = [];

// Load bookings from API or localStorage as fallback
function loadBookings() {
    fetch('https://hotelbooking.stepprojects.ge/api/Booking')
    .then(response => response.json())
    .then(data => {
        allBookings = data.map(apiBooking => {
            const room = allRooms.find(r => r.id == apiBooking.roomID);
            const checkIn = new Date(apiBooking.checkInDate);
            const checkOut = new Date(apiBooking.checkOutDate);
            const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
            return {
                id: apiBooking.id,
                apiId: apiBooking.id,
                roomId: apiBooking.roomID,
                roomName: room ? room.name : 'Unknown',
                roomPrice: room ? room.pricePerNight : 0,
                checkInDate: apiBooking.checkInDate.split('T')[0],
                checkOutDate: apiBooking.checkOutDate.split('T')[0],
                nights: nights,
                totalPrice: apiBooking.totalPrice,
                clientName: apiBooking.customerName || '',
                clientPhone: apiBooking.customerPhone || '',
                clientEmail: apiBooking.customerId || '',
                bookingDate: new Date().toLocaleDateString('ka-GE')
            };
        });
        saveBookings();
        displayBookings();
    })
    .catch(error => {
        console.error('Failed to load from API, using localStorage:', error);
        const saved = localStorage.getItem('hotelBookings');
        allBookings = saved ? JSON.parse(saved) : [];
        displayBookings();
    });
}

// Save bookings to localStorage
function saveBookings() {
    localStorage.setItem('hotelBookings', JSON.stringify(allBookings));
}

// Fetch rooms and populate dropdown
fetch('https://hotelbooking.stepprojects.ge/api/Hotels/GetHotel/1', {
    method: 'GET'
})
.then((response) => response.json())
.then((data) => {
    allRooms = data.rooms && Array.isArray(data.rooms) ? data.rooms : [];
    populateRoomDropdown();
    loadBookings();
})
.catch((error) => {
    console.error("შეცდომა:", error);
});

// Populate room dropdown
async function populateRoomDropdown() {
    const roomSelect = document.getElementById('roomSelect');
    roomSelect.innerHTML = '<option value="">-- აირჩიეთ ოთახი --</option>';
    
    allRooms.forEach(room => {
        const option = document.createElement('option');
        option.value = room.id;
        option.textContent = `${room.name} - $${room.pricePerNight}/ღამე (მაქს. ${room.maximumGuests} ადამიანი)`;
        roomSelect.appendChild(option);
    });

    // If room was selected from rooms page, select it
    const selectedRoomId = sessionStorage.getItem('selectedRoomId');
    if (selectedRoomId) {
        roomSelect.value = selectedRoomId;
        sessionStorage.removeItem('selectedRoomId');
        sessionStorage.removeItem('selectedRoomName');
    }
}

// Set minimum date to today
function setMinimumDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkInDate').min = today;
    document.getElementById('checkOutDate').min = today;
}

setMinimumDate();

// When check-in date changes, update check-out min date
document.getElementById('checkInDate').addEventListener('change', (e) => {
    const checkInDate = new Date(e.target.value);
    checkInDate.setDate(checkInDate.getDate() + 1);
    const minCheckOut = checkInDate.toISOString().split('T')[0];
    document.getElementById('checkOutDate').min = minCheckOut;
    document.getElementById('checkOutDate').value = '';
});

// Validate phone number
function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{9,}$/;
    return phoneRegex.test(phone);
}

// Validate email (optional field, but if filled must be valid)
function isValidEmail(email) {
    if (email === '') return true; // optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Book room
document.getElementById('bookBtn').addEventListener('click', () => {
    const roomId = document.getElementById('roomSelect').value;
    const checkInDate = document.getElementById('checkInDate').value;
    const checkOutDate = document.getElementById('checkOutDate').value;
    const clientName = document.getElementById('clientName').value.trim();
    const clientPhone = document.getElementById('clientPhone').value.trim();
    const clientEmail = document.getElementById('clientEmail').value.trim();

    // Validation
    if (!roomId) {
        alert('აირჩიეთ ოთახი');
        return;
    }
    if (!checkInDate) {
        alert('აირჩიეთ შესვლის თარიღი');
        return;
    }
    if (!checkOutDate) {
        alert('აირჩიეთ გასვლის თარიღი');
        return;
    }
    if (!clientName) {
        alert('შეიყვანეთ კლიენტის სახელი');
        return;
    }
    if (!clientPhone) {
        alert('შეიყვანეთ ტელეფონის ნომერი');
        return;
    }
    if (!isValidPhone(clientPhone)) {
        alert('არასწორი ტელეფონის ნომერი');
        return;
    }
    if (!isValidEmail(clientEmail)) {
        alert('არასწორი ელ-ფოსტა');
        return;
    }
    const today = new Date();
today.setHours(0, 0, 0, 0);

const checkInValue = document.getElementById('checkInDate').value;
const checkOutValue = document.getElementById('checkOutDate').value;

const checkIn1 = new Date(checkInValue);
const checkOut1 = new Date(checkOutValue);

if (checkIn1 < today) {
    alert("შესვლის თარიღი არ შეიძლება იყოს წარსულში");
    return;
}
if (checkOut1 < today) {
    alert("გასვლის თარიღი არ შეიძლება იყოს წარსულში");
    return;
}
if (checkOut1 <= checkIn1) {
    alert("გასვლის თარიღი უნდა იყოს შესვლის თარიღის შემდეგ");
    return;
}


    // Check if dates are valid
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    if (checkOut <= checkIn) {
        alert('გასვლის თარიღი უნდა იყოს შესვლის თარიღის შემდეგ');
        return;
    }

    // Check for date conflicts
    const room = allRooms.find(r => r.id == roomId);
    const roomConflict = allBookings.some(booking => 
        booking.roomId == roomId &&
        !(new Date(checkOutDate) <= new Date(booking.checkInDate) || 
          new Date(checkInDate) >= new Date(booking.checkOutDate))
    );

    if (roomConflict) {
        alert('ეს ოთახი უკვე დაჯავშნულია ამ თარიღებში. აირჩიეთ სხვა დაწყობა');
        return;
    }

    // Calculate nights and total price
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * room.pricePerNight;

    // Create booking object
    const booking = {
        id: Date.now(),
        roomId: roomId,
        roomName: room.name,
        roomPrice: room.pricePerNight,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        nights: nights,
        totalPrice: totalPrice,
        clientName: clientName,
        clientPhone: clientPhone,
        clientEmail: clientEmail,
        bookingDate: new Date().toLocaleDateString('ka-GE')
    };

    // Prepare API booking data
    const apiBooking = {
        roomID: parseInt(roomId),
        checkInDate: new Date(checkInDate + 'T00:00:00').toISOString(),
        checkOutDate: new Date(checkOutDate + 'T23:59:59').toISOString(),
        totalPrice: totalPrice,
        isConfirmed: true,
        customerName: clientName,
        customerId: clientEmail || null,
        customerPhone: clientPhone
    };

    // Send to API
    fetch('https://hotelbooking.stepprojects.ge/api/Booking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiBooking)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Booking failed');
        }
        return response.json().catch(() => ({}));
    })
    .then(data => {
        booking.id = data.id;
        booking.apiId = data.id;
        // Add to local
        allBookings.push(booking);
        saveBookings();
        displayBookings();
        // Show success message
        showSuccessMessage(`ოთახი წარმატებით დაჯავშნეთ! ჯამი: $${totalPrice}`);
        // Reset form
        document.getElementById('roomSelect').value = '';
        document.getElementById('checkInDate').value = '';
        document.getElementById('checkOutDate').value = '';
        document.getElementById('clientName').value = '';
        document.getElementById('clientPhone').value = '';
        document.getElementById('clientEmail').value = '';
    })
    .catch(error => {
        console.error(error);
        alert('დაჯავშნა ვერ მოხერხდა. სცადეთ თავიდან.');
    });
});


// Display bookings
function displayBookings() {
    const bookedContainer = document.getElementById('booked-rooms');
    bookedContainer.innerHTML = '';

    if (allBookings.length === 0) {
        bookedContainer.innerHTML = '<div class="empty-message">ჯერ დაჯავშნული ოთახი არ არსებობს</div>';
        return;
    }

    // Sort by id descending (newest first) and take first 3
    const displayedBookings = allBookings.sort((a, b) => b.id - a.id).slice(0, 3);

    displayedBookings.forEach(booking => {
        const card = document.createElement('div');
        card.className = 'booked-card';
        card.innerHTML = `
            <h3>📅 ${booking.roomName}</h3>
            <div class="booking-info">
                <strong>კლიენტის სახელი:</strong> ${booking.clientName}
            </div>
            <div class="booking-info">
                <strong>ტელეფონი:</strong> ${booking.clientPhone}
            </div>
            ${booking.clientEmail ? `<div class="booking-info">
                <strong>ელ-ფოსტა:</strong> ${booking.clientEmail}
            </div>` : ''}
            <div class="booking-info">
                <strong>შესვლა:</strong> ${new Date(booking.checkInDate).toLocaleDateString('ka-GE')}
            </div>
            <div class="booking-info">
                <strong>გასვლა:</strong> ${new Date(booking.checkOutDate).toLocaleDateString('ka-GE')}
            </div>
            <div class="booking-info">
                <strong>ღამეები:</strong> ${booking.nights}
            </div>
            <div class="booking-info">
                <strong>ფასი ღამეზე:</strong> $${booking.roomPrice}
            </div>
            <div class="booking-info" style="color: #1c367e; font-size: 18px;">
                <strong>ჯამი:</strong> $${booking.totalPrice}
            </div>
            <div class="booking-info">
                <strong>დაჯავშნის თარიღი:</strong> ${booking.bookingDate}
            </div>
            <button class="cancel-booking" onclick="cancelBooking(${booking.id})">❌ დაჯავშნის გაუქმება</button>
        `;
        bookedContainer.appendChild(card);
    });
}

// Cancel booking
function cancelBooking(bookingId) {
    const booking = allBookings.find(b => b.id === bookingId);
    if (!booking) return;
    if (confirm('დარწმუნებული ხართ, რომ გსურთ დაჯავშნის გაუქმება?')) {
        const deletePromise = booking.apiId ? 
            fetch(`https://hotelbooking.stepprojects.ge/api/Booking/${booking.apiId}`, {
                method: 'DELETE'
            }).then(response => {
                if (!response.ok) {
                    console.error('Failed to delete from API');
                }
            }).catch(error => console.error(error)) : 
            Promise.resolve();
        deletePromise.then(() => {
            allBookings = allBookings.filter(b => b.id !== bookingId);
            saveBookings();
            displayBookings();
            showSuccessMessage('დაჯავშნა წარმატებით გაუქმდა');
        });
    }
}

// Show success message
function showSuccessMessage(message) {
    const bookingForm = document.getElementById('booking-form');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    bookingForm.insertBefore(successDiv, bookingForm.firstChild);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}
const burgerBtn = document.getElementById("burgerBtn");
const navBar = document.getElementById("Nav-Bar");

burgerBtn.addEventListener("click", () => {
  navBar.classList.toggle("show");
});


