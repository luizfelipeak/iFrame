// ---------- Fetch data from the API ----------
let url = "https://api.warframestat.us/pc/en";
const earthTime = document.getElementById("earth-time");
const plainsTime = document.getElementById("plains-time");
const vallisTime = document.getElementById("vallis-time");
const cambionTime = document.getElementById("cambion-time");

// ----- Web Worker -----
let earthWebWorker = undefined;
let plainsofEidolonWebWorker = undefined;
let orbofVallisWebWorker = undefined;
let cambionDriftWebWorker = undefined;

let alertWebWorker = undefined;
let fissureWebWorker = undefined;

// ----- Event -----
const events = document.getElementById("events");

// ----- Sortie -----
const sortieInfo = document.getElementById("sortie-info");
const sortiePt1 = document.getElementById("sortie-pt1");
const sortiePt2 = document.getElementById("sortie-pt2");
const sortiePt3 = document.getElementById("sortie-pt3");

// ----- Archon hunt -----
const archonInfo = document.getElementById("archon-info");
const archonPt1 = document.getElementById("archon-pt1");
const archonPt2 = document.getElementById("archon-pt2");
const archonPt3 = document.getElementById("archon-pt3");

// ----- Alert -----
const alerts = document.getElementById("alerts");

// ----- Fissure -----
const fissures = document.getElementById("fissures");
const filters = fissures.children;
const lithBtn = document.getElementById("lith-btn");
const mesoBtn = document.getElementById("meso-btn");
const neoBtn = document.getElementById("neo-btn");
const axiBtn = document.getElementById("axi-btn");
const requiemBtn = document.getElementById("requiem-btn");
const fissureBtn = document.getElementById("fissure-btn");
const voidstormBtn = document.getElementById("voidstorm-btn");
const normalBtn = document.getElementById("normal-btn");
const steelpathBtn = document.getElementById("steelpath-btn");
let activeFissure = "lith", activeType = "fissure", activeDifficulty = "normal";

// ---------------- Alert message ----------------
const alert = document.getElementById("alert");
const alertText = document.getElementById("alert-text");
const closeAlert = document.getElementById("close-alert");

closeAlert.addEventListener("click", () => {
    alert.classList.remove("show");
});

// ---------- Connecting to data server ----------
connectAPI(url);

// ----------- Update API data every 10 minutes -----------
setInterval(() => {
    earthWebWorker.terminate();
    earthWebWorker = undefined;

    plainsofEidolonWebWorker.terminate();
    plainsofEidolonWebWorker = undefined;
    
    orbofVallisWebWorker.terminate();
    orbofVallisWebWorker = undefined;

    cambionDriftWebWorker.terminate();
    cambionDriftWebWorker = undefined;

    if(typeof(alertWebWorker) != "undefined") {
        alertWebWorker.terminate();
        alertWebWorker = undefined;
    }
    
    fissureWebWorker.terminate();
    fissureWebWorker = undefined;
    connectAPI(url);
}, 600000);

async function connectAPI(url) {
    // ----- API -----
    let connection, internet = navigator.onLine;
    
    if(internet) {
        connection = await fetch(url).then(result => {
            if(result.ok) {
                result.json().then(data => {
                    createWebWorkers(data);
                    insertingAlertsData(data.alerts);
                    insertingVoidFissuresData(data.fissures);
                    insertingEventsData(data.events);
                    insertingSortieData(data.sortie);
                    insertingArchonHuntData(data.archonHunt);
                });
            }
            else {
                alertText.innerHTML = "Problem has occurred.";
                alert.classList.add("show");
            }
        });
    }
    else {
        alertText.innerHTML = "Verify your internet connection.";
        alert.classList.add("show");
    }
}

