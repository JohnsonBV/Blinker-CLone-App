const API_KEY = '4c28a0ae';
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsDiv = document.getElementById('results');
const sortOptions = document.getElementById('sortOptions');

let movies = [];

searchBtn.addEventListener('click', () => {
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    fetchMovies(searchTerm);
  }
});

sortOptions.addEventListener('change', () => {
  if (movies.length > 0) {
    sortAndDisplayMovies(movies, sortOptions.value);
  }
});

function fetchMovies(searchTerm) {
  fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}`)
    .then(response => response.json())
    .then(data => {
      if (data.Response === 'True') {
        movies = data.Search;
        sortAndDisplayMovies(movies, sortOptions.value);
      } else {
        resultsDiv.innerHTML = `<p>No results found.</p>`;
      }
    })
    .catch(error => {
      console.error('Error fetching movies:', error);
      resultsDiv.innerHTML = `<p>There was an error fetching data.</p>`;
    });
}

function sortAndDisplayMovies(moviesArray, sortOrder) {
  let sortedMovies = [...moviesArray];

  if (sortOrder === 'asc') {
    sortedMovies.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
  } else if (sortOrder === 'desc') {
    sortedMovies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
  }

  displayMovies(sortedMovies);
}

function displayMovies(moviesArray) {
  resultsDiv.innerHTML = moviesArray.map(movie => `
    <div class="movie-card">
      <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'}" alt="${movie.Title} poster" />
      <h3>${movie.Title}</h3>
      <p>Year: ${movie.Year}</p>
      <p>Type: ${movie.Type}</p>
    </div>
  `).join('');
}
