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
    plainsContent.classList.toggle("open");
    
    if(plainsContent.classList.contains("open")) {
        svgOpenPlains.style.display = "none";
        svgClosePlains.style.display = "initial";
    }
    else {
        svgOpenPlains.style.display = "initial";
        svgClosePlains.style.display = "none";
    }
});

vallisAccordion.addEventListener("click", () => {
    vallisContent.classList.toggle("open");

    if(vallisContent.classList.contains("open")) {
        svgOpenVallis.style.display = "none";
        svgCloseVallis.style.display = "initial";
    }
    else {
        svgOpenVallis.style.display = "initial";
        svgCloseVallis.style.display = "none";
    }
});

cambionAccordion.addEventListener("click", () => {
    cambionContent.classList.toggle("open");

    if(cambionContent.classList.contains("open")) {
        svgOpenCambion.style.display = "none";
        svgCloseCambion.style.display = "initial";
    }
    else {
        svgOpenCambion.style.display = "initial";
        svgCloseCambion.style.display = "none";
    }
});