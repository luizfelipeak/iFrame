// ------------ Navbar functions ------------
    // ------------ Navbar variables ------------
        const navButton = document.getElementById("nav-btn");
        const modalNav = document.getElementById("modal-nav");
        const closeModal = document.getElementById("close-modal");
        let isOpened;
    // ------------------------------------------

    navButton.addEventListener("click", () => {
        navButton.setAttribute("aria-expanded", "true");
        modalNav.setAttribute("data-state", "opened");
    });

    closeModal.addEventListener("click", () => {
        navButton.setAttribute("aria-expanded", "false");
        modalNav.setAttribute("data-state", "closed");
    });
// ------------------------------------------