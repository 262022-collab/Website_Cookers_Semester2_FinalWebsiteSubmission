// Show toast message when item is added to favourites (Leah)
function showToast(msg) {
    const toastBody = document.getElementById("favToastMsg");
    toastBody.textContent = msg;

    const toast = document.getElementById("favToast");
    
    bootstrap.Toast.getOrCreateInstance(toast).show();
}

class Movie {
    constructor(_title, _overview, _releaseDate, _image, _id, _genres = []) { //(added id-leah)
        this.title = _title;
        this.overview = _overview;
        this.releaseDate = _releaseDate;
        this.image = _image;
        this.id = _id;
        this.genres = _genres; // Array of genre names like ["Action", "Thriller"]
    }
}

// HORIZONTAL SCROLLING FOR GENRE FILTER
function initialiseGenreScrolling() {
    const genreScroll = document.querySelector(".genre-scroll");

    if (!genreScroll) {
        return;
    }

    const previousButton = document.getElementById("genrePrev");
    const nextButton = document.getElementById("genreNext");

    const updateScrollControls = () => {
        const maxScroll = genreScroll.scrollWidth - genreScroll.clientWidth;

        previousButton.hidden = maxScroll <= 1 || genreScroll.scrollLeft <= 1;
        nextButton.hidden = maxScroll <= 1 || genreScroll.scrollLeft >= maxScroll - 1;
    };

    previousButton.addEventListener("click", () =>
        genreScroll.scrollBy({
            left: -genreScroll.clientWidth * 0.75,
            behavior: "smooth"
        })
    );

    nextButton.addEventListener("click", () =>
        genreScroll.scrollBy({
            left: genreScroll.clientWidth * 0.75,
            behavior: "smooth"
        })
    );

    genreScroll.addEventListener("scroll", updateScrollControls, { passive: true });
    window.addEventListener("resize", updateScrollControls);

    updateScrollControls();

    genreScroll.addEventListener(
        "wheel",
        event => {
            if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
                event.preventDefault();
                genreScroll.scrollLeft += event.deltaY;
            }
        },
        { passive: false }
    );
}

// MOVIE GRID CLASS INTEGRATING TMDB API DATA & GENRE FILTERING
class MovieGrid {
    constructor(moviesList) {
        this.grid = document.getElementById("movieGrid");
        this.showMoreButton = document.getElementById("showMoreButton");
        this.movies = moviesList;
        this.visibleCount = 10;
        this.activeGenre = "All";

        this.render();
        this.bindEvents();
    }

    getFilteredMovies() {
        if (this.activeGenre === "All") {
            return this.movies;
        }

        // Check if the movie's genres array includes the selected genre button
        return this.movies.filter(movie =>
            movie.genres.includes(this.activeGenre)
        );
    }

