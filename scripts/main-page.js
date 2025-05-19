// Preload page data (?)

function internalNavigation(page) {
    console.log(window.location.pathname);
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

