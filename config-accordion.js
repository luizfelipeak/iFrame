const plainsAccordion = document.getElementById("plains");
const plainsContent = document.getElementById("plains-content");
const vallisAccordion = document.getElementById("vallis");
const vallisContent = document.getElementById("vallis-content");
const cambionAccordion = document.getElementById("cambion");
const cambionContent = document.getElementById("cambion-content");

const svgOpenPlains = document.getElementsByClassName("svg-open")[0];
const svgOpenVallis = document.getElementsByClassName("svg-open")[1];
const svgOpenCambion = document.getElementsByClassName("svg-open")[2];

const svgClosePlains = document.getElementsByClassName("svg-close")[0];
const svgCloseVallis = document.getElementsByClassName("svg-close")[1];
const svgCloseCambion = document.getElementsByClassName("svg-close")[2];

plainsAccordion.addEventListener("click", () => {
    if(plainsAccordion.getAttribute("aria-expanded") === "true") {
        svgOpenPlains.style.display = "initial";
        svgClosePlains.style.display = "none";
        plainsAccordion.setAttribute("aria-expanded", "false");
    }
    else {
        svgOpenPlains.style.display = "none";
        svgClosePlains.style.display = "initial";
        plainsAccordion.setAttribute("aria-expanded", "true");
    }
});

vallisAccordion.addEventListener("click", () => {
    if(vallisAccordion.getAttribute("aria-expanded") == "true") {
        svgOpenVallis.style.display = "initial";
        svgCloseVallis.style.display = "none";
        vallisAccordion.setAttribute("aria-expanded", "false");
    }
    else {
        svgOpenVallis.style.display = "none";
        svgCloseVallis.style.display = "initial";
        vallisAccordion.setAttribute("aria-expanded", "true");
    }
});

cambionAccordion.addEventListener("click", () => {
    if(cambionAccordion.getAttribute("aria-expanded") === "true") {
        svgOpenCambion.style.display = "initial";
        svgCloseCambion.style.display = "none";
        cambionAccordion.setAttribute("aria-expanded", "false");
    }
    else {
        svgOpenCambion.style.display = "none";
        svgCloseCambion.style.display = "initial";
        cambionAccordion.setAttribute("aria-expanded", "true");
    }
});