const bookMarks = document.querySelectorAll(".bookmarkBtn");

bookMarks.forEach(function (icon) {
    icon.addEventListener("click", function () {
        icon.classList.toggle("fa-solid");
        icon.classList.toggle("fa-regular");
    });
});