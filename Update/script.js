setInterval(showtime,1000);

function showtime() {
    const date = new Date();
    myDisplayer(date.toLocaleTimeString());
}

function myDisplayer(text) {
    let timer = document.getElementById("timer");
    timer.innerHTML = text;
}
