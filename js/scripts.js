/* ============================================================
   OPEN WINDOW MOVIE SITE
   Homepage JavaScript
   ============================================================ */


/* ============================================================
   MOVIE DATA
   ============================================================ */

const movies = [
    {
        id: 1,
        title: "Movie title",
        year: 2026,
        rating: 7.9,
        genre: "Thriller",
        image: "assets/images/elementor-placeholder-image 1.png"
    },
    {
        id: 2,
        title: "Shadow Protocol",
        year: 2025,
        rating: 8.6,
        genre: "Action",
        image: "assets/images/elementor-placeholder-image 1.png"
    },
    {
        id: 3,
        title: "Beyond the Stars",
        year: 2025,
        rating: 7.2,
        genre: "Drama",
        image: "assets/images/elementor-placeholder-image 1.png"
    },
    {
        id: 4,
        title: "The Last Signal",
        year: 2025,
        rating: 7.7,
        genre: "Thriller",
        image: "assets/images/elementor-placeholder-image 1.png"
    },
    {
        id: 5,
        title: "Fast Horizon",
        year: 2024,
        rating: 8.1,
        genre: "Action",
        image: "assets/images/elementor-placeholder-image 1.png"
    },
    {
        id: 6,
        title: "Love Again",
        year: 2024,
        rating: 7.5,
        genre: "Romance",
        image: "assets/images/elementor-placeholder-image 1.png"
    },
    {
        id: 7,
        title: "Dark House",
        year: 2024,
        rating: 8.0,
        genre: "Horror",
        image: "assets/images/elementor-placeholder-image 1.png"
    },
    {
        id: 8,
        title: "Laughing Matter",
        year: 2023,
        rating: 7.1,
        genre: "Comedy",
        image: "assets/images/elementor-placeholder-image 1.png"
    },
    {
        id: 9,
        title: "Red Planet",
        year: 2023,
        rating: 8.3,
        genre: "Drama",
        image: "assets/images/elementor-placeholder-image 1.png"
    },
    {
        id: 10,
        title: "Final Code",
        year: 2023,
        rating: 7.8,
        genre: "Thriller",
        image: "assets/images/elementor-placeholder-image 1.png"
    },
    {
        id: 11,
        title: "The Colony",
        year: 2022,
        rating: 8.2,
        genre: "Action",
        image: "assets/images/elementor-placeholder-image 1.png"
    },
    {
        id: 12,
        title: "After Midnight",
        year: 2022,
        rating: 6.9,
        genre: "Horror",
        image: "assets/images/elementor-placeholder-image 1.png"
    },
    {
        id: 13,
        title: "The Journey",
        year: 2022,
        rating: 7.6,
        genre: "Drama",
        image: "assets/images/elementor-placeholder-image 1.png"
    },
    {
        id: 14,
        title: "Infinite",
        year: 2021,
        rating: 8.4,
        genre: "Action",
        image: "assets/images/elementor-placeholder-image 1.png"
    },
    {
        id: 15,
        title: "One More Summer",
        year: 2021,
        rating: 7.0,
        genre: "Romance",
        image: "assets/images/elementor-placeholder-image 1.png"
    },
    {
        id: 16,
        title: "The Forgotten",
        year: 2021,
        rating: 7.9,
        genre: "Thriller",
        image: "assets/images/elementor-placeholder-image 1.png"
    },
    {
        id: 17,
        title: "The Visitor",
        year: 2020,
        rating: 7.3,
        genre: "Horror",
        image: "assets/images/elementor-placeholder-image 1.png"
    },
    {
        id: 18,
        title: "Comedy Night",
        year: 2020,
        rating: 7.4,
        genre: "Comedy",
        image: "assets/images/elementor-placeholder-image 1.png"
    },
    {
        id: 19,
        title: "Deep Space",
        year: 2020,
        rating: 8.5,
        genre: "Drama",
        image: "assets/images/elementor-placeholder-image 1.png"
    },
    {
        id: 20,
        title: "Last Light",
        year: 2019,
        rating: 7.8,
        genre: "Thriller",
        image: "assets/images/elementor-placeholder-image 1.png"
    }
];


/* ============================================================
   POPULAR CAROUSEL
   ============================================================ */

function getPopularCardsPerSlide() {

    if (window.innerWidth < 576) {
        return 2;
    }

    if (window.innerWidth < 992) {
        return 3;
    }

    return 4;

}


