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
function renderRooms(rooms) {
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
       `;

       roomsContainer.appendChild(card);
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

const darkModeBtn = document.getElementById("darkModeBtn");
darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    darkModeBtn.textContent = "☀️ Light Mode";
  } else {
    darkModeBtn.textContent = "🌙 Dark Mode";
  }
});