// ---------- Displaying cycles data ----------
function createWebWorkers(data) {
    // ----- Initializing Earth web worker -----
    if(typeof(earthWebWorker) == "undefined") {
        earthWebWorker = new Worker("webworker/time_Earth_worker.js");
    }

    earthWebWorker.onmessage = function(response) {
        if(response.data instanceof Array)
            earthTime.innerHTML = response.data[0];
        else
            earthTime.innerHTML = response.data;
    };

    earthTime.classList.remove('skeleton-text');

    // ----- Initializing Plains of Eidolon web worker -----
    if(typeof(plainsofEidolonWebWorker) == "undefined") {
        plainsofEidolonWebWorker = new Worker("webworker/time_PlainsofEidolon_worker.js");
    }

    plainsofEidolonWebWorker.onmessage = function(response) {
        if(response.data instanceof Array)
            plainsTime.innerHTML = response.data[0];
        else
            plainsTime.innerHTML = response.data;
    };

    plainsTime.classList.remove('skeleton-text');

    // ----- Initializing Orb Vallis web worker -----
    if(typeof(orbofVallisWebWorker) == "undefined") {
        orbofVallisWebWorker = new Worker("webworker/time_OrbVallis_worker.js");
    }

    orbofVallisWebWorker.onmessage = function(response) {
        if(response.data instanceof Array)
            vallisTime.innerHTML = response.data[0];
        else
            vallisTime.innerHTML = response.data;
    };

    vallisTime.classList.remove('skeleton-text');

    // ----- Initializing Cambion Drift web worker -----
    if(typeof(cambionDriftWebWorker) == "undefined") {
        cambionDriftWebWorker = new Worker("webworker/time_CambionDrift_worker.js");
    }

    cambionDriftWebWorker.onmessage = function(response) {
        if(response.data instanceof Array)
            cambionTime.innerHTML = response.data[0];
        else
            cambionTime.innerHTML = response.data;
    };

    cambionTime.classList.remove('skeleton-text');

    earthWebWorker.postMessage(data.earthCycle);
    plainsofEidolonWebWorker.postMessage(data.cetusCycle);
    orbofVallisWebWorker.postMessage(data.vallisCycle);
    cambionDriftWebWorker.postMessage(data.cambionCycle);
}

// ---------- Displaying alerts data ----------
function insertingAlertsData(data) {
    const container = [];
    let title, description, i = 0, activeCounter = 0, expiry, now, sec, min, hour, day;

    alerts.replaceChildren();

    // ----- Initializing alerts web worker -----
    if(typeof(alertWebWorker) == "undefined") {
        alertWebWorker = new Worker("webworker/alerts_worker.js");
    }

    // --------------- Insert title and counter of alerts ---------------
    data.forEach(item => {
        if(item.active) {
            activeCounter++;
            container.push(document.createElement("div"));
            container[i].classList.add("container");
            title = document.createElement("h3");
            title.textContent = `${item.mission.node} - ${item.mission.type} - ${item.mission.reward.asString}`;
            alerts.appendChild(container[i]);
            container[i].appendChild(title);
            description = document.createElement("p");
            expiry = new Date(item.expiry);
            now = new Date();
            sec = Math.floor((expiry - now) / 1000);
            min = Math.floor(sec / 60);
            hour = Math.floor(min / 60);
            day = Math.floor(hour / 24);

            sec = sec % 60;
            min = min % 60;
            hour = hour % 24;
            description.textContent = `${day}day(s):${hour}h:${min}m:${sec}s`;
            container[i].appendChild(description);
            alerts.classList.remove("skeleton-text");
            i++;
        }
    });

    // --------------- Updating the countdown of alerts ---------------
    alertWebWorker.onmessage = function(response) {
        i = 0;
        response.data.forEach((item) => {
            container[i].children[1].textContent = item.time;
            i++;
        });
    }

    alertWebWorker.postMessage(data);

    // --------------- Verify if there's data or active alerts ---------------
    if(data.length === 0 || activeCounter === 0) {
        container.push(document.createElement("div"));
        container[0].classList.add("container");
        alerts.appendChild(container[0]);
        description = document.createElement("p");
        description.innerHTML = "No active event at the moment.";
        container[0].appendChild(description);
        alerts.classList.remove("skeleton-text");
        alertWebWorker.terminate();
        alertWebWorker = undefined;
    }
}

// ---------- Displaying void fissures data ----------
function insertingVoidFissuresData(data) {
    const container = [];
    let title, description, i = 0, expiry, now, sec, min, hour, day;

    fissures.replaceChildren();

    // ----- Initializing fissures web worker -----
    if(typeof(fissureWebWorker) == "undefined") {
        fissureWebWorker = new Worker("webworker/void_fissures_worker.js");
    }

    // --------------- Insert title and counter of fissures ---------------
    data.forEach(item => {
        if(item.active) {
            container.push(document.createElement("div"));
            container[i].classList.add("container");
            container[i].classList.add(item.tier.toLowerCase());
            if(item.isStorm)
                container[i].classList.add("voidstorm");
            else
                container[i].classList.add("fissure");
            if(item.isHard)
                container[i].classList.add("steelpath");
            else
                container[i].classList.add("normal");
            title = document.createElement("h3");
            title.textContent = `${item.node} - ${item.missionType} - ${item.tier}`;
            fissures.appendChild(container[i]);
            container[i].appendChild(title);
            description = document.createElement("p");
            expiry = new Date(item.expiry);
            now = new Date();
            sec = Math.floor((expiry - now) / 1000);
            min = Math.floor(sec / 60);
            hour = Math.floor(min / 60);
            day = Math.floor(hour / 24);

            sec = sec % 60;
            min = min % 60;
            hour = hour % 24;
            if(hour <= 0 && min <= 0 && sec <= 0)
                description.textContent = "Expired.";
            else
                description.textContent = `${hour}h:${min}m:${sec}s`;
            container[i].appendChild(description);
            fissures.classList.remove("skeleton-text");
            i++;
        }
    });

    filter();

    // ------------- Updating the countdown of fissures -------------
    fissureWebWorker.onmessage = function(response) {
        i = 0;
        response.data.forEach(item => {
            container[i].children[1].textContent = item.time;
            i++;
        });
    }

    fissureWebWorker.postMessage(data);
}

