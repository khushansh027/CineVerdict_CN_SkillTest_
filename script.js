// start
// This event listener ensures that the DOM is fully loaded before executing the function
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('view-favourites').addEventListener('click', showFavourites);
});
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

// Create elements for the search box, the searched list, favourites list and the results
const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const result = document.getElementById('favourites-list');
const favouritesList = document.getElementById('favourites-list');

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

    // show all movies from database corresponding the user input in search box
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    
    // for each movie shown in the list
    searchListMovies.forEach(movie => {
        // add a click event listener, which when clicked
        movie.addEventListener('click', async () => {

            // Hides the search list & clears the search box
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";

            // and fetch the details of that movie then display them on-screen to the user
            const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=9e67004a`);
            const movieDetails = await result.json();
            displayMovieDetails(movieDetails);
        });
    });
}

let movieDetailsList = [];
// Function to display the movie details
function displayMovieDetails(details) {
    const index = movieDetailsList.length;
    movieDetailsList.push(details);

    // Create a new window
    const newWindow = window.open('', '_blank');

    // Write the HTML content to the new window
    newWindow.document.write(`
        <html>
            <head>
                <title>${details.Title}</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
                <link rel="stylesheet" href="style.css">
            </head>
            <body>
                <div class="result">
                    <div class="movie-poster">
                        <img src="${details.Poster != "N/A" ? details.Poster : "image_not_found.png"}" alt="movie poster">
                    </div>
                    <div class="movie-info">
                        <h3 class="movie-title">${details.Title}</h3>
                        <ul class="movie-misc-info" style="margin-right: 20px;">
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
                        <button onclick="saveToFav(${index})">Add to Favourites 💟</button>
                    </div>
                </div>
                <script>
                    const saveToFav = (movie) => {
                        let details = ${JSON.stringify(movieDetailsList)};
                        details = details[movie];
                        console.log('Adding to favourites:', details);
                        let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
                        favourites.push(movie);
                        localStorage.setItem('favourites', JSON.stringify(favourites));
                        console.log('Favourites after adding:', favourites);
                    };
                </script>
            </body>
        </html>
    `);
    // Close the document to finish writing to the new window
    newWindow.document.close();
}

// function to save a new movie to favourite array
const saveToFav = (movie) => {
    let details = movieDetailsList[movie];
    console.log(details);
    // Retrieve the current list of favourites from local storage, or initialize it as an empty array if it doesn't exist
    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    
    // Add the new movie to the list of favourites
    favourites.push(movie);
    
    // Save the updated list of favourites back to local storage
    localStorage.setItem('favourites',JSON.stringify(favourites));
};

// Function to load favourites from local storage and display them
const loadFavourites = () => {

    console.log('Loading favourites from local storage...');

    let favouriteIndexes = JSON.parse(localStorage.getItem('favourites')) || [];

    console.log('Favourite indexes:', favouriteIndexes);

    // Map the indexes to the corresponding movie details
    let favouriteMovies = favouriteIndexes.map(index => movieDetailsList[index]);
    console.log('Favourite movies:', favouriteMovies);

    // Display the list of favourite movies
    displayFavourites(favouriteMovies);
}

// Function to display the list of favourite movies
const displayFavourites = (movies) => {
    const favouritesList = document.getElementById('favourites-list');

    // Clear previous favourites list
    favouritesList.innerHTML = '';

    // Iterate through each movie in the favourites list
    movies.forEach(movie => {

        // base case
        if (!movie || !movie.imdbID) {
            console.error('Invalid movie object:', movie);
            return;
        }
        // Create a new div element for each favourite movie
        const movieListItem = document.createElement('div');

        // Set the id for each movie using dataset
        movieListItem.dataset.id = movie.imdbID;

        // Assign the element a class
        movieListItem.classList.add('favourites-list-item');

        // Check if the movie has a valid poster URL
        let moviePoster;
        if (movie.Poster !== "N/A") {
            moviePoster = movie.Poster;
        }else{
            moviePoster = "image_not_found.png";
        }

        // Set the inner HTML of the list item
        movieListItem.innerHTML = `
            <div class="favourite-item-thumbnail">
                <img src="${moviePoster}">
            </div>
            <div class="favourite-item-info">
                <h3>${movie.Title}</h3>
                <p>${movie.Year}</p>
                <!-- Add a button to remove the movie from favourites -->
                <button class="remove-from-favourites" onclick="removeFromFavourites('${movie.imdbID}')">Remove</button>
            </div>
        `;

        // Add the element to the favourites list
        favouritesList.appendChild(movieListItem);
    });
};

// Function to remove a movie from the favourites list
const removeFromFavourites = (movieID) => {

    // Retrieve the current favourites list from localStorage
    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];

    // Filter out the movie to be removed using its imdbID
    favourites = favourites.filter(index => movieDetailsList[index].imdbID !== movieID);

    // Update the localStorage with the new favourites list
    localStorage.setItem('favourites',JSON.stringify(favourites));

    // Refresh the displayed favourites list
    loadFavourites();
};

// Function to show favourites
function showFavourites() {
    

    const favouritesListContainer = document.getElementById('favourites-list').parentElement;
    
    const resultContainer = document.getElementById('result-id').parentElement;

    // Hide the result container and show the favourites list container
    resultContainer.style.display = 'none';
    favouritesListContainer.style.display = 'block';

    // Load favourites from local storage
    loadFavourites();
}

// Hide the search list if the click is outside the search input field
window.addEventListener('click', (event) => {

    // Check if the clicked element's class is not the search input
    if (event.target.className != "form-control") {

        // assign the element a class
        searchList.classList.add('hide-search-list');
    }
});
