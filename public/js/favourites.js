const FAVOURITES_KEY = "favourites";
const grid = document.getElementById("favouritesGrid");

let lastRemoved = null;

function drawFavourites() {
const favourites = JSON.parse(localStorage.getItem(FAVOURITES_KEY) || "[]");

if(favourites.length === 0){
    grid.innerHTML = `
        <div class="col-12 w-100 d-flex flex-column justify-content-center align-items-center noFavouritesWrap">
         <p class="noFavourites mb-0">No favourites yet ):</p>
         <p class="noFavouritesHint">Browse library to add movies to your favourites <a class="libraryLink" href="../pages/library.html"><i class="fa-solid fa-arrow-right-long"></i></a></p>
        </div>`;

    return;
}

// Saved movies to display on Favourites Page

const html = favourites.map(movie => {
    const releaseYear = movie.releaseDate ? movie.releaseDate.split("-")[0] : "N/A";
    const displayGenres = movie.genres.length > 0 ? movie.genres.join(", ") : "General";
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
                                <button type="button" class="btn btn-outline-secondary btn-sm removeBtn" data-id="${movie.id}">Remove</button>
                            </div>
                        </div>
                    </div>
                </div>`;
}).join("")
grid.innerHTML = html;
}

drawFavourites();

// Remove movies from favourites

grid.addEventListener("click", event => {
    const button = event.target.closest(".removeBtn");
    if(!button) return;

    const movieId = Number(button.dataset.id);

    const saved = JSON.parse(localStorage.getItem(FAVOURITES_KEY) || "[]");
    lastRemoved = saved.find(m => m.id === movieId);
    const kept = saved.filter(m => m.id !== movieId);
    localStorage.setItem(FAVOURITES_KEY, JSON.stringify(kept));
    drawFavourites();

    showToast("Item removed", true);

});

// Toast pop-up message

function showToast(msg) {
    const toastBody = document.getElementById("favToastMsg");
    toastBody.textContent = msg;

    const toast = document.getElementById("favToast");
    
    bootstrap.Toast.getOrCreateInstance(toast).show();
}

// Undo button

function showToast(msg, showUndo) {
    const toastMsg = document.getElementById("favToastMsg");
    toastMsg.textContent = msg;

    const undoBtn = document.getElementById("undoBtn");
    if (showUndo) {
        undoBtn.classList.remove("d-none");
    }
    else {
        undoBtn.classList.add("d-none");
    }

    const toast = document.getElementById("favToast");
    bootstrap.Toast.getOrCreateInstance(toast, { delay: 8000} ).show();

}

const undoBtn = document.getElementById("undoBtn");

undoBtn.addEventListener("click", () => {
    if (lastRemoved === null) return;

    const savedList = JSON.parse(localStorage.getItem(FAVOURITES_KEY) || "[]");
    savedList.push(lastRemoved);
    localStorage.setItem(FAVOURITES_KEY, JSON.stringify(savedList));

    drawFavourites();
    bootstrap.Toast.getOrCreateInstance(document.getElementById("favToast")).hide();
    lastRemoved = null;
});