function renderPopularCarousel() {

    const inner = document.getElementById("popularCarouselInner");

    if (!inner) {
        return;
    }

    const cardsPerSlide = getPopularCardsPerSlide();

    const slides = [];

    for (let i = 0; i < movies.length; i += cardsPerSlide) {

        const slideMovies = movies.slice(i, i + cardsPerSlide);

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

                                    <h3 class="popular-card-title">
                                        ${movie.title}
                                    </h3>

                                    <div class="rating">

                                        <span class="rating-number">
                                            ${movie.rating}
                                        </span>

                                        <span class="stars">
                                            ★★★★★
                                        </span>

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


/* ============================================================
   GENRE HORIZONTAL SCROLL
   ============================================================ */

/*
 * On touch devices the browser naturally handles horizontal
 * scrolling. On desktop, convert vertical mouse-wheel movement
 * over the genre row into horizontal movement.
 */
function initialiseGenreScrolling() {

    const genreScroll =
        document.querySelector(".genre-scroll");

    if (!genreScroll) {
        return;
    }

    const previousButton =
        document.getElementById("genrePrev");
    const nextButton =
        document.getElementById("genreNext");

    const updateScrollControls = () => {

        const maxScroll =
            genreScroll.scrollWidth -
            genreScroll.clientWidth;

        previousButton.hidden =
            maxScroll <= 1 ||
            genreScroll.scrollLeft <= 1;

        nextButton.hidden =
            maxScroll <= 1 ||
            genreScroll.scrollLeft >= maxScroll - 1;

    };

    previousButton.addEventListener(
        "click",
        () => genreScroll.scrollBy({
            left: -genreScroll.clientWidth * 0.75,
            behavior: "smooth"
        })
    );

    nextButton.addEventListener(
        "click",
        () => genreScroll.scrollBy({
            left: genreScroll.clientWidth * 0.75,
            behavior: "smooth"
        })
    );

    genreScroll.addEventListener(
        "scroll",
        updateScrollControls,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        updateScrollControls
    );

    updateScrollControls();

    genreScroll.addEventListener(
        "wheel",
        event => {

            /*
             * If the wheel is primarily vertical, use it to
             * scroll the genre row horizontally.
             */
            if (
                Math.abs(event.deltaY) >
                Math.abs(event.deltaX)
            ) {

                event.preventDefault();

                genreScroll.scrollLeft +=
                    event.deltaY;

            }

        },
        { passive: false }
    );
}


/* ============================================================
   MOVIE GRID
   ============================================================ */

class MovieGrid {

    constructor() {

        this.grid =
            document.getElementById(
                "movieGrid"
            );

        this.showMoreButton =
            document.getElementById(
                "showMoreButton"
            );

        this.visibleCount = 16;

        this.activeGenre = "All";

        this.render();

        this.bindEvents();

    }


    getFilteredMovies() {

        if (this.activeGenre === "All") {
            return movies;
        }

        return movies.filter(
            movie =>
                movie.genre ===
                this.activeGenre
        );

    }


    render() {

        const filtered =
            this.getFilteredMovies();

        const visible =
            filtered.slice(
                0,
                this.visibleCount
            );


        this.grid.innerHTML =
            visible.map(
                movie => {

                    return `
                        <article
                            class="grid-movie"
                            data-id="${movie.id}"
                        >

                            <img
                                class="grid-movie-image"
                                src="${movie.image}"
                                alt="${movie.title}"
                                loading="lazy"
                            >

                            <div class="grid-movie-title">
                                ${movie.title}
                            </div>

                        </article>
                    `;

                }
            ).join("");


        this.showMoreButton.style.display =
            filtered.length > this.visibleCount
                ? "flex"
                : "none";

    }


    setGenre(genre) {

        this.activeGenre = genre;

        this.visibleCount = 16;

        this.render();

    }


    showMore() {

        this.visibleCount += 8;

        this.render();

    }


    bindEvents() {

        this.showMoreButton.addEventListener(
            "click",
            () => this.showMore()
        );


        document
            .getElementById("genreList")
            .addEventListener(
                "click",
                event => {

                    const button =
                        event.target.closest(
                            ".genre-button"
                        );

                    if (!button) {
                        return;
                    }


                    document
                        .querySelectorAll(
                            ".genre-button"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );


                    this.setGenre(
                        button.dataset.genre
                    );

                }
            );

    }

}


/* ============================================================
   INITIALISE APPLICATION
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initialisePopularCarousel();

        new MovieGrid();

        initialiseGenreScrolling();

    }
);
