setInterval(showtime,1000);

function showtime() {
    constdate = new Date();
    myDisplayer(date.LocaleTimeString());
}

function myDisplayer(text) {
    let timer = document.getElementById("timer");
    timer.innerHTML = text;
}
