// TODO: Cache common elements / page data / general optimization

/*  Called when the page loads in. Fills different pages with the same key elements,
*   in order to re-use code rather than rewriting it.   */
function initialFullLoad(page) {
    loadCommonElements();
    contentNavigation(page);
}

function projectInitialLoad() {
    const projectParams = new URLSearchParams(window.location.search);
    loadCommonElements();
    projectNavigation(projectParams.get("id"));
}

//  Calls changeActiveNavButton, updates the URL. then calls loadContent.
function contentNavigation(page) {
    changeActiveNavButton(page);
    window.history.pushState(page, "", "/" + page);
    loadContent(page);
}

function projectNavigation(projectID) {
    changeActiveNavButton("projects");
    window.history.pushState("project", "", "/" + "project?id=" + projectID);
    loadProject(projectID);
}

//  Changes the highlighted navigation button to the clicked one.
function changeActiveNavButton(page) {
    var id = "navbar-button-" + page;
    var buttons = Array.from(document.getElementsByClassName("navbar-button"));
    buttons.forEach(function (btn) {
        if (btn.id == id) {
            btn.classList.add("navbar-button-active");
        } else {
            btn.classList.remove("navbar-button-active");
        }
    });
}

/*  Loads in the JSON of the given main page, then creates and appends the cards for the page.
*   Used to contain individual page HTML, but I opted to use the card system for all main pages.
*   If I don't have card-style content on a page, I can simply decide to not call this function.    */
function loadContent(page) {
    var pageJSON = loadPageJSON(page);

    var cardHolder = document.getElementsByClassName("content-card-container")[0];

    if (cardHolder) {
        // Clear old cards from cardHolder to avoid duplicates
        while (cardHolder.firstChild) {
            cardHolder.removeChild(cardHolder.lastChild);
        }

        pageJSON = pageJSON.cards;
        for (card in pageJSON) {
            cardHolder.appendChild(createCard(pageJSON[card]));
        }
    }
}

// Loads in the JSON of a project page, then creates and appends the cards for the page.
function loadProject(projectID) {
    var projectJSON = loadProjectJSON(projectID);

    var cardHolder = document.getElementsByClassName("content-card-container")[0];

    if (cardHolder) {
        // Clear old cards from cardHolder to avoid duplicates
        while (cardHolder.firstChild) {
            cardHolder.removeChild(cardHolder.lastChild);
        }

        projectJSON = projectJSON.cards;
        for (card in projectJSON) {
            cardHolder.appendChild(createCard(projectJSON[card]));
        }
    }
}

//  Creates the "content-card" div element given a card's JSON file information.
function createCard(card) {
    var content_card = document.createElement("div");
    content_card.classList.add("content-card");

    // Check for different card layouts:
    if (card.image_src && card.description) {
        // Default image & description layout
        // Create image part
        card_img = document.createElement("img");
        card_img.src = window.location.origin + "/files/images/" + card.image_src;
        content_card.appendChild(card_img);

        // Create description part
        card_desc = document.createElement("p");
        card_desc.innerText = card.description;
        content_card.appendChild(card_desc);
    } else if (card.image_src) {
        // Image-only layout
        card_img = document.createElement("img");
        card_img.src = window.location.origin + "/files/images/" + card.image_src;

        content_card.classList.add("image-card");

        content_card.appendChild(card_img);
    } else if (card.description) {
        // Description-Only Layout

        card_desc = document.createElement("p");
        card_desc.innerText = card.description;
        content_card.appendChild(card_desc);
    }

    if (card.id != "0") {
        content_card.addEventListener("click", function () { projectNavigation(card.id) });
    }

    return content_card;
}

//  Loads the JSON file of a main page and returns the card data, or null for a failed request.
function loadPageJSON(page) {
    var loadRequest = new XMLHttpRequest();
    loadRequest.open("GET", window.location.origin + "/files/page-JSON/" + page + ".JSON", false);
    loadRequest.send();
    if (loadRequest.status != 200 || !loadRequest.response) {
        return null;
    }
    var pageJSON = JSON.parse(loadRequest.response);
    return pageJSON;
}

//  Loads the JSON file of a project page and returns the card data, or null for a failed request.
function loadProjectJSON(page) {
    var loadRequest = new XMLHttpRequest();
    loadRequest.open("GET", window.location.origin + "/files/project-JSON/" + page + ".JSON", false);
    loadRequest.send();
    if (loadRequest.status != 200 || !loadRequest.response) {
        return null;
    }
    var pageJSON = JSON.parse(loadRequest.response);
    return pageJSON;
}

//  Override navigation when the back or forward button is used
window.addEventListener("popstate", (e) => {
    //  TODO: Test this feature and ensure it works as intended.
    //  Note: This feature only works to go back once, and disables the forward button.
    if (e.state) {
        contentNavigation(e.state);
    }
});

//  Loads the header HTML into the page's header div element.
function loadHeader(header) {
    var loadRequest = new XMLHttpRequest();
    loadRequest.open("GET", window.location.origin + "/files/body-pages/header.html", false);
    loadRequest.send();

    // This is not an ideal solution; it simply copies the html file text and pastes it into header's innerhtml
    header.innerHTML = loadRequest.response;
}

/*  Loads the progress bar + card-container HTML into the page-body element.
*   Adds a listener to the container to set the progress bar to the scroll height percentage.   */
function loadCardContainer(body) {
    var loadRequest = new XMLHttpRequest();
    loadRequest.open("GET", window.location.origin + "/files/body-pages/card-holder.html", false);
    loadRequest.send();

    // This is not an ideal solution; it simply copies the html file text and pastes it into the body's innerhtml
    body.innerHTML = loadRequest.response;

    progress_bar = document.getElementById("card-container-progress-bar");

    // Set the progress bar width to the scroll percentage
    document.getElementById("content-card-container").addEventListener("scroll", function (e) {
        progress_bar.style.width = ((e.target.scrollTop / (e.target.scrollHeight - e.target.offsetHeight)) * 100).toString() + "%";
    });
}

//  Loads the footer HTML into the page's footer div element.
function loadFooter(footer) {
    var loadRequest = new XMLHttpRequest();
    loadRequest.open("GET", window.location.origin + "/files/body-pages/footer.html", false);
    loadRequest.send();

    // This is not an ideal solution; it simply copies the html file text and pastes it into footer's innerhtml
    footer.innerHTML = loadRequest.response;
}

//  Loads all common elements in a page (Header, Card-Container, Footer).
function loadCommonElements() {
    loadHeader(document.getElementById("page-header"));
    loadCardContainer(document.getElementById("page-body"));
    loadFooter(document.getElementById("page-footer"));
}
