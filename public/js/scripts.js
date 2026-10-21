// Movie Class Definition
class Movie {
    constructor(_title, _overview, _releaseDate, _image, _backdrop, _rating = 0) {
        this.title = _title;
        this.overview = _overview;
        this.releaseDate = _releaseDate;
        this.image = _image;
        this.backdrop = _backdrop;
        this.rating = _rating;
    }
}

// Global variable to hold loaded API movies for resize re-renders
let loadedMovies = [];
let selectedMovieIndex = 0;
let heroCarouselInstance;
let queuedHeroMovieIndex;

function escapeHtml(value) {
    const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
    };

    return String(value).replace(/[&<>"']/g, character => entities[character]);
}

function renderHeroIndicators() {
    const indicators = document.querySelector(".hero-indicators");

    if (!indicators) {
        return;
    }

    indicators.innerHTML = getVisiblePopularMovieIndices().map((index, position) => `
        <button
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide-to="${position}"
            class="${index === selectedMovieIndex ? "active" : ""}"
            aria-current="${index === selectedMovieIndex ? "true" : "false"}"
            data-movie-index="${index}"
            aria-label="Show ${escapeHtml(loadedMovies[index].title)}"
        ></button>
    `).join("");

    const activeIndicator = indicators.querySelector(".active");

    if (activeIndicator) {
        const indicatorLeft = activeIndicator.offsetLeft;
        const indicatorRight = indicatorLeft + activeIndicator.offsetWidth;

        if (indicatorLeft < indicators.scrollLeft) {
            indicators.scrollLeft = indicatorLeft;
        } else if (indicatorRight > indicators.scrollLeft + indicators.clientWidth) {
            indicators.scrollLeft = indicatorRight - indicators.clientWidth;
        }
    }
}

function getVisiblePopularMovieIndices() {
    const activeSlide = document.querySelector("#popularCarousel .carousel-item.active");

    if (!activeSlide) {
        return [];
    }

    return [...activeSlide.querySelectorAll(".popular-card")]
        .map(card => Number(card.dataset.movieIndex));
}

function renderHeroCarousel() {
    const carousel = document.getElementById("heroCarousel");
    const inner = document.getElementById("heroCarouselInner");
    const visibleMovieIndices = getVisiblePopularMovieIndices();

    if (!carousel || !inner || visibleMovieIndices.length === 0) {
        return;
    }

    if (heroCarouselInstance) {
        heroCarouselInstance.dispose();
    }
    queuedHeroMovieIndex = undefined;

    if (!visibleMovieIndices.includes(selectedMovieIndex)) {
        selectedMovieIndex = visibleMovieIndices[0];
    }

    inner.innerHTML = visibleMovieIndices.map(index => {
        const movie = loadedMovies[index];
        const title = escapeHtml(movie.title);
        const isActive = index === selectedMovieIndex;

        return `
            <div class="carousel-item${isActive ? " active" : ""}" data-movie-index="${index}">
                <img
                    class="hero-scene"
                    src="${escapeHtml(movie.backdrop || movie.image)}"
                    data-fallback-image="${escapeHtml(movie.image)}"
                    alt="${title} backdrop"
                >
                <div class="hero-media-gradient"></div>
            </div>
        `;
    }).join("");

    renderHeroIndicators();
    heroCarouselInstance = new bootstrap.Carousel(carousel, {
        interval: visibleMovieIndices.length > 1 ? 7000 : false,
        pause: false,
        ride: visibleMovieIndices.length > 1 ? "carousel" : false,
        touch: true,
        wrap: true
    });
    updateHeroMovieDetails(selectedMovieIndex);
}

function updateHeroMovieDetails(index) {
    selectedMovieIndex = index;
    const visibleMovieIndices = getVisiblePopularMovieIndices();

    if (loadedMovies.length === 0 || !visibleMovieIndices.includes(selectedMovieIndex)) {
        return;
    }

    const movie = loadedMovies[selectedMovieIndex];
    const heroCopy = document.querySelector(".hero-copy");
    const heroTitle = document.querySelector(".hero-title");
    const badgeText = document.getElementById("heroBadgeText");

    heroTitle.textContent = movie.title;
    heroCopy.classList.toggle("hero-copy--long-title", movie.title.length > 18);
    badgeText.textContent = `Rating · ${movie.rating}/10`;

    document.querySelectorAll(".popular-card").forEach(card => {
        const isSelected = Number(card.dataset.movieIndex) === selectedMovieIndex;
        card.classList.toggle("selected", isSelected);
        card.setAttribute("aria-pressed", String(isSelected));
    });

    renderHeroIndicators();
}

function selectHeroMovie(index) {
    const visibleMovieIndices = getVisiblePopularMovieIndices();
    const position = visibleMovieIndices.indexOf(index);

    if (position === -1 || !heroCarouselInstance) {
        return;
    }

    const activeSlide = document.querySelector("#heroCarousel .carousel-item.active");

    if (activeSlide && Number(activeSlide.dataset.movieIndex) === index) {
        queuedHeroMovieIndex = undefined;
        return;
    }

    queuedHeroMovieIndex = index;
    heroCarouselInstance.to(position);
}

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
            <div class="carousel-item ${selectedMovieIndex >= i && selectedMovieIndex < i + cardsPerSlide ? "active" : ""}">
                <div class="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-3">
                    ${slideMovies.map((movie, slideIndex) => {
                        const movieIndex = i + slideIndex;
                        const isSelected = movieIndex === selectedMovieIndex;
                        const title = escapeHtml(movie.title);

                        return `
                    <div class="col">
                        <article
                            class="popular-card${isSelected ? " selected" : ""}"
                            data-movie-index="${movieIndex}"
                            role="button"
                            tabindex="0"
                            aria-pressed="${isSelected}"
                            aria-label="Show ${title} in hero"
                        >
                            <img
                                class="popular-card-image"
                                src="${movie.backdrop}"
                                alt="${title}"
                                loading="lazy"
                            >
                            <div class="popular-card-overlay">
                                <h3 class="popular-card-title">${title}</h3>
                                <div class="rating">
                                    <span class="rating-number">${movie.rating}</span>
                                    <span class="stars">★★★★★</span>
                                </div>
                            </div>
                        </article>
                    </div>
                `;
                        }).join("")}
                </div>
            </div>
        `);
    }

    inner.innerHTML = slides.join("");
}

function initialisePopularCarousel() {
    renderPopularCarousel();
    renderHeroCarousel();

    const inner = document.getElementById("popularCarouselInner");
    const carousel = document.getElementById("popularCarousel");
    inner.addEventListener("click", event => {
        const card = event.target.closest(".popular-card");

        if (card) {
            selectHeroMovie(Number(card.dataset.movieIndex));
        }
    });
    inner.addEventListener("keydown", event => {
        const card = event.target.closest(".popular-card");

        if (card && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            selectHeroMovie(Number(card.dataset.movieIndex));
        }
    });

    document.getElementById("heroCarousel").addEventListener("slid.bs.carousel", event => {
        const activeSlide = event.target.querySelector(".carousel-item.active");

        if (activeSlide) {
            const activeMovieIndex = Number(activeSlide.dataset.movieIndex);
            updateHeroMovieDetails(activeMovieIndex);

            if (queuedHeroMovieIndex !== undefined) {
                const visibleMovieIndices = getVisiblePopularMovieIndices();
                const queuedPosition = visibleMovieIndices.indexOf(queuedHeroMovieIndex);

                if (queuedPosition === -1 || queuedHeroMovieIndex === activeMovieIndex) {
                    queuedHeroMovieIndex = undefined;
                } else {
                    heroCarouselInstance.to(queuedPosition);
                }
            }
        }
    });
    document.getElementById("heroCarouselInner").addEventListener("error", event => {
        const image = event.target;

        if (image.matches(".hero-scene") && image.src !== image.dataset.fallbackImage) {
            image.src = image.dataset.fallbackImage;
        }
    }, true);
    carousel.addEventListener("slid.bs.carousel", () => {
        const visibleMovieIndices = getVisiblePopularMovieIndices();

        if (visibleMovieIndices.length === 0) {
            return;
        }

        if (!visibleMovieIndices.includes(selectedMovieIndex)) {
            selectedMovieIndex = visibleMovieIndices[0];
        }

        renderHeroCarousel();
    });

    window.addEventListener("resize", () => {
        renderPopularCarousel();
        renderHeroCarousel();
    });
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
            let backdrop = item.backdrop_path
                ? "https://image.tmdb.org/t/p/w1280" + item.backdrop_path
                : image;

            return new Movie(title, overview, releaseDate, image, backdrop, rating);
        });

        // Initialise Home Page Carousel after movies are loaded
        initialisePopularCarousel();

    } catch (error) {
        console.error("Error fetching popular movies for carousel:", error);
    }
}();