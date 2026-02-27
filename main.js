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
  addMessage(message, "user");
  userInput.value = "";
  sendButton.disabled = true;

  // typing indicator
  const typing = showTyping();

  try {
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
                text: message,
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
      showError(errorMsg);
      return;
    } else {
      const botReply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "მოხდა შეცდომა პასუხის მიღებისას";
      addMessage(botReply, "bot");
    }
  } catch (error) {
    typing.remove();
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
    div.innerHTML = `
      <div class="label">🤖 Gemini </div>
      ${formatText(text)}
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
async function showTyping() {
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





