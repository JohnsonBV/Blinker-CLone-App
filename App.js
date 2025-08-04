const apiKey = "4c28a0ae"; // your OMDb API key
let movies = [];

document.getElementById("searchBtn").addEventListener("click", fetchMovies);
document.getElementById("sortOptions").addEventListener("change", sortMovies);

function fetchMovies() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) {
    alert("Please enter a movie title.");
    return;
  }

  fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
      if (data.Response === "True") {
        movies = data.Search.filter(movie => movie.Type === "movie");
        displayMovies(movies);
      } else {
        document.getElementById("results").innerHTML = `<p>${data.Error}</p>`;
      }
    })
    .catch(error => {
      console.error("Error fetching data:", error);
      document.getElementById("results").innerHTML = `<p>Error fetching data. Try again later.</p>`;
    });
}

function displayMovies(movieList) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = movieList.map(movie => `
    <div class="movie">
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150"}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <p>Year: ${movie.Year}</p>
    </div>
  `).join("");
}

function sortMovies() {
  const sortType = document.getElementById("sortOptions").value;
  let sorted = [...movies];

  if (sortType === "asc") {
    sorted.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
  } else if (sortType === "desc") {
    sorted.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
  }

  displayMovies(sorted);
}
