const answer = document.getElementById("answer");
const submit = document.getElementById("submit");
const result = document.getElementById("result");

submit.addEventListener("click", function() {

    const playerAnswer = answer.value.trim().toLowerCase();

    if (playerAnswer === "sigmamoreducks") {
        result.innerHTML = "Correct! You may proceed.";
    } else {
        result.innerHTML = "Wrong!";
    }

});