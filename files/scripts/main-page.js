// Preload page data (?)

function initialFullLoad(page) {
    loadCommonElements();
    contentNavigation(page);   
}

function contentNavigation(page) {
    changeActiveNavButton(page);
    window.history.pushState(page, "", "/" + page);
    loadContent(page);
}

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

function loadContent(page) {
    var pageJSON = loadPageJSON(page);
    var loadRequest = new XMLHttpRequest();
    loadRequest.open("GET", window.location.origin + "/files/body-pages/" + page + ".html", false);
    loadRequest.send();
    // This is not an ideal solution; it simply copies the html file text and pastes it into page-body's innerhtml
    document.getElementById("page-body").innerHTML = loadRequest.response;

    var cardHolder = document.getElementsByClassName("content-card-container")[0];

    if (cardHolder) {
        pageJSON = pageJSON.cards;
        for (card in pageJSON) {
            cardHolder.appendChild(createCard(pageJSON[card]));
        }
    }
}

function createCard(card) {
    var content_card = document.createElement("div");
    content_card.classList.add("content-card");
    if (card.image_src) {
        card_img = document.createElement("img");
        card_img.src = window.location.origin + "/files/images/" + card.image_src;
        content_card.appendChild(card_img);
    }
    if (card.description) {
        card_desc = document.createElement("p");
        card_desc.innerText = card.description;
        content_card.appendChild(card_desc);
    }

    return content_card;
}

function loadPageJSON(page) {
    var loadRequest = new XMLHttpRequest();
    loadRequest.open("GET", window.location.origin + "/files/JSON/" + page + ".JSON", false);
    loadRequest.send();
    if (loadRequest.status != 200 || !loadRequest.response) {
        return;
    }
    var pageJSON = JSON.parse(loadRequest.response);
    return pageJSON;
}

// Navigate when the back or forward button is used
window.addEventListener("popstate", (e) => {
    if (e.state) {
        contentNavigation(e.state);
    }
});

function loadHeader(header) {
    var loadRequest = new XMLHttpRequest();
    loadRequest.open("GET", window.location.origin + "/files/body-pages/header.html", false);
    loadRequest.send();
    // This is not an ideal solution; it simply copies the html file text and pastes it into header's innerhtml
    header.innerHTML = loadRequest.response;
}

function loadFooter(footer) {
    var loadRequest = new XMLHttpRequest();
    loadRequest.open("GET", window.location.origin + "/files/body-pages/footer.html", false);
    loadRequest.send();
    // This is not an ideal solution; it simply copies the html file text and pastes it into footer's innerhtml
    footer.innerHTML = loadRequest.response;
}

function loadCommonElements() {
    loadHeader(document.getElementById("page-header"));
    loadFooter(document.getElementById("page-footer"));
}
