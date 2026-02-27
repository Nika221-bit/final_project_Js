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
           <p><strong>მისამართი:</strong> ${hotel.address}</p>
           <p><strong>ქალაქი:</strong> ${hotel.city}</p>
           <p><strong>ოთახების რაოდენობა:</strong> ${hotel.rooms ? hotel.rooms.length : 0}</p>
<button style="padding: 10px 15px; margin-top: 10px; background: linear-gradient(135deg, #76f6ff, #1c367e); border: none; border-radius: 5px; cursor: pointer; font-weight: 600; transition: 0.3s; width: 100%;">
               <a href="Rooms.html?hotelId=${hotel.id}" style="color: white; text-decoration: none; display: block; width: 100%;">ოთახების ნახვა</a>
           </button>           
       `;
       document.createElement("button").appendChild(card);
       
       roomsContainer.appendChild(card);
   })
});
const burgerBtn = document.getElementById("burgerBtn");
const navBar = document.getElementById("Nav-Bar");

burgerBtn.addEventListener("click", () => {
  navBar.classList.toggle("show");
});