// ---------- Lith button event ----------
lithBtn.addEventListener("click", () => {
    activeFissure = "lith";
    lithBtn.classList.add("active");
    lithBtn.disabled = "true";

    mesoBtn.classList.remove("active");
    mesoBtn.disabled = "";
    
    neoBtn.classList.remove("active");
    neoBtn.disabled = "";
    
    axiBtn.classList.remove("active");
    axiBtn.disabled = "";

    requiemBtn.classList.remove("active");
    requiemBtn.disabled = "";

    voidstormBtn.classList.remove("disabled");
    voidstormBtn.disabled = "";
    filter();
});

// ---------- Meso button event ----------
mesoBtn.addEventListener("click", () => {
    activeFissure = "meso";
    lithBtn.classList.remove("active");
    lithBtn.disabled = "";
    
    mesoBtn.classList.add("active");
    mesoBtn.disabled = "true";
    
    neoBtn.classList.remove("active");
    neoBtn.disabled = "";
    
    axiBtn.classList.remove("active");
    axiBtn.disabled = "";

    requiemBtn.classList.remove("active");
    requiemBtn.disabled = "";

    voidstormBtn.classList.remove("disabled");
    voidstormBtn.disabled = "";
    filter();
});

// ---------- Neo button event ----------
neoBtn.addEventListener("click", () => {
    activeFissure = "neo";
    lithBtn.classList.remove("active");
    lithBtn.disabled = "";

    mesoBtn.classList.remove("active");
    mesoBtn.disabled = "";

    neoBtn.classList.add("active");
    neoBtn.disabled = "true";

    axiBtn.classList.remove("active");
    axiBtn.disabled = "";

    requiemBtn.classList.remove("active");
    requiemBtn.disabled = "";

    voidstormBtn.classList.remove("disabled");
    voidstormBtn.disabled = "";
    filter();
});

// ---------- Axi button event ----------
axiBtn.addEventListener("click", () => {
    activeFissure = "axi";
    lithBtn.classList.remove("active");
    lithBtn.disabled = "";
    
    mesoBtn.classList.remove("active");
    mesoBtn.disabled = "";

    neoBtn.classList.remove("active");
    neoBtn.disabled = "";

    axiBtn.classList.add("active");
    axiBtn.disabled = "true";

    requiemBtn.classList.remove("active");
    requiemBtn.disabled = "";

    voidstormBtn.classList.remove("disabled");
    voidstormBtn.disabled = "";
    filter();
});

// ---------- Requiem button event ----------
requiemBtn.addEventListener("click", () => {
    activeFissure = "requiem";
    activeType = "fissure";
    lithBtn.classList.remove("active");
    lithBtn.disabled = "";
    
    mesoBtn.classList.remove("active");
    mesoBtn.disabled = "";

    neoBtn.classList.remove("active");
    neoBtn.disabled = "";

    axiBtn.classList.remove("active");
    axiBtn.disabled = "";

    requiemBtn.classList.add("active");
    requiemBtn.disabled = "true";

    voidstormBtn.classList.add("disabled");
    voidstormBtn.classList.remove("active");
    voidstormBtn.disabled = "true";
    fissureBtn.classList.add("active");
    steelpathBtn.classList.remove("disabled");
    steelpathBtn.disabled = "";
    filter();
});

// ---------- Fissure button event ----------
fissureBtn.addEventListener("click", () => {
    activeType = "fissure";
    fissureBtn.classList.add("active");
    fissureBtn.disabled = "true";
    
    voidstormBtn.classList.remove("active");
    voidstormBtn.disabled = "";

    normalBtn.disabled = "";
    steelpathBtn.classList.remove("disabled");
    steelpathBtn.disabled = "";

    filter();
});

