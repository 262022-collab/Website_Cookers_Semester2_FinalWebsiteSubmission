import { getFavouritesKey } from "./user-id.js";
const FAVOURITES_KEY = await getFavouritesKey();
const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

// Leah - Add to favourites
function isSaved(id) { 
    const saved = JSON.parse(localStorage.getItem(FAVOURITES_KEY) || "[]");
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

// Details
function formatRuntime(minutes) {
    if (!minutes) return "";

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

function getAgeRating(movie) {
    const countries = movie.release_dates?.results || [];

    // Use South African rating, otherwise fall back to US rating
    for (const code of ["ZA", "US"]) {
        const country = countries.find(c => c.iso_3166_1 === code);
        const rated = country?.release_dates.find(r => r.certification);
        if (rated) return rated.certification;
    }
    return "";
}

function displayDetails(movie) {
    const parts = [];

    if (movie.release_date) {
        parts.push(new Date(movie.release_date + "T00:00:00").toLocaleDateString("en-ZA", {
            day: "numeric",
            month: "short",
            year: "numeric"
        }));
    }

    const runtime = formatRuntime(movie.runtime);
    if (runtime) parts.push(runtime);

    const ageRating = getAgeRating(movie);
    if (ageRating) parts.push(`<span class="age-rating">${ageRating}</span>`);

    document.getElementById("movieDetails").innerHTML = parts.join(`<span class="details-dot">•</span>`);

    // Genres
    document.getElementById("movieGenres").innerHTML = (movie.genres || [])
        .map(genre => `<span class="genre-tag">${genre.name}</span>`)
        .join("");
}

// Cast
function displayCast(movie) {
    const cast = (movie.credits?.cast || []).slice(0, 5);

    if (cast.length === 0) {
        document.getElementById("castSection").hidden = true;
        return;
    }

    document.getElementById("castList").innerHTML = cast.map(person => {
        const photo = person.profile_path
            ? `<img class="cast-photo" src="https://image.tmdb.org/t/p/w185${person.profile_path}" alt="${person.name}" loading="lazy">`
            : `<div class="cast-photo" aria-hidden="true"><i class="fa-solid fa-user"></i></div>`;

        return `
            <div class="cast-member">
                ${photo}
                <p class="cast-name">${person.name}</p>
                <p class="cast-character">${person.character || "Unknown role"}</p>
            </div>
        `;
    }).join("");
}

// Where to Watch
function displayProviders(movie) {
    const container = document.getElementById("providerGroups");
    const za = movie["watch/providers"]?.results?.ZA;

    const groups = za ? [
        { label: "Stream", list: za.flatrate },
        { label: "Rent", list: za.rent },
        { label: "Buy", list: za.buy }
    ].filter(group => group.list && group.list.length > 0) : [];

    if (groups.length === 0) {
        container.innerHTML = `<p class="empty-message">This movie isn't available to stream, rent or buy in South Africa right now.</p>`;
        return;
    }

    container.innerHTML = groups.map(group => `
        <div class="provider-group">
            <p class="provider-label">${group.label}</p>
            <div class="provider-list">
                ${group.list.map(provider => `
                    <a class="provider" href="${za.link}" target="_blank">
                        <img src="https://image.tmdb.org/t/p/w92${provider.logo_path}" alt="">
                        <span>${provider.provider_name}</span>
                    </a>
                `).join("")}
            </div>
        </div>
    `).join("");
}

// Similar Movies
function displaySimilar(movie) {
    const recommended = movie.recommendations?.results || [];
    const source = recommended.length > 0 ? recommended : (movie.similar?.results || []);
    const similar = source.filter(m => m.poster_path).slice(0, 5);

    if (similar.length === 0) {
        document.getElementById("similarSection").hidden = true;
        return;
    }

    document.getElementById("similarList").innerHTML = similar.map(m => {
        const year = m.release_date ? m.release_date.split("-")[0] : "N/A";
        const rating = m.vote_average ? m.vote_average.toFixed(1) : "N/A";

        return `
            <a class="similar-card" href="individual.html?id=${m.id}">
                <img class="similar-poster" src="https://image.tmdb.org/t/p/w342${m.poster_path}" alt="${m.title}" loading="lazy">
                <p class="similar-title">${m.title}</p>
                <p class="similar-meta"><i class="fa-solid fa-star"></i> ${rating} • ${year}</p>
            </a>
        `;
    }).join("");
}

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

    const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US&append_to_response=credits,release_dates,watch/providers,recommendations,similar`;

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
            displayDetails(movie);
            displayCast(movie);
            displayProviders(movie);
            displaySimilar(movie);
        const savedMovie = toSavedMovie(movie); // > Leah - Favourites
        updateSaveButton(isSaved(savedMovie.id)); 

        document.getElementById("saveBtn").addEventListener("click", event => {
            const favourites = JSON.parse(localStorage.getItem(FAVOURITES_KEY) || "[]");
            const alreadyAdded = favourites.some(m => m.id === savedMovie.id);

            if(!alreadyAdded) {
                favourites.push(savedMovie);
                localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favourites));
                updateSaveButton(true);
                showToast("Added to Favourites");
            } else {
                const kept = favourites.filter(m => m.id !== savedMovie.id);
                localStorage.setItem(FAVOURITES_KEY, JSON.stringify(kept));
                updateSaveButton(false);
                showToast("Removed from Favourites");
            }
        });
        
    } catch (error) {
        console.error("Error fetching movie from TMDB:", error);
    }
}();

