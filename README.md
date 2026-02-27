# final_project_Js

This project is a simple hotel booking frontend that communicates with an external API. New authentication pages have been added to allow users to register and log in using the provided endpoints.

## Available Pages

- `index.html` – home page with featured rooms
- `Rooms.html` – list and filter rooms
- `Hotels.html` – hotels overview
- `Booked.html` – room booking form and local bookings viewer
- `login.html` – user login page (calls `POST /api/Users/login`)
- `register.html` – user registration page (calls `POST /api/Users/register`)

## Authentication behavior

When a user logs in, a token and phone number are stored in `localStorage`. Navigation links update automatically to show a Logout link and the user's phone number. Dark mode setting is also persisted using `localStorage`.

## Getting started

Open any of the HTML files in a modern browser (Chrome/Edge/Firefox). Use the navigation bar to access login or register. After registering, you can log in and the navigation will adapt accordingly.

The API base URL used is `https://hotelbooking.stepprojects.ge/api/Users`.

