document.addEventListener('DOMContentLoaded', () => {
  // if already authenticated, skip login
  if (localStorage.getItem('authToken')) {
    window.location.href = 'index.html';
    return;
  }
  const form = document.getElementById('loginForm');
  const msgDiv = document.getElementById('loginMessage');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    msgDiv.textContent = '';

    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;

    // helper to safely parse JSON or return empty object
    async function safeJson(response) {
      const text = await response.text();
      try { return text ? JSON.parse(text) : {}; } catch (_){ return {}; }
    }

    try {
      const res = await fetch('https://hotelbooking.stepprojects.ge/api/Users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone, password })
      });

      const data = await safeJson(res);
      if (!res.ok) {
        msgDiv.textContent = data.message || 'Login failed';
        msgDiv.style.color = 'red';
      } else {
        // store token and phone
        if (data.token || data.accessToken) {
          localStorage.setItem('authToken', data.token || data.accessToken);
        } else {
          localStorage.setItem('authToken', JSON.stringify(data));
        }
        localStorage.setItem('userPhone', phone);

        msgDiv.textContent = 'Login successful! Redirecting...';
        msgDiv.style.color = 'green';

        // example call to favorite cars endpoint
        const tokenStored = data.token || data.accessToken || '';
        fetch(`https://rentcar.stepprojects.ge//api/Users/${encodeURIComponent(phone)}/favorite-cars`, {
          headers: tokenStored ? { 'Authorization': `Bearer ${tokenStored}` } : {}
        })
          .then(async r => {
            try {
              const txt = await r.text();
              if (txt) {
                console.log('favorite-cars:', JSON.parse(txt));
              } else {
                console.log('favorite-cars: empty response');
              }
            } catch(e){ console.warn('could not parse favorites', e); }
          })
          .catch(e => console.warn('could not load favorites', e));

        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
      }
    } catch (err) {
      msgDiv.textContent = 'Error: ' + err.message;
      msgDiv.style.color = 'red';
    }
  });
});
const burgerBtn = document.getElementById("burgerBtn");
const navBar = document.getElementById("Nav-Bar");

burgerBtn.addEventListener("click", () => {
  navBar.classList.toggle("show");
});
