// Function to fetch movies from the OMDB API based on the search term
async function loadMovies(searchTerm) {
    // set and fetch the url
    const URL = `https://omdbapi.com/?s=${searchTerm}&apikey=9e67004a`;
    const response = await fetch(URL);
    // to store the response in json
    const data = await response.json();
    
    // If the API response is successful, display the list of movies
    if (data.Response == 'True') {
        displayMovieList(data.Search);
    }
}

// Create elements for the search box, the searched list and the results
const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const result = document.getElementById('result-id');

// Function to handle the search input
function findMovies() {

    // Get the search term from the input field
    let searchTerm = (movieSearchBox.value).trim();

    // If the search term is not empty, i.e. user typed something, show the search list and load movies
    if (searchTerm.length > 0) {
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    }
    // else hide the search list because user hasnt typed/searched anything yet
    else {
        searchList.classList.add('hide-search-list');
    }
}

// Function to display the list of movies
function displayMovieList(movies) {
    
    // Clear previous search results
    searchList.innerHTML = "";

    // Iterate through each movie and create a list item
    for (let index = 0; index < movies.length; index++) {
        
        // Create a new div element for each movie in the search list
        let movieListItem = document.createElement('div');

        // Set id for each movie using dataset and assigning index
        movieListItem.dataset.id = movies[index].imdbID;

        // assign the element a class
        movieListItem.classList.add('search-list-item');

        let moviePoster;
        if (movies[index].Poster != "N/A") {
            // If the movie has a valid poster URL, use it
            moviePoster = movies[index].Poster;
        }
        else {
            // If the movie does not have a valid poster URL, use a placeholder image
            moviePoster = "image_not_found.png";
        }


        // Set the inner HTML of the list item
        movieListItem.innerHTML = `
            <div class="search-item-thumbnail">
                <img src="${moviePoster}">
            </div>
            <div class="search-item-info">
                <h3>${movies[index].Title}</h3>
                <p>${movies[index].Year}</p>
            </div>
        `;
        
        // Add/Insert the element for each movie to searchList item
        searchList.appendChild(movieListItem);
    }
    // Once user types something, load its initial details
    loadMovieDetails();
}

// Function to load movie details when a movie is clicked
function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";

            try {
                const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=9e67004a`);
                const movieDetails = await result.json();
                displayMovieDetails(movieDetails);
            } catch (error) {
                console.error('Error fetching movie details:', error);
            }
        });
    });
}


// Function to display the movie details
function displayMovieDetails(details) {
    result.innerHTML = `
    <div class="movie-poster">
        <img src="${details.Poster != "N/A" ? details.Poster : "image_not_found.png"}" alt="movie poster">
    </div>
    <div class="movie-info">
        <h3 class="movie-title">${details.Title}</h3>
        <ul class="movie-misc-info", style="margin-right: 20px;">
            <li class="year">Year: ${details.Year}</li>
            <li class="released">Released: ${details.Released}</li>
            <li class="rated">Ratings: ${details.Rated}</li>
        </ul>
        <p class="genre"><b>Genre:</b> ${details.Genre}</p>
        <p class="language"><b>Language:</b> ${details.Language}</p>
        <br>
        <p class="actors"><b>Actors: </b>${details.Actors}</p>
        <p class="writer"><b>Writer:</b> ${details.Writer}</p>
        <p class="plot"><b>Plot:</b> ${details.Plot}</p>
        <p class="awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `;
}

// Hide the search list if the click is outside the search input field
window.addEventListener('click', (event) => {

    // Check if the clicked element's class is not the search input
    if (event.target.className != "form-control") {

        // assign the element a class
        searchList.classList.add('hide-search-list');
    }
});
