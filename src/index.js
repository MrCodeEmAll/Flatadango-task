// Function to fetch and display the first film's details and the list of all films
async function fetchFilms() {
    console.log('Fetching films...'); // Log before fetching films
    const response = await fetch('http://localhost:3000/films');
    
    if (!response.ok) {
        console.error('Failed to fetch films:', response.status, response.statusText);
        return; // Exit if the fetch fails
    }
    
    const films = await response.json();
    console.log('Films data:', films); // Log the fetched films data
    displayFirstFilm(films[0]); // Display the first film details
    populateFilmList(films); // Populate the film list on the left side
}

// Function to display the first film's details
function displayFirstFilm(film) {
    const filmDetails = document.getElementById('film-details');
    filmDetails.innerHTML = `
        <h2>${film.title}</h2>
        <img src="${film.poster}" alt="${film.title} poster" />
        <p>Runtime: ${film.runtime} minutes</p>
        <p>Showtime: ${film.showtime}</p>
        <p>Available Tickets: ${film.capacity - film.tickets_sold}</p>
        <button id="buy-ticket" onclick="buyTicket(${film.id}, ${film.tickets_sold}, ${film.capacity})">Buy Ticket</button>
    `;
}

// Function to populate the list of films
function populateFilmList(films) {
    const filmList = document.getElementById('films');
    filmList.innerHTML = ''; // Clear previous entries
    films.forEach(film => {
        const li = document.createElement('li');
        li.className = 'film item';
        li.innerHTML = `
            <h3>${film.title}</h3>
            <p>Runtime: ${film.runtime} minutes</p>
            <p>Showtime: ${film.showtime}</p>
            <p>Available Tickets: ${film.capacity - film.tickets_sold}</p>
            <button onclick="buyTicket(${film.id}, ${film.tickets_sold}, ${film.capacity})">Buy Ticket</button>
            <button onclick="deleteFilm(${film.id})">Delete Film</button>
        `;
        filmList.appendChild(li);
    });
}

// Function to buy a ticket for a film
async function buyTicket(filmId, ticketsSold, capacity) {
    console.log(`Buying ticket for film ID: ${filmId}, tickets sold: ${ticketsSold}, capacity: ${capacity}`);
    
    if (ticketsSold < capacity) {
        const newTicketsSold = ticketsSold + 1;

        console.log(`Updating tickets sold to: ${newTicketsSold}`);

        // Update the number of tickets sold
        const response = await fetch(`http://localhost:3000/films/${filmId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tickets_sold: newTicketsSold }),
        });

        if (!response.ok) {
            console.error('Failed to update tickets sold:', response.status, response.statusText);
            return; // Exit if the fetch fails
        }

        // Refresh film data after buying a ticket
        fetchFilms(); 
    } else {
        alert('This film is sold out!');
    }
}

// Function to delete a film from the list
async function deleteFilm(filmId) {
    console.log(`Deleting film with ID: ${filmId}`);
    
    const response = await fetch(`http://localhost:3000/films/${filmId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        console.error('Failed to delete film:', response.status, response.statusText);
        return; // Exit if the delete fails
    }

    // Refresh the film list after deletion
    fetchFilms();
}

// Initial load of films when the page is ready
document.addEventListener('DOMContentLoaded', () => {
    fetchFilms();
});
