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

   const limitedRooms = Array.isArray(data) ? data.slice(0, 6) : [];

   const totalRooms = limitedRooms.length;
   const cardsWrapper = document.createElement("div");
   cardsWrapper.style.display = "contents";

   limitedRooms.forEach((room) => {
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

       cardsWrapper.appendChild(card);
   });

   roomsContainer.appendChild(cardsWrapper);
   const countInfo = document.createElement("div");
   countInfo.style.gridColumn = "1 / -1";
   countInfo.style.textAlign = "center";
   countInfo.style.padding = "20px";
   countInfo.innerHTML = `<strong>ოთახების რაოდენობა: ${totalRooms}</strong>`;
   roomsContainer.appendChild(countInfo);

  

   
})
.catch((error) => {
   console.error("შეცდომა:", error);
   document.getElementById("rooms").innerHTML = "<p style='color: red; padding: 20px;'>დაფიქსირდა შეცდომა მონაცემების ჩატვირთვისას</p>";
});

//hotels

fetch('https://hotelbooking.stepprojects.ge/api/Hotels/GetAll')
.then((response) => response.json())
.then((data) => {
   const roomsContainer = document.getElementById("hotels");
   data.forEach((hotel) => {
       const card = document.createElement("div");
       card.className = "hotelrooms";
       const firstRoom = hotel.rooms && hotel.rooms.length > 0 ? hotel.rooms[0] : null;
       const price = `${hotel.rooms.pricePerNight}`
       const image = hotel.featuredImage;
       
       card.innerHTML = `
           <img src="${image}" alt="${hotel.name}" style="width: 100%; height: 200px; object-fit: cover;">
           <h2>${hotel.name}</h2>
           <p class="price"><strong>ფასი: ${hotel.rooms.pricePerNight} $</strong></p>
           <p><strong>მისამართი:</strong> ${hotel.address}</p>
           <p><strong>ქალაქი:</strong> ${hotel.city}</p>
           <p><strong>ოთახების რაოდენობა:</strong> ${hotel.rooms ? hotel.rooms.length : 0}</p>
           
           
       `;
       roomsContainer.appendChild(card);
   })
});
