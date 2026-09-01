const topVignette = document.getElementById("topVignette");

window.addEventListener("scroll", function() {

    const scroll = window.scrollY;

    if (scroll <= 100) {
        topVignette.style.opacity = "0";
    } else {
        const opacity = Math.min(1, (scroll - 100) / 300);

        topVignette.style.opacity = opacity;
    }

});