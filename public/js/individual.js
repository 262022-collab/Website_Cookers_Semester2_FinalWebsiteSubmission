const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

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
    } catch (error) {
        console.error("Error fetching movie from TMDB:", error);
    }
}();