// ---------- Voidstorm button event ----------
voidstormBtn.addEventListener("click", () => {
    activeType = "voidstorm";
    activeDifficulty = "normal";
    fissureBtn.classList.remove("active");
    fissureBtn.disabled = "";
    
    voidstormBtn.classList.add("active");
    voidstormBtn.disabled = "true";

    steelpathBtn.classList.add("disabled");
    steelpathBtn.classList.remove("active");
    steelpathBtn.disabled = "true";

    normalBtn.classList.add("active");
    normalBtn.disabled = "true";

    filter();
});

// ---------- Normal button event ----------
normalBtn.addEventListener("click", () => {
    activeDifficulty = "normal";
    normalBtn.classList.add("active");
    normalBtn.disabled = "true";

    steelpathBtn.classList.remove("active");
    steelpathBtn.disabled = ""
    
    filter();
});

// ---------- Steelpath button event ----------
steelpathBtn.addEventListener("click", () => {
    activeDifficulty = "steelpath";
    normalBtn.classList.remove("active");
    normalBtn.disabled = "";

    steelpathBtn.classList.add("active");
    steelpathBtn.disabled = "true";
    
    filter();
});

// -------------- Filtering through all options --------------
function filter() {
    [].forEach.call(filters, (item) => {
        if(activeFissure === item.classList[1]) {
            if(activeType === item.classList[2]) {
                if(activeDifficulty === item.classList[3]) {
                    item.style.display = "initial";
                }
                else {
                    item.style.display = "none";
                }
            }
            else {
                item.style.display = "none";
            }
        }
        else {
            item.style.display = "none";
        }
    });
}

// ---------- Displaying events data ----------
function insertingEventsData(data) {
    const dateNow = new Date();
    let expire = undefined, container, title, description, activeCounter = 0;

    events.replaceChildren();

    data.forEach(item => {
        if(item.active) {
            events.classList.remove("skeleton-text");
            activeCounter++;
            expire = Math.floor((new Date(item.expiry) - dateNow) / (1000 * 3600 * 24));
            
            title = document.createElement("h3");
            title.textContent = `${item.description}`;
            description = document.createElement("p");
            if(expire > 0)
                description.textContent = `Event ends in ${expire} day(s).`;
            else
                description.textContent = "Event ends today!";
            container = document.createElement("div");
            container.classList.add("container");
            events.appendChild(container);
            container.appendChild(title);
            container.appendChild(description);
        }
    });

    if(data.length === 0 || activeCounter === 0) {
        container = document.createElement("div");
        container.classList.add("container");
        events.appendChild(container);
        description = document.createElement("p");
        description.innerHTML = "No active event at the moment.";
        container.appendChild(description);
        events.classList.remove("skeleton-text");
    }
}

// ---------- Displaying sortie data ----------
function insertingSortieData(data) {
    const date = new Date();

    sortieInfo.innerHTML = `Resets in: ${Math.floor((new Date(data.expiry) - date) / (1000 * 3600))}h.`;
    sortiePt1.innerHTML = `<b>Part 1</b>: ${data.variants[0].missionType} - ${data.variants[0].node} - ${data.variants[0].modifier}`;
    sortiePt2.innerHTML = `<b>Part 2</b>: ${data.variants[1].missionType} - ${data.variants[1].node} - ${data.variants[1].modifier}`;
    sortiePt3.innerHTML = `<b>Part 3</b>: ${data.variants[2].missionType} - ${data.variants[2].node} - ${data.variants[2].modifier}`;

    sortieInfo.classList.remove("skeleton-text");
    sortiePt1.classList.remove("skeleton-text");
    sortiePt2.classList.remove("skeleton-text");
    sortiePt3.classList.remove("skeleton-text");
}

// ---------- Displaying archon hunt data ----------
function insertingArchonHuntData(data) {
    const dateNow = new Date();
    const day = Math.floor((new Date(data.expiry) - dateNow) / (1000 * 3600 * 24)),
          hour = Math.floor((new Date(data.expiry) - dateNow) / (1000 * 3600)) % 24;

    archonInfo.innerHTML = `Resets in: ${day}day(s) ${hour}h - Boss: ${data.boss}.`;
    archonPt1.innerHTML = `<b>Part 1</b>: ${data.missions[0].type} - ${data.missions[0].node}`;
    archonPt2.innerHTML = `<b>Part 2</b>: ${data.missions[1].type} - ${data.missions[1].node}`;
    archonPt3.innerHTML = `<b>Part 3</b>: ${data.missions[2].type} - ${data.missions[2].node}`;

    archonInfo.classList.remove("skeleton-text");
    archonPt1.classList.remove("skeleton-text");
    archonPt2.classList.remove("skeleton-text");
    archonPt3.classList.remove("skeleton-text");
}