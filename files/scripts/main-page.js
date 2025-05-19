// Preload page data (?)

function internalNavigation(page) {
    // Change the URL without navigating
    window.history.pushState(page, "", "/" + page);
    loadContent(page);
}

function contentNavigation(page) {
    changeActiveNavButton(page);
    internalNavigation(page);
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
    var loadRequest = new XMLHttpRequest();
    loadRequest.open("GET", window.location.origin + "/files/body-pages/" + page + ".html", false);
    loadRequest.send();
    // This is not an ideal solution; it simply copies the html file text and pastes it into page-body's innerhtml
    document.getElementById("page-body").innerHTML = loadRequest.response;
}

// Navigate when the back or forward button is used
window.addEventListener("popstate", (e) => {
    if (e.state) {
        contentNavigation(e.state);
    }
});
