let allRooms = [];

// Fetch rooms
fetch('https://hotelbooking.stepprojects.ge/api/Rooms/GetAll', {
   method: 'GET'
})
.then((response) => response.json())
.then((data) => {
   const roomsContainer = document.getElementById("rooms");
   if (!roomsContainer) {
       console.error("Element with id='rooms' არ არსებობს!");
       return;
   }

   allRooms = Array.isArray(data) ? data : [];
   renderRooms(allRooms);
})
.catch((error) => {
   console.error("შეცდომა:", error);
   document.getElementById("rooms").innerHTML = "<p style='color: red; padding: 20px;'>დაფიქსირდა შეცდომა მონაცემების ჩატვირთვისას</p>";
});

// Render function
async function renderRooms(rooms) {
   const roomsContainer = document.getElementById("rooms");
   roomsContainer.innerHTML = "";

   rooms.forEach((room) => {
       const card = document.createElement("div");
       card.className = "roomcard";

       const image = room.images && room.images.length > 0 ? room.images[0].source : "";

       card.innerHTML = `
           <img src="${image}" alt="${room.name}" style="width: 100%; height: 200px; object-fit: cover;">
           <h2>${room.name}</h2>
           <p><strong>ფასი:</strong> ${room.pricePerNight} $</p>
           <p><strong>სტუმრების მაქსიმუმი:</strong> ${room.maximumGuests}</p>
           <p><strong>ხელმისაწვდომია?:</strong> ${room.available ? "დიახ" : "არა"}</p>
           <p><strong>ოთახის ნომერი:</strong> N${room.id}</p>
           <button class="book-btn" data-room-id="${room.id}" style="padding: 10px 15px; margin-top: 10px; background: linear-gradient(135deg, #76f6ff, #1c367e); color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 600; transition: 0.3s; width: 100%;">📅 დაჯავშნა</button>
       `;

       roomsContainer.appendChild(card);
   });

   // Add event listeners to book buttons
   document.querySelectorAll('.book-btn').forEach(btn => {
       btn.addEventListener('click', (e) => {
           const roomId = e.target.getAttribute('data-room-id');
           const room = allRooms.find(r => r.id == roomId);
           
           // Store selected room in sessionStorage and redirect to Booked.html
           sessionStorage.setItem('selectedRoomId', roomId);
           sessionStorage.setItem('selectedRoomName', room.name);
           window.location.href = 'Booked.html';
       });
   });
}

// Search functionality
document.getElementById("searchInput").addEventListener("input", (e) => {
   const query = e.target.value.toLowerCase();
   const filtered = allRooms.filter(room => room.name.toLowerCase().includes(query));
   renderRooms(filtered);
});

// Sort functionality
document.getElementById("sortSelect").addEventListener("change", (e) => {
   let sortedRooms = [...allRooms];
   if (e.target.value === "asc") {
       sortedRooms.sort((a, b) => a.pricePerNight - b.pricePerNight);
   } else if (e.target.value === "desc") {
       sortedRooms.sort((a, b) => b.pricePerNight - a.pricePerNight);
   }
   renderRooms(sortedRooms);
});

// Price Range Filter
document.getElementById("filterBtn").addEventListener("click", () => {
   const minPrice = parseFloat(document.getElementById("minPrice").value) || 0;
   const maxPrice = parseFloat(document.getElementById("maxPrice").value) || Infinity;

   const filtered = allRooms.filter(room => 
       room.pricePerNight >= minPrice && room.pricePerNight <= maxPrice
   );

   renderRooms(filtered);
});

const burgerBtn = document.getElementById("burgerBtn");
const navBar = document.getElementById("Nav-Bar");

burgerBtn.addEventListener("click", () => {
  navBar.classList.toggle("show");
});


