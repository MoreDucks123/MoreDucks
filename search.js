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
const results = document.getElementById("results");
const searchInfo = document.getElementById("searchInfo");

let pageData = [];

async function loadPages() {
    for (const url of pages) {
        try {
            const response = await fetch(url);
            const html = await response.text();

            const doc = new DOMParser().parseFromString(
                html,
                "text/html"
            );

            pageData.push({
                title: doc.title || url,
                url: url,
                text: doc.body.innerText
                    .replace(/\s+/g, " ")
                    .trim()
            });

        } catch (error) {
            console.log("Could not load:", url);
        }
    }
}

function highlight(text, query) {
    const words = query
        .split(/\s+/)
        .filter(word => word.length > 0);

    let result = text;

    words.forEach(word => {
        const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        result = result.replace(
            new RegExp(`(${escaped})`, "gi"),
            "<mark>$1</mark>"
        );
    });

    return result;
}

function getSnippet(text, query) {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();

    const position = lowerText.indexOf(lowerQuery);

    if (position === -1) {
        return text.substring(0, 160) + "...";
    }

    const start = Math.max(0, position - 70);
    const end = Math.min(text.length, position + 120);

    let snippet = text.substring(start, end);

    if (start > 0) {
        snippet = "... " + snippet;
    }

    if (end < text.length) {
        snippet += " ...";
    }

    return snippet;
}

function searchWebsite() {
    const query = searchBox.value.trim();

    results.innerHTML = "";
    searchInfo.textContent = "";

    if (!query) {
        return;
    }

    const words = query.toLowerCase().split(/\s+/);

    const matches = pageData
        .map(page => {

            const text = page.text.toLowerCase();
            const title = page.title.toLowerCase();

            let score = 0;

            words.forEach(word => {
                if (title.includes(word)) {
                    score += 10;
                }

                if (text.includes(word)) {
                    score += 5;
                }

                const occurrences =
                    text.split(word).length - 1;

                score += occurrences;
            });

            return {
                ...page,
                score
            };

        })
        .filter(page => page.score > 0)
        .sort((a, b) => b.score - a.score);

    searchInfo.textContent =
        matches.length +
        (matches.length === 1 ? " result" : " results");

    if (matches.length === 0) {
        results.innerHTML = `
            <p>No results found for "<strong>${query}</strong>".</p>
        `;
        return;
    }

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

searchBox.addEventListener("input", searchWebsite);

loadPages();