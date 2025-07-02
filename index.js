const API_KEY = "d6cb3387";
const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const modal = document.getElementById("movieModal");
const modalBody = document.getElementById("modalBody");
const closeBtn = document.querySelector(".close-btn");

let currentQuery = "";
let currentPage = 1;
let debounceTimer = null;

function debounce(callback, delay) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(callback, delay);
}

async function fetchMovies(query, page = 1) {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`);
    const data = await res.json();
    return data.Response === "True" ? data.Search : [];
}

function renderMovies(movies, append = false) {
    const html = movies.map((movie) =>
        `<div class="movie-card" data-id="${movie.imdbID}">
            <img src="${movie.Poster !== "N/A" ? movie.Poster : ""}" alt="${movie.Title}">
            <div class="movie-info">${movie.Title} (${movie.Year})</div>
        </div>`
    ).join("");
    
    if (append) {
        results.innerHTML += html;
    } else {
        results.innerHTML = html;
    }
}

searchInput.addEventListener("input",()=>{
    debounce(async()=>{
        const query =searchInput.value.trim();
        if(!query) return;
        currentQuery=query;
        currentPage=1;
        const movies=await fetchMovies(currentQuery,currentPage);
        renderMovies(movies);
        loadMoreBtn.style.display=movies.length>=10?"block":"none";
    })
})