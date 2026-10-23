// Movie Class Definition
class Movie {
    constructor(_title, _overview, _releaseDate, _image, _backdrop, _rating = "N/A") {
        this.title = _title;
        this.overview = _overview;
        this.releaseDate = _releaseDate;
        this.image = _image;
        this.backdrop = _backdrop;
        this.rating = _rating;
    }
}

// Work out how many cards fit on one slide for the screen width
function getCardsPerSlide() {
    if (window.innerWidth < 576) {
        return 2;
    }
    if (window.innerWidth < 992) {
        return 3;
    }
    return 4;
}

// Turn "2026-11-12" into "12 Nov 2026"
function formatReleaseDate(releaseDate) {
    if (!releaseDate) return "Release date TBA";

    return new Date(releaseDate + "T00:00:00").toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

// POPULAR PICKS CAROUSEL & HERO CLASS
class PopularCarousel {
    constructor(moviesList) {
        this.inner = document.getElementById("popularCarouselInner");
        this.carousel = document.getElementById("popularCarousel");
        this.heroCarousel = document.getElementById("heroCarousel");
        this.heroInner = document.getElementById("heroCarouselInner");
        this.heroIndicators = document.querySelector(".hero-indicators");
        this.movies = moviesList;
        this.selectedIndex = 0;
        this.heroInstance = null;

        this.render();
        this.renderHero();
        this.bindEvents();
    }

    // Get the movie numbers of the cards on the slide you can see
    getVisibleIndexes() {
        const cards = this.carousel.querySelectorAll(".carousel-item.active .popular-card");
        return [...cards].map(card => Number(card.dataset.index));
    }

    render() {
        const cardsPerSlide = getCardsPerSlide();
        const slides = [];

        for (let i = 0; i < this.movies.length; i += cardsPerSlide) {
            const slideMovies = this.movies.slice(i, i + cardsPerSlide);
            const isActive = this.selectedIndex >= i && this.selectedIndex < i + cardsPerSlide;

            slides.push(`
                <div class="carousel-item ${isActive ? "active" : ""}">
                    <div class="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-3">
                        ${slideMovies.map((movie, slideIndex) => {
                            const movieIndex = i + slideIndex;
                            const isSelected = movieIndex === this.selectedIndex;

                            return `
                                <div class="col">
                                    <article class="popular-card ${isSelected ? "selected" : ""}" data-index="${movieIndex}" role="button" tabindex="0" aria-label="Show ${movie.title} in hero">
                                        <img class="popular-card-image" src="${movie.backdrop}" alt="${movie.title}" loading="lazy">
                                        <div class="popular-card-overlay">
                                            <h3 class="popular-card-title">${movie.title}</h3>
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

        this.inner.innerHTML = slides.join("");
    }

    // The hero shows the backdrops of the cards you can see
    renderHero() {
        const visible = this.getVisibleIndexes();
        if (visible.length === 0) return;

        if (!visible.includes(this.selectedIndex)) {
            this.selectedIndex = visible[0];
        }

        this.heroInner.innerHTML = visible.map(index => {
            const movie = this.movies[index];
            const isActive = index === this.selectedIndex;

            // If the backdrop fails to load use the poster instead
            return `
                <div class="carousel-item ${isActive ? "active" : ""}" data-index="${index}">
                    <img class="hero-scene" src="${movie.backdrop}" alt="${movie.title} backdrop" onerror="this.onerror = null; this.src = '${movie.image}';">
                    <div class="hero-media-gradient"></div>
                </div>
            `;
        }).join("");

        this.heroIndicators.innerHTML = visible.map((index, position) => `
            <button type="button" class="${index === this.selectedIndex ? "active" : ""}" data-bs-target="#heroCarousel" data-bs-slide-to="${position}" aria-label="Show ${this.movies[index].title}"></button>
        `).join("");

        // Remove the old Bootstrap carousel before making a new one
        if (this.heroInstance) {
            this.heroInstance.dispose();
        }

        this.heroInstance = new bootstrap.Carousel(this.heroCarousel, {
            interval: 7000,
            ride: "carousel",
            pause: false
        });

        this.updateHeroDetails();
    }

    // Show the selected movie's title & rating and highlight its card
    updateHeroDetails() {
        const movie = this.movies[this.selectedIndex];

        document.querySelector(".hero-title").textContent = movie.title;
        document.getElementById("heroBadgeText").textContent = `Rating · ${movie.rating}/10`;

        const heroCopy = document.querySelector(".hero-copy");
        if (movie.title.length > 18) {
            heroCopy.classList.add("hero-copy--long-title");
        }
        else {
            heroCopy.classList.remove("hero-copy--long-title");
        }

        document.querySelectorAll(".popular-card").forEach(card => {
            if (Number(card.dataset.index) === this.selectedIndex) {
                card.classList.add("selected");
            }
            else {
                card.classList.remove("selected");
            }
        });
    }

    // Slide the hero to the card that was picked
    selectMovie(card) {
        const position = this.getVisibleIndexes().indexOf(Number(card.dataset.index));
        if (position === -1) return;

        this.heroInstance.to(position);
    }

    bindEvents() {
        this.inner.addEventListener("click", event => {
            const card = event.target.closest(".popular-card");
            if (!card) return;

            this.selectMovie(card);
        });

        this.inner.addEventListener("keydown", event => {
            const card = event.target.closest(".popular-card");
            if (!card) return;

            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                this.selectMovie(card);
            }
        });

        // Update the title & rating when the hero slides
        this.heroCarousel.addEventListener("slid.bs.carousel", () => {
            const activeSlide = this.heroCarousel.querySelector(".carousel-item.active");
            this.selectedIndex = Number(activeSlide.dataset.index);
            this.updateHeroDetails();
        });

        // Rebuild the hero when new cards slide into view
        this.carousel.addEventListener("slid.bs.carousel", () => this.renderHero());

        window.addEventListener("resize", () => {
            this.render();
            this.renderHero();
        });
    }
}

// UPCOMING MOVIES CAROUSEL CLASS
class UpcomingCarousel {
    constructor(moviesList) {
        this.inner = document.getElementById("upcomingCarouselInner");
        this.movies = moviesList;

        this.render();
        this.bindEvents();
    }

    // Show a message instead of the movies
    showMessage(msg) {
        this.inner.innerHTML = `<p class="upcoming-status" role="status">${msg}</p>`;
        this.toggleArrows(false);
    }

    toggleArrows(show) {
        document.querySelectorAll("#upcomingCarousel .carousel-arrow").forEach(arrow => {
            arrow.hidden = !show;
        });
    }

    render() {
        if (this.movies.length === 0) {
            this.showMessage("No upcoming movies are available right now.");
            return;
        }

        const cardsPerSlide = getCardsPerSlide();
        const slides = [];

        for (let i = 0; i < this.movies.length; i += cardsPerSlide) {
            const slideMovies = this.movies.slice(i, i + cardsPerSlide);

            slides.push(`
                <div class="carousel-item ${i === 0 ? "active" : ""}">
                    <div class="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-3">
                        ${slideMovies.map(movie => `
                            <div class="col">
                                <article class="upcoming-card">
                                    <img class="popular-card-image" src="${movie.backdrop}" alt="${movie.title}" loading="lazy">
                                    <div class="popular-card-overlay">
                                        <h3 class="popular-card-title">${movie.title}</h3>
                                        <p class="upcoming-release-date">Releases ${formatReleaseDate(movie.releaseDate)}</p>
                                    </div>
                                </article>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `);
        }

        this.inner.innerHTML = slides.join("");

        // Only show the arrows if there is more than one slide
        this.toggleArrows(slides.length > 1);
    }

    bindEvents() {
        window.addEventListener("resize", () => this.render());
    }
}

// LATEST MOVIE REVIEWS CLASS
class LatestReviews {
    constructor(reviewsList) {
        this.list = document.getElementById("latestReviewsList");
        this.reviews = reviewsList;

        this.render();
    }

    // Show a message instead of the reviews
    showMessage(msg) {
        this.list.innerHTML = `<p class="latest-reviews-status" role="status">${msg}</p>`;
    }

    // Turn a TMDB rating out of 10 into 5 stars, e.g. 8 = ★★★★☆
    getStars(rating) {
        const starCount = rating ? Math.round(rating / 2) : 0;
        return "★".repeat(starCount) + "☆".repeat(5 - starCount);
    }

    // Show how long ago the review was written, e.g. "2 hours ago"
    getTimeAgo(createdAt) {
        if (!createdAt) return "Date unavailable";

        const hours = Math.max(1, Math.floor((new Date() - new Date(createdAt)) / 3600000));
        if (hours < 24) {
            return `${hours} hour${hours === 1 ? "" : "s"} ago`;
        }

        const days = Math.floor(hours / 24);
        if (days < 30) {
            return `${days} day${days === 1 ? "" : "s"} ago`;
        }

        return new Date(createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
    }

    render() {
        if (this.reviews.length === 0) {
            this.showMessage("No movie reviews are available right now.");
            return;
        }

        this.list.innerHTML = this.reviews.map(review => {
            const ratingLabel = review.rating ? `Rating: ${review.rating} out of 10` : "Not rated";

            return `
                <article class="latest-review-card">
                    <div class="latest-review-meta">
                        <span class="latest-review-avatar" aria-hidden="true"><i class="fa-solid fa-user"></i></span>
                        <span class="latest-review-author">${review.author}</span>
                    </div>
                    <div class="latest-review-title-row">
                        <h3 class="latest-review-movie-title">${review.movieTitle}</h3>
                        <span class="latest-review-rating" role="img" aria-label="${ratingLabel}">${this.getStars(review.rating)}</span>
                    </div>
                    <p class="latest-review-content">"${review.content}"</p>
                    <p class="latest-review-date">${this.getTimeAgo(review.createdAt)}</p>
                </article>
            `;
        }).join("");
    }
}

// FETCH API & INITIALISE HOME PAGE
!async function () {
    const popularUrl = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
    const topRatedUrl = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1';
    // Same as TMDB's /movie/upcoming list, but with a minimum release date of today
    const today = new Date().toLocaleDateString("en-CA"); // "YYYY-MM-DD"
    const upcomingUrl = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false'
        + '&language=en-US&page=1&sort_by=popularity.desc&with_release_type=2%7C3'
        + `&release_date.gte=${today}`;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjN2JhZTIwZjJiYWQ4OTFiODk0YTc5ZjU3YjQwYWY3MyIsIm5iZiI6MTc4NzczNDc4OS45NzQwMDAyLCJzdWIiOiI2YThlYWIwNTY3ZDVlZTMyYmNiNGY1MTAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.puYjgDGBYFueOCi84hXL0WF7k6X7BYO56f4f6rekRWw'
        }
    };

    // Map a TMDB API result into a Movie object instance
    const createMovie = item => {
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
    };

    // Popular picks
    try {
        const popularResponse = await fetch(popularUrl, options).then(res => res.json());
        const popularMovies = popularResponse.results.map(createMovie);

        new PopularCarousel(popularMovies);

    } catch (error) {
        console.error("Error fetching popular movies from TMDB:", error);
    }

    // Latest movie reviews
    try {
        const topRatedResponse = await fetch(topRatedUrl, options).then(res => res.json());

        // Most popular top rated movies first
        const topRatedMovies = topRatedResponse.results
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 8);

        // Fetch the reviews for each movie at the same time
        const reviewResponses = await Promise.all(
            topRatedMovies.map(movie =>
                fetch(`https://api.themoviedb.org/3/movie/${movie.id}/reviews?language=en-US&page=1`, options)
                    .then(res => res.json())
            )
        );

        // Take the newest review from each movie & only keep the top 4
        const reviews = [];
        reviewResponses.forEach((reviewResponse, index) => {
            const movieReviews = reviewResponse.results || [];
            if (movieReviews.length === 0) return;

            const newest = movieReviews.sort((a, b) => b.created_at.localeCompare(a.created_at))[0];

            reviews.push({
                movieTitle: topRatedMovies[index].title,
                author: newest.author_details?.username || newest.author || "Movie fan",
                content: newest.content || "No written review was provided.",
                rating: newest.author_details?.rating,
                createdAt: newest.created_at
            });
        });

        new LatestReviews(reviews.slice(0, 4));

    } catch (error) {
        console.error("Error fetching movie reviews from TMDB:", error);
        document.getElementById("latestReviewsList").innerHTML =
            `<p class="latest-reviews-status" role="status">Movie reviews could not be loaded. Please try again later.</p>`;
    }

    // Upcoming movies
    try {
        const upcomingResponse = await fetch(upcomingUrl, options).then(res => res.json());

        // release_date.gte matches any theatrical release, which can differ from
        // the primary release_date in the results, so check again, soonest first
        const upcomingMovies = upcomingResponse.results
            .filter(item => item.release_date && item.release_date >= today)
            .sort((a, b) => a.release_date.localeCompare(b.release_date))
            .map(createMovie);

        new UpcomingCarousel(upcomingMovies);

    } catch (error) {
        console.error("Error fetching upcoming movies from TMDB:", error);
        document.getElementById("upcomingCarouselInner").innerHTML =
            `<p class="upcoming-status" role="status">Upcoming movies could not be loaded. Please try again later.</p>`;
        document.querySelectorAll("#upcomingCarousel .carousel-arrow").forEach(arrow => {
            arrow.hidden = true;
        });
    }
}();