    render() {
        const filtered = this.getFilteredMovies();
        const visible = filtered.slice(0, this.visibleCount);

        if (filtered.length === 0) {
            this.grid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p class="text-muted fs-5">No movies found under <strong>${this.activeGenre}</strong>.</p>
                </div>
            `;
            if (this.showMoreButton) {
                this.showMoreButton.style.display = "none";
            }
            return;
        }
        
        const saved = JSON.parse(localStorage.getItem("favourites") || "[]"); // Reads the saved list once (leah)

        this.grid.innerHTML = visible.map(movie => {
            const releaseYear = movie.releaseDate ? movie.releaseDate.split("-")[0] : "N/A";
            const displayGenres = movie.genres.length > 0 ? movie.genres.join(", ") : "General";
            const isSaved = saved.some(m => m.id === movie.id); // (leah added)

            return `
                <div class="col">
                    <div class="card h-100 shadow-sm border-0">
                        <div class="p-2">
                            <img src="${movie.image}" class="card-img-top rounded moviePost" alt="${movie.title}" loading="lazy">
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title text-truncate">${movie.title}</h5>
                            <p class="card-text text-muted small mb-3">${releaseYear} • ${displayGenres}</p>
                            <div class="d-grid gap-2 mt-auto">
                                <a href="#" class="btn btnWN btn-sm fw-bold">Watch Now</a>
                                <button type="button" class="btn btn-outline-secondary btn-sm favouritesBtn" data-id="${movie.id}">${isSaved ? "Remove" : "Add to Favourites"}</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join("");

        if (this.showMoreButton) {
            this.showMoreButton.style.display =
                filtered.length > this.visibleCount ? "flex" : "none";
        }
    }

    setGenre(genre) {
        this.activeGenre = genre;
        this.visibleCount = 10;
        this.render();
    }

    showMore() {
        this.visibleCount += 10;
        this.render();
    }

    bindEvents() {
        if (this.showMoreButton) {
            this.showMoreButton.addEventListener("click", () => this.showMore());
        }

        this.grid.addEventListener("click", event => {
            const button = event.target.closest(".favouritesBtn");
            if(!button) return;

        const movieId = Number(button.dataset.id);
        const movie = this.movies.find(m => m.id === movieId);
        
        const favourites = JSON.parse(localStorage.getItem("favourites") || "[]");
        
        const alreadyAdded = favourites.some(f => f.id === movie.id); // (toast notification when movie added to favourites)
        if(!alreadyAdded) {
            favourites.push(movie);
            localStorage.setItem("favourites", JSON.stringify(favourites));
            button.textContent = "Remove"
            showToast("Added to Favourites");

        } else {
           const kept = favourites.filter(f => f.id !== movie.id) ;
           localStorage.setItem("favourites", JSON.stringify(kept));
            button.textContent = "Add to Favourites"
            showToast("Removed from Favourites")
        }
        }); // <<

        const genreList = document.getElementById("genreList");
        if (genreList) {
            genreList.addEventListener("click", event => {
                const button = event.target.closest(".genre-button");
                if (!button) return;

                document.querySelectorAll(".genre-button").forEach(item => {
                    item.classList.remove("active");
                });

                button.classList.add("active");
                this.setGenre(button.dataset.genre);
            });
        }
    }
}

// FETCH API & INITIALISE LIBRARY PAGE
!async function () {
    const popularUrl = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
    const genresUrl = 'https://api.themoviedb.org/3/genre/movie/list?language=en-US';
    
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjN2JhZTIwZjJiYWQ4OTFiODk0YTc5ZjU3YjQwYWY3MyIsIm5iZiI6MTc4NzczNDc4OS45NzQwMDAyLCJzdWIiOiI2YThlYWIwNTY3ZDVlZTMyYmNiNGY1MTAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.puYjgDGBYFueOCi84hXL0WF7k6X7BYO56f4f6rekRWw'
        }
    };

    try {
        // Fetch TMDB Genre list and Movies list at the same time
        const [genresResponse, moviesResponse] = await Promise.all([
            fetch(genresUrl, options).then(res => res.json()),
            fetch(popularUrl, options).then(res => res.json())
        ]);

        // Map Genre IDs to names (e.g., { 28: "Action", 35: "Comedy" })
        const genreMap = {};
        if (genresResponse && genresResponse.genres) {
            genresResponse.genres.forEach(g => {
                genreMap[g.id] = g.name;
            });
        }

        // Map TMDB API results array into Movie object instances with genre names
        const loadedMovies = moviesResponse.results.map(item => {
            let title = item.title;
            let overview = item.overview;
            let releaseDate = item.release_date;
            let image = item.poster_path 
                ? "https://image.tmdb.org/t/p/w200" + item.poster_path 
                : "assets/images/elementor-placeholder-image.png";

            let id = item.id;    // (leah - added id for favourites functionality)

            // Map genre_ids from API to actual names
            let genres = (item.genre_ids || []).map(id => genreMap[id]).filter(Boolean);

            return new Movie(title, overview, releaseDate, image, id, genres); // (leah - added id to list)
        });


        // Initialise Library Components with API Data
        new MovieGrid(loadedMovies);
        initialiseGenreScrolling();

    } catch (error) {
        console.error("Error fetching data from TMDB:", error);
    }
}();
