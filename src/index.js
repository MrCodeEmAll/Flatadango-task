const filmsList = document.getElementById('films');
const movieTitle = document.getElementById('movie-title');
const moviePoster = document.getElementById('movie-poster');
const movieRuntime = document.getElementById('movie-runtime');
const movieShowtime = document.getElementById('movie-showtime');
const movieDescription = document.getElementById('movie-description');
const availableTickets = document.getElementById('available-tickets');
const buyTicketButton = document.getElementById('buy-ticket');

// Fetch the first film's details
function fetchFilmDetails(filmId) {
    fetch(`http://localhost:3000/films/${filmId}`)
        .then(response => response.json())
        .then(film => {
            displayFilmDetails(film);
        })
        .catch(error => console.error('Error fetching film details:', error));
}

// Fetch all films for the menu
function fetchAllFilms() {
    fetch("http://localhost:3000/films")
        .then(response => response.json())
        .then(films => {
            displayFilmsMenu(films);
        })
        .catch(error => console.error('Error fetching films:', error));
}

// Display the films menu
function displayFilmsMenu(films) {
    filmsList.innerHTML = ''; // Clear loading text
    films.forEach(film => {
        const li = document.createElement('li');
        li.textContent = film.title;
        li.className = "film item";
        li.addEventListener('click', () => {
            fetchFilmDetails(film.id);
        });
        filmsList.appendChild(li);
    });
}

// Display selected film details
function displayFilmDetails(film) {
    movieTitle.textContent = film.title;
    moviePoster.src = film.poster;
    movieRuntime.textContent = film.runtime;
    movieShowtime.textContent = film.showtime;
    movieDescription.textContent = film.description;

    const soldTickets = film.tickets_sold;
    const available = film.capacity - soldTickets;
    availableTickets.textContent = available;

    // Update the button based on available tickets
    buyTicketButton.textContent = available > 0 ? 'Buy Ticket' : 'Sold Out';
    buyTicketButton.disabled = available === 0; // Disable button if sold out

    buyTicketButton.onclick = () => {
        if (available > 0) {
            buyTicket(film.id, soldTickets + 1);
        }
    };
}

// Buy a ticket for a selected film
function buyTicket(filmId, newTicketsSold) {
    // Update tickets sold on the server
    fetch(`http://localhost:3000/films/${filmId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tickets_sold: newTicketsSold })
    })
    .then(response => response.json())
    .then(updatedFilm => {
        displayFilmDetails(updatedFilm);
    })
    .catch(error => console.error('Error purchasing ticket:', error));
}

// Initial fetch for films
fetchAllFilms();
fetchFilmDetails(1); // Load details for the first film on page load
