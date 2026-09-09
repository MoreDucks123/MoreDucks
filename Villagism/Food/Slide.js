const images = document.querySelectorAll(".carousel-image");
const dots = document.querySelectorAll(".dot");

const previous = document.getElementById("previous");
const next = document.getElementById("next");

let currentSlide = 0;

function showSlide(index) {

    images.forEach(image => {
        image.classList.remove("active");
    });

    dots.forEach(dot => {
        dot.classList.remove("active");
    });

    images[index].classList.add("active");
    dots[index].classList.add("active");

    currentSlide = index;
}


// Next slide
function nextSlide() {

    let next = currentSlide + 1;

    if (next >= images.length) {
        next = 0;
    }

    showSlide(next);
}


// Previous slide
function previousSlide() {

    let previous = currentSlide - 1;

    if (previous < 0) {
        previous = images.length - 1;
    }

    showSlide(previous);
}


// Next button
next.addEventListener("click", function() {
    nextSlide();
});


// Previous button
previous.addEventListener("click", function() {
    previousSlide();
});


// Dots
dots.forEach(dot => {

    dot.addEventListener("click", function() {

        const slide = Number(dot.dataset.slide);

        showSlide(slide);

    });

});


// Automatically change every 3 seconds
setInterval(function() {
    nextSlide();
}, 3000);


// Show first slide
showSlide(0);