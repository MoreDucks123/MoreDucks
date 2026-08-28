function showDateTime() {
    const now = new Date();

    const date = now.toLocaleDateString([], {
        month: "long",
        day: "numeric",
        year: "numeric"
    });

    const time = now.toLocaleTimeString();

    document.getElementById("date").textContent = date;
    document.getElementById("clock").textContent = time;
}

setInterval(showDateTime, 1000);

showDateTime();
