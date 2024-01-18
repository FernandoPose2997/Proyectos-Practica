document.getElementById("searchButton").addEventListener("click", searchMovies);


let apikey = "fac9db795214a18dbb46c1aa1ffa2f09";
let url = "https://api.themoviedb.org/3/search/movie";
let urlImg = "https://image.tmdb.org/t/p/w200"

function searchMovies(){
    let searchInput = document.getElementById("searchInput").value

    fetch(`${url}?api_key=${apikey}&query=${searchInput}`)
    .then(response => response.json())
    .then(response => displayMovies(response.results))
}


function displayMovies(movies){
    let result = document.getElementById("results")
    result.innerHTML = ""

    if(movies.length === 0){
        result.innerHTML = "<p>No se encontraron resultados para tu búsqueda</p>"
        return;
    }
    movies.forEach(movie => {
        let movieDiv = document.createElement("div")
        movieDiv.classList.add("movie")

        let title = document.createElement("h2")
        title.textContent = movie.title

        let relaseDate = document.createElement("p")
        relaseDate.textContent = "La fecha de lanzamiento fue: " + movie.relase_date

        let overview = document.createElement("p")
        overview.textContent = movie.overview

        let posterPath = urlImg + movie.poster_path
        let poster = document.createElement("img")
        poster.src = posterPath

        movieDiv.appendChild(poster)
        movieDiv.appendChild(title)
        movieDiv.appendChild(relaseDate)
        movieDiv.appendChild(overview)

        result.appendChild(movieDiv)
    });
}
