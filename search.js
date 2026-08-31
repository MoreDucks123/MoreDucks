const pages = [
   "/",
    "/Update/",
    "/Fruit-Forager/",
    "/Credits/",
    "/something/",
    "/Search/",
    "/Fruit-Forager/Fruits/",

];

const searchBox = document.getElementById("search");
const searchButton = document.getElementById("searchButton");
const results = document.getElementById("results");
const searchInfo = document.getElementById("searchInfo");

let pageData = [];

// Load the pages
async function loadPages() {
    for (const url of pages) {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                console.log("Could not load:", url);
                continue;
            }

            const html = await response.text();

            const page = new DOMParser().parseFromString(
                html,
                "text/html"
            );

            // Remove things we don't want to search
            page.querySelectorAll(
                "script, style, noscript, iframe, template"
            ).forEach(element => {
                element.remove();
            });

            // Search only the main content
            const main = page.querySelector("main");

            const text = main
                ? main.innerText.replace(/\s+/g, " ").trim()
                : page.body.innerText.replace(/\s+/g, " ").trim();

            pageData.push({
                title: page.title || "Untitled Page",
                url: url,
                text: text
            });

        } catch (error) {
            console.log("Error loading:", url, error);
        }
    }
}

// Escape special characters for RegExp
function escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Highlight matching words
function highlight(text, query) {
    const words = query
        .split(/\s+/)
        .filter(word => word.length > 0);

    let highlighted = text;

    words.forEach(word => {
        const escapedWord = escapeRegExp(word);

        highlighted = highlighted.replace(
            new RegExp(`(${escapedWord})`, "gi"),
            "<mark>$1</mark>"
        );
    });

    return highlighted;
}

// Get a short section of text around the match
function getSnippet(text, query) {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();

    const position = lowerText.indexOf(lowerQuery);

    // If the exact search isn't found,
    // show the beginning of the page
    if (position === -1) {
        return text.substring(0, 180) + "...";
    }

    const start = Math.max(0, position - 80);
    const end = Math.min(text.length, position + 180);

    let snippet = text.substring(start, end);

    if (start > 0) {
        snippet = "... " + snippet;
    }

    if (end < text.length) {
        snippet += " ...";
    }

    return snippet;
}

// Calculate how relevant a page is
function getScore(page, query) {
    const words = query.toLowerCase().split(/\s+/);

    const title = page.title.toLowerCase();
    const text = page.text.toLowerCase();

    let score = 0;

    words.forEach(word => {

        // Title matches are worth more
        if (title.includes(word)) {
            score += 20;
        }

        // Text matches
        if (text.includes(word)) {
            score += 5;
        }

        // Count how many times the word appears
        const occurrences = text.split(word).length - 1;

        score += occurrences;
    });

    return score;
}

// Perform the search
function searchWebsite() {
    const query = searchBox.value.trim();

    results.innerHTML = "";
    searchInfo.textContent = "";

    if (query === "") {
        return;
    }

    // Score every page
    const matches = pageData
        .map(page => ({
            ...page,
            score: getScore(page, query)
        }))
        .filter(page => page.score > 0)
        .sort((a, b) => b.score - a.score);

    // Display number of results
    searchInfo.textContent =
        matches.length +
        (matches.length === 1 ? " result" : " results");

    // No results
    if (matches.length === 0) {
        results.innerHTML = `
            <p>No results found for "<strong>${query}</strong>".</p>
        `;
        return;
    }

    // Display results
    matches.forEach(page => {

        const result = document.createElement("div");

        result.className = "search-result";

        const title = highlight(page.title, query);

        const snippet = highlight(
            getSnippet(page.text, query),
            query
        );

        result.innerHTML = `
            <a href="${page.url}" class="result-title">
                ${title}
            </a>

            <div class="result-url">
                ${page.url}
            </div>

            <p class="result-snippet">
                ${snippet}
            </p>
        `;

        results.appendChild(result);
    });
}

// Search button
searchButton.addEventListener("click", searchWebsite);

// Press Enter to search
searchBox.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchWebsite();
    }
});

// Load pages when the website starts
loadPages();