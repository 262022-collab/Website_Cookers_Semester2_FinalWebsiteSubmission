const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

// Leah - Add to favourites
function isSaved(id) { 
    const saved = JSON.parse(localStorage.getItem("favourites") || "[]");
    return saved.some(m => m.id === id);
}

function toSavedMovie(movie) {
    return {
        title: movie.title,
        overview: movie.overview,
        releaseDate: movie.release_date,
        image: movie.poster_path 
            ? "https://image.tmdb.org/t/p/w200" + movie.poster_path 
            : "assets/images/elementor-placeholder-image.png",

        id: movie.id,
        genres: (movie.genres || []).map(g => g.name)
    };
}

// Show toast (added to favourites)
function showToast(msg) {
    document.getElementById("favToastMsg"). textContent = msg;
    bootstrap.Toast.getOrCreateInstance(document.getElementById("favToast")).show();
}

function updateSaveButton(saved) {
    document.getElementById("saveBtn").textContent = saved ? "Remove from Favourites" : "Add to Favourites"
}
// <


function displayMovie(movie) {
    document.getElementById("movieTitle").textContent = movie.title;
    document.getElementById("movieDescription").textContent = movie.overview;
    document.getElementById("ratingNumber").textContent = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";


    if (movie.backdrop_path) {
        document.getElementById("hero").style.backgroundImage =
            `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
    }

    document.title = movie.title;
}

!async function () {
    if (!movieId) {
        window.location.href = "library.html";
        return;
    }

    const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjN2JhZTIwZjJiYWQ4OTFiODk0YTc5ZjU3YjQwYWY3MyIsIm5iZiI6MTc4NzczNDc4OS45NzQwMDAyLCJzdWIiOiI2YThlYWIwNTY3ZDVlZTMyYmNiNGY1MTAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.puYjgDGBYFueOCi84hXL0WF7k6X7BYO56f4f6rekRWw'
        }
    };

    try {
        const movie = await fetch(movieUrl, options).then(res => res.json());
        displayMovie(movie);
        const savedMovie = toSavedMovie(movie); // > Leah - Favourites
        updateSaveButton(isSaved(savedMovie.id)); 

        document.getElementById("saveBtn").addEventListener("click", event => {
            const favourites = JSON.parse(localStorage.getItem("favourites") || "[]");
            const alreadyAdded = favourites.some(m => m.id === savedMovie.id);

            if(!alreadyAdded) {
                favourites.push(savedMovie);
                localStorage.setItem("favourites", JSON.stringify(favourites));
                updateSaveButton(true);
                showToast("Added to Favourites");
            } else {
                const kept = favourites.filter(m => m.id !== savedMovie.id);
                localStorage.setItem("favourites", JSON.stringify(kept));
                updateSaveButton(false);
                showToast("Removed from Favourites");
            }
        });
        
    } catch (error) {
        console.error("Error fetching movie from TMDB:", error);
    }
}();

