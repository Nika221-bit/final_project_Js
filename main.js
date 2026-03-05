fetch('https://hotelbooking.stepprojects.ge/api/Hotels/GetHotel/1', {
   method: 'GET'
})
.then((response) => response.json())
.then((data) => {
   const roomsContainer = document.getElementById("rooms");
   if (!roomsContainer) {
       console.error("Element with id='rooms' არ არსებობს!");
       return;
   }

   const roomsList = data.rooms && Array.isArray(data.rooms) ? data.rooms.slice(0, 6) : [];
   const cardsWrapper = document.createElement("div");
   cardsWrapper.style.display = "contents";

   roomsList.forEach((room) => {
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
       const image = firstRoom && firstRoom.images && firstRoom.images.length > 0 ? firstRoom.images[0].source : "";
       
       card.innerHTML = `
           <img src="${image}" alt="${hotel.name}" style="width: 100%; height: 200px; object-fit: cover;">
           <h2>${hotel.name}</h2>
           <p class="price"><strong>ფასი: ${firstRoom ? firstRoom.pricePerNight : 0} $</strong></p>
           <p><strong>მისამართი:</strong> ${hotel.address}</p>
           <p><strong>ქალაქი:</strong> ${hotel.city}</p>
           <p><strong>ოთახების რაოდენობა:</strong> ${hotel.rooms ? hotel.rooms.length : 0}</p>`;
       roomsContainer.appendChild(card);
   })
});

// API Helper Functions
async function fetchHotels() {
  try {
    const response = await fetch('https://hotelbooking.stepprojects.ge/api/Hotels/GetAll');
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
}

async function fetchHotel(id) {
  try {
    const response = await fetch(`https://hotelbooking.stepprojects.ge/api/Hotels/GetHotel/${id}`);
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
}

async function fetchCities() {
  try {
    const response = await fetch('https://hotelbooking.stepprojects.ge/api/Hotels/GetCities');
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
}

async function fetchRooms() {
  try {
    const response = await fetch('https://hotelbooking.stepprojects.ge/api/Rooms/GetAll');
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
}

async function fetchAvailableRooms() {
  try {
    const response = await fetch('https://hotelbooking.stepprojects.ge/api/Rooms/GetAvailableRooms');
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
}

async function fetchRoomTypes() {
  try {
    const response = await fetch('https://hotelbooking.stepprojects.ge/api/Rooms/GetRoomTypes');
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
}

// თედო 
const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendBtn");
const apiKeyInput = document.getElementById("apiKey");


async function sendMessage() {
  const apiKey = apiKeyInput.value.trim();
  const message = userInput.value.trim();

  if (!apiKey) {
    showError("ჯერ ჩასვი API KEY");
    return;
  }
  if (!message) {
    showError("შეიყვანე ტექსტი");
    return;
  }

  // მომხმარებლის მესიჯის ჩვენება
  await addMessage(message, "user");
  userInput.value = "";
  sendButton.disabled = true;

  // typing indicator
  const typing = showTyping();

  try {
    // ინფორმაციის მოხსნა API-დან
    let apiData = "";
    
    if (message.toLowerCase().includes("სასტუმრო") || message.toLowerCase().includes("hotel")) {
      const hotels = await fetchHotels();
      apiData = "\n\nხელმისაწვდომი სასტუმროები:\n" + JSON.stringify(hotels, null, 2);
    }
    if (message.toLowerCase().includes("ოთახი") || message.toLowerCase().includes("room")) {
      const rooms = await fetchRooms();
      apiData += "\n\nხელმისაწვდომი ოთახები:\n" + JSON.stringify(rooms, null, 2);
    }
    if (message.toLowerCase().includes("ხელმისაწვდომი")) {
      const available = await fetchAvailableRooms();
      apiData += "\n\nხელმისაწვდომი ოთახები:\n" + JSON.stringify(available, null, 2);
    }
    if (message.toLowerCase().includes("ქალაქი") || message.toLowerCase().includes("city")) {
      const cities = await fetchCities();
      apiData += "\n\nქალაქები:\n" + JSON.stringify(cities, null, 2);
    }
    if (message.toLowerCase().includes("ტიპი") || message.toLowerCase().includes("type")) {
      const types = await fetchRoomTypes();
      apiData += "\n\nოთახის ტიპები:\n" + JSON.stringify(types, null, 2);
    }

    const MODEL = "gemini-2.5-flash";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a Hotel Booking assistant. You can only answer questions about Hotel Booking API data.

Here is the current API data:
${apiData}

User question: ${message}

If the question is not related to hotels, rooms, cities or booking, respond: "მხოლოდ Hotel Booking API-ს შესახებ შემიძლია დახმარება"`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    typing.remove();

    if (!response.ok) {
      const errorMsg = data.error?.message || "მოხდა შეცდომა";
      console.error("API Error:", errorMsg, data);
      showError(errorMsg);
      return;
    }

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error("Invalid response structure:", data);
      showError("პასუხი მიღებული არაა სწორი ფორმატში");
      return;
    }

    const botReply = data.candidates[0].content.parts[0].text || "მოხდა შეცდომა პასუხის მიღებისას";
    await addMessage(botReply, "bot");
  } catch (error) {
    typing.remove();
    console.error("Fetch error:", error);
    showError("მოხდა შეცდომა: " + error.message);
  }
  sendButton.disabled = false;
  userInput.focus();
}

// დამხმარე ფუნქციები
async function addMessage(text, type) {
  const welcome = chatMessages.querySelector(".welcome");
  if (welcome) {
    welcome.remove();
  }

  const div = document.createElement("div");
  div.className = `message ${type}`;

  if (type === "bot") {
    const formattedText = await formatText(text);
    div.innerHTML = `
      <div class="label">🤖 Gemini </div>
      ${formattedText}
    `;
  } else {
    div.innerHTML = `
      <div class="label">👤 User </div>
      ${text}
    `;
  }

  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}


// შეცდომის ჩვენება
async function showError(text) {
  const div = document.createElement("div");
  div.className = "message error";
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// typing
function showTyping() {
  const div = document.createElement("div");
  div.className = "message bot";
  div.innerHTML = `
    <div class="label">🤖 Gemini </div>
    <div class="typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}

// ტექსტის ფორმატირება
async function formatText(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") 
    .replace(/\*(.+?)\*/g, "<em>$1</em>")            
    .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>") 
    .replace(/`(.*?)`/g, "<code>$1</code>")           
    .replace(/\n/g, "<br>");                         
}

const burgerBtn = document.getElementById("burgerBtn");
const navBar = document.getElementById("Nav-Bar");

burgerBtn.addEventListener("click", () => {
  navBar.classList.toggle("show");
});





