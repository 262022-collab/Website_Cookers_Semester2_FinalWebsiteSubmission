// Movie Class Definition
class Movie {
    constructor(_title, _overview, _releaseDate, _image, _rating = 0) {
        this.title = _title;
        this.overview = _overview;
        this.releaseDate = _releaseDate;
        this.image = _image;
        this.rating = _rating;
    }
}

// Global variable to hold loaded API movies for resize re-renders
let loadedMovies = [];

// Determine how many cards to show per slide based on screen width
function getPopularCardsPerSlide() {
    if (window.innerWidth < 576) {
        return 2;
    }
    if (window.innerWidth < 992) {
        return 3;
    }
    return 4;
}

// Render the carousel slides dynamically using API data
function renderPopularCarousel() {
    const inner = document.getElementById("popularCarouselInner");

    if (!inner || loadedMovies.length === 0) {
        return;
    }

    const cardsPerSlide = getPopularCardsPerSlide();
    const slides = [];

    for (let i = 0; i < loadedMovies.length; i += cardsPerSlide) {
        const slideMovies = loadedMovies.slice(i, i + cardsPerSlide);

        slides.push(`
            <div class="carousel-item ${i === 0 ? "active" : ""}">
                <div class="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-3">
                    ${slideMovies.map(movie => `
                        <div class="col">
                            <article class="popular-card">
                                <img
                                    class="popular-card-image"
                                    src="${movie.image}"
                                    alt="${movie.title}"
                                    loading="lazy"
                                >
                                <div class="popular-card-overlay">
                                    <h3 class="popular-card-title">${movie.title}</h3>
                                    <div class="rating">
                                        <span class="rating-number">${movie.rating}</span>
                                        <span class="stars">★★★★★</span>
                                    </div>
                                </div>
                            </article>
                        </div>
                    `).join("")}
                </div>
            </div>
        `);
    }

    inner.innerHTML = slides.join("");
}

function initialisePopularCarousel() {
    renderPopularCarousel();
    window.addEventListener("resize", renderPopularCarousel);
}

// FETCH API & INITIALISE HOME PAGE CAROUSEL
!async function () {
    const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjN2JhZTIwZjJiYWQ4OTFiODk0YTc5ZjU3YjQwYWY3MyIsIm5iZiI6MTc4NzczNDc4OS45NzQwMDAyLCJzdWIiOiI2YThlYWIwNTY3ZDVlZTMyYmNiNGY1MTAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.puYjgDGBYFueOCi84hXL0WF7k6X7BYO56f4f6rekRWw'
        }
    };

    try {
        let response = await fetch(url, options);
        let data = await response.json();

        console.log(data);

        // Map TMDB API results array into Movie object instances
        loadedMovies = data.results.map(item => {
            let title = item.title;
            let overview = item.overview;
            let releaseDate = item.release_date;
            let rating = item.vote_average ? item.vote_average.toFixed(1) : "N/A";
            let image = item.poster_path 
                ? "https://image.tmdb.org/t/p/w500" + item.poster_path 
                : "assets/images/elementor-placeholder-image.png";

            return new Movie(title, overview, releaseDate, image, rating);
        });

        // Initialise Home Page Carousel after movies are loaded
        initialisePopularCarousel();

    } catch (error) {
        console.error("Error fetching popular movies for carousel:", error);
    }
}();

