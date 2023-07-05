const searchBox = document.getElementById("search-box");
const searchList = document.getElementById("search-list");
const resultGrid = document.getElementById("result-grid");
var favlist = JSON.parse(localStorage.getItem("movieName"));
const favcontainer = document.getElementById("favcon");
var a;
var det;

var k = 0;

renderList();

// load movies from API
async function loadMovies(searchTerm) {
  const URL = ` https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=549515e`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  // console.log(data.Search);
  if (data.Response == "True") displayMovieList(data.Search);
}

function findMovies() {
  let searchTerm = searchBox.value.trim();
  if (searchTerm.length > 0) {
    searchList.classList.remove("hide-search-list");
    loadMovies(searchTerm);
  } else {
    searchList.classList.add("hide-search-list");
  }
}

function displayMovieList(movies) {
  searchList.innerHTML = "";
  for (let idx = 0; idx < movies.length; idx++) {
    let movieListItem = document.createElement("div");
    movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
    movieListItem.classList.add("search-list-item");
    if (movies[idx].Poster != "N/A") moviePoster = movies[idx].Poster;
    else moviePoster = "imagenotfound.jpg";

    movieListItem.innerHTML = `
    
                        <div class = "search-item-thumbnail">
                            <img src = "${moviePoster}">
                        </div>
                        <div class = "search-item-info">
                            <h3>${movies[idx].Title}</h3>
                            <p>${movies[idx].Year}</p>
                        </div>
        `;
    searchList.appendChild(movieListItem);
  }
  loadMovieDetails();
}

function loadMovieDetails() {
  const searchListMovies = searchList.querySelectorAll(".search-list-item");
  searchListMovies.forEach((movie) => {
    movie.addEventListener("click", async () => {
      // console.log(movie.dataset.id);
      searchList.classList.add("hide-search-list");
      searchBox.value = "";
      const result = await fetch(
        `https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=549515e`
      );
      const movieDetails = await result.json();
      // console.log(movieDetails);
      displayMovieDetails(movieDetails);
    });
  });
}

function displayMovieDetails(details) {
  resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${
          details.Poster != "N/A" ? details.Poster : "image_not_found.png"
        }" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${
          details.Awards
        }  <span class="favimg" > <img src= "heart.png" id="heart"> </span></p>
    </div>
    `;

  a = document.getElementById("heart");

  det = details;
  k = 1;
}

function renderList() {
  favcontainer.innerHTML = "";
  if(favlist === null || favlist === undefined){
    favlist= [];
  }

    for (let idx = 0; idx < favlist.length; idx++) {
        let movieListItem = document.createElement("div");
        movieListItem.dataset.id = favlist[idx].imdbID; // setting movie id in  data-id
        movieListItem.classList.add("search-list-item1");
        if (favlist[idx].Poster != "N/A") moviePoster = favlist[idx].Poster;
        else moviePoster = "imagenotfound.jpg";
    
        movieListItem.innerHTML = `
        
                            <div class = "search-item-thumbnail1">
                                <img src = "${moviePoster}">
                            </div>
                            <div class = "search-item-info1">
                                <h3>${favlist[idx].Title}</h3>
                                <p>${favlist[idx].Year}</p>
                            </div>
                            <div class="delete-icon"> <img src= "icons8-delete.svg" class = "del" id="${favlist[idx].imdbID}"></div>
            `;
        favcontainer.appendChild(movieListItem);
      }
};

function removeFavourites(movieid) {         // remove from favourite list
  const newfavlist = favlist.filter(function (movie) {
    return movie.imdbID != movieid;
  });

  favlist = newfavlist;
  localStorage.setItem("movieName", JSON.stringify(favlist));
  renderList();
}

function addToFavourites(movie) { //adding to favourite list
 
    if (favlist === null || favlist === undefined) {
      favlist = [];
    }
  
    for (let i = 0; i < favlist.length; i++) {
      if (movie.imdbID === favlist[i].imdbID) {
        return;
      }
    }
  
    favlist.push(movie);
    localStorage.setItem("movieName", JSON.stringify(favlist));
    renderList();
  }

window.addEventListener("click", (event) => {
  if (event.target.className != "form-control") {
    searchList.classList.add("hide-search-list");
  }
  if (k == 1 && event.target.id == "heart") {
    addToFavourites(det);
  }
  if (event.target.className == "del") {
    removeFavourites(event.target.id);
  }
});
