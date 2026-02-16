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

   // ავიღოთ მხოლოდ 6 ოთახი
   const limitedRooms = Array.isArray(data) ? data.slice(0, 6) : [];

   const totalRooms = limitedRooms.length;

   // ყველა ოთახის ბარათები (მხოლოდ 6)
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

   // TOP 3 რეიტინგული ოთახი (ამ 6–დან)
   const topRatedRooms = limitedRooms
       .filter(room => room.rating) 
       .sort((a, b) => b.rating - a.rating)
       .slice(0, 3);

   if (topRatedRooms.length > 0) {
       const topRatedSection = document.createElement("div");
       topRatedSection.style.gridColumn = "1 / -1";
       topRatedSection.innerHTML = "<h3 style='text-align: center; margin-top: 40px; margin-bottom: 20px;'>⭐ საუკეთესო რეიტინგი (TOP 3)</h3>";
       roomsContainer.appendChild(topRatedSection);

       const topRatedContainer = document.createElement("div");
       topRatedContainer.style.display = "contents";

       topRatedRooms.forEach((room) => {
           const topCard = document.createElement("div");
           topCard.className = "roomcard top-rated";

           topCard.innerHTML = `
               <h3>⭐ ${room.name}</h3>
               <p><strong>რეიტინგი:</strong> ${room.rating}</p>
               <p><strong>ფასი:</strong> ${room.pricePerNight} $</p>
           `;

           topRatedContainer.appendChild(topCard);
       });

       roomsContainer.appendChild(topRatedContainer);
   }
})
.catch((error) => {
   console.error("შეცდომა:", error);
   document.getElementById("rooms").innerHTML = "<p style='color: red; padding: 20px;'>დაფიქსირდა შეცდომა მონაცემების ჩატვირთვისას</p>";
});
