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
    // ----------------------

    // ----- Temporary components -----
        const skeletonImg = Array.from(document.getElementsByClassName("skeleton"));
        const earthDay = document.getElementById("svg-earth-day");
        const earthNight = document.getElementById("svg-earth-night");
        const poeDay = document.getElementById("svg-poe-day");
        const poeNight = document.getElementById("svg-poe-night");
        const vallisWarm = document.getElementById("svg-vallis-warm");
        const vallisCold = document.getElementById("svg-vallis-cold");
        const cambionFass = document.getElementById("cambion-fass");
        const cambionVome = document.getElementById("cambion-vome");
    // --------------------------------

    // ----- events -----
        const events = document.getElementById("events");
        const eventContainer = document.getElementById("event-container");
        const firstEvent = document.getElementById("first-event");
    // ------------------

    // ----- Sortie -----
        const sortieInfo = document.getElementById("sortie-info");
        const sortiePt1 = document.getElementById("sortie-pt1");
        const sortiePt2 = document.getElementById("sortie-pt2");
        const sortiePt3 = document.getElementById("sortie-pt3");
    // ------------------

    // ----- Archon hunt -----
        const archonInfo = document.getElementById("archon-info");
        const archonPt1 = document.getElementById("archon-pt1");
        const archonPt2 = document.getElementById("archon-pt2");
        const archonPt3 = document.getElementById("archon-pt3");
    // -----------------------

    // ----- Alerts -----
        const alerts = document.getElementById("alerts");
        const alertContainer = document.getElementById("alert-container");
        const firstAlert = document.getElementById("first-alert");
        let alertLoopVerification = false;
    // ------------------

    // ----- Fissure -----
        const fissures = document.getElementById("fissures");
        const fissureContainer = document.getElementById("fissure-container");
        const firstFissure = document.getElementById("first-fissure");
        let fissureLoopVerification = false;
        const filters = fissures.children;
        const lithBtn = document.getElementById("lithBtn");
        const mesoBtn = document.getElementById("mesoBtn");
        const neoBtn = document.getElementById("neoBtn");
        const axiBtn = document.getElementById("axiBtn");
        const fissureBtn = document.getElementById("fissureBtn");
        const voidstormBtn = document.getElementById("voidstormBtn");
    // -------------------

    connectAPI(url);

    async function connectAPI(url) {
        // ----- API -----
            let connection = await fetch(url);
            let data = await connection.json();
        // ---------------

        // ----- Checking the day for svg -----
            if(data.earthCycle.isDay === true) {
                earthDay.style.display = 'initial';
                earthNight.style.display = 'none';
            }
            else {
                earthDay.style.display = 'none';
                earthNight.style.display = 'initial';
            }

            if(data.cetusCycle.isDay === true) {
                poeDay.style.display = 'initial';
                poeNight.style.display = 'none';
            }
            else {
                poeDay.style.display = 'none';
                poeNight.style.display = 'initial';
            }

            if(data.vallisCycle.isWarm === true) {
                vallisWarm.style.display = 'initial';
                vallisCold.style.display = 'none';
            }
            else {
                vallisWarm.style.display = 'none';
                vallisCold.style.display = 'initial';
            }

            if(data.cambionCycle.active === 'fass') {
                cambionFass.style.display = 'initial';
                cambionVome.style.display = 'none';
            }
            else {
                cambionFass.style.display = 'none';
                cambionVome.style.display = 'initial';
            }

            skeletonImg.forEach(item => {
                item.style.display = 'none';
            });
        // ------------------------------------

        createWebWorkers(data);
        insertingEventsData(data.events);
        insertingSortieData(data.sortie);
        insertingArchonHuntData(data.archonHunt);
        insertingAlertsData(data.alerts);
        insertingVoidFissuresData(data.fissures);
    }

    function createWebWorkers(data) {
        // ----- Initializing Earth web worker -----
            if(typeof(earthWebWorker) == "undefined") {
              earthWebWorker = new Worker("webworker/time_Earth_worker.js");
            }

            earthWebWorker.onmessage = function(response) {
                if(response.data instanceof Array) {
                    earthTime.innerHTML = response.data[0];
                    
                    if(response.data[1] === 'day') {
                        earthDay.style.display = 'initial';
                        earthNight.style.display = 'none';
                    }
                    else {
                        earthDay.style.display = 'none';
                        earthNight.style.display = 'initial';
                    }
                }
                else
                    earthTime.innerHTML = response.data;
            };

            const earthEvent = () => {
                earthTime.classList.remove('skeleton-text');
                earthWebWorker.removeEventListener('message', earthEvent);
            };

            earthWebWorker.addEventListener('message', earthEvent);
        // -----------------------------------------

        // ----- Initializing Plains of Eidolon web worker -----
            if(typeof(plainsofEidolonWebWorker) == "undefined") {
              plainsofEidolonWebWorker = new Worker("webworker/time_PlainsofEidolon_worker.js");
            }

            plainsofEidolonWebWorker.onmessage = function(response) {
                if(response.data instanceof Array) {
                    plainsTime.innerHTML = response.data[0];

                    if(response.data[1] === 'day') {
                        poeDay.style.display = 'initial';
                        poeNight.style.display = 'none';
                    }
                    else {
                        poeDay.style.display = 'none';
                        poeNight.style.display = 'initial';
                    }
                }
                else
                    plainsTime.innerHTML = response.data;
            };

            const plainsEvent = () => {
                plainsTime.classList.remove('skeleton-text');
                plainsofEidolonWebWorker.removeEventListener('message', plainsEvent);
            };

            plainsofEidolonWebWorker.addEventListener('message', plainsEvent);
        // -----------------------------------------------------

        // ----- Initializing Orb Vallis web worker -----
            if(typeof(orbofVallisWebWorker) == "undefined") {
              orbofVallisWebWorker = new Worker("webworker/time_OrbVallis_worker.js");
            }

            orbofVallisWebWorker.onmessage = function(response) {
                if(response.data instanceof Array) {
                    vallisTime.innerHTML = response.data[0];

                    if(response.data[1] === 'warm') {
                        vallisWarm.style.display = 'initial';
                        vallisCold.style.display = 'none';
                    }
                    else {
                        vallisWarm.style.display = 'none';
                        vallisCold.style.display = 'initial';
                    }
                }
                else
                    vallisTime.innerHTML = response.data;
            };

            const vallisEvent = () => {
                vallisTime.classList.remove('skeleton-text');
                orbofVallisWebWorker.removeEventListener('message', vallisEvent);
            };

            orbofVallisWebWorker.addEventListener('message', vallisEvent);
        // -------------------------------------------------

        // ----- Initializing Cambion Drift web worker -----
            if(typeof(cambionDriftWebWorker) == "undefined") {
              cambionDriftWebWorker = new Worker("webworker/time_CambionDrift_worker.js");
            }

            cambionDriftWebWorker.onmessage = function(response) {
                if(response.data instanceof Array) {
                    cambionTime.innerHTML = response.data[0];

                    if(response.data[1] === 'fass') {
                        cambionFass.style.display = 'initial';
                        cambionVome.style.display = 'none';
                    }
                    else {
                        cambionFass.style.display = 'none';
                        cambionVome.style.display = 'initial';
                    }
                }
                else
                    cambionTime.innerHTML = response.data;
            };

            const cambionEvent = () => {
                cambionTime.classList.remove('skeleton-text');
                cambionDriftWebWorker.removeEventListener('message', cambionEvent);
            };

            cambionDriftWebWorker.addEventListener('message', cambionEvent);
        // -------------------------------------------------

        earthWebWorker.postMessage(data.earthCycle);
        plainsofEidolonWebWorker.postMessage(data.cetusCycle);
        orbofVallisWebWorker.postMessage(data.vallisCycle);
        cambionDriftWebWorker.postMessage(data.cambionCycle);
    }

    function insertingEventsData(data) {
        const additionalContainer = [],
              eventName = [],
              eventInfo = [],
              dateNow = new Date();
        let expire = undefined;

        if(data.length === 0) {
            firstEvent.textContent = "No active event at the moment.";
            firstEvent.classList.remove("skeleton-text");
            return;
        }

        data.forEach((item, index) => {
            if(item.active === true) {
                expire = Math.floor((new Date(item.expiry) - dateNow) / (1000 * 3600 * 24));

                if(index === 0) {
                    eventName[index] = document.createElement("h3");
                    eventName[index].textContent = `${item.description}`;
                    eventContainer.appendChild(eventName[index]);

                    firstEvent.classList.remove("skeleton-text");
                    eventInfo[index] = firstEvent;
                    if(expire > 0)
                        eventInfo[index].textContent = `Event ends in ${expire} days.`;
                    else if(expire === 0)
                        eventInfo[index].textContent = `Event ends today!`;
                    eventContainer.appendChild(eventInfo[index]);
                } else {
                    additionalContainer[index] = document.createElement("div");
                    additionalContainer[index].classList.add("container");
                    events.appendChild(additionalContainer[index]);

                    eventName[index] = document.createElement("h3");
                    eventName[index].textContent = `${item.description}`;
                    additionalContainer[index].appendChild(eventName[index]);

                    eventInfo[index] = document.createElement("p");
                    if(expire > 0)
                        eventInfo[index].textContent = `Event ends in ${expire} days.`;
                    else if(expire === 0)
                        eventInfo[index].textContent = `Event ends today!`;
                    additionalContainer[index].appendChild(eventInfo[index]);
                }
            }
        });
    }

    function insertingSortieData(data) {
        const date = new Date();

        sortieInfo.innerHTML = `Resets in: ${Math.floor((new Date(data.expiry) - date) / (1000 * 3600))}h.`;
        sortiePt1.innerHTML = `<b>Part1</b>: ${data.variants[0].missionType} - ${data.variants[0].node} - ${data.variants[0].modifier}`;
        sortiePt2.innerHTML = `<b>Part2</b>: ${data.variants[1].missionType} - ${data.variants[1].node} - ${data.variants[1].modifier}`;
        sortiePt3.innerHTML = `<b>Part3</b>: ${data.variants[2].missionType} - ${data.variants[2].node} - ${data.variants[2].modifier}`;

        sortieInfo.classList.remove("skeleton-text");
        sortiePt1.classList.remove("skeleton-text");
        sortiePt2.classList.remove("skeleton-text");
        sortiePt3.classList.remove("skeleton-text");
    }

    function insertingArchonHuntData(data) {
        const dateNow = new Date();
        const day = Math.floor((new Date(data.expiry) - dateNow) / (1000 * 3600 * 24)),
              hour = Math.floor((new Date(data.expiry) - dateNow) / (1000 * 3600)) % 24;

        archonInfo.innerHTML = `Resets in: ${day}day(s) ${hour}h - Boss: ${data.boss}.`;
        archonPt1.innerHTML = `<b>Part1</b>: ${data.missions[0].type} - ${data.missions[0].node}`;
        archonPt2.innerHTML = `<b>Part2</b>: ${data.missions[1].type} - ${data.missions[1].node}`;
        archonPt3.innerHTML = `<b>Part3</b>: ${data.missions[2].type} - ${data.missions[2].node}`;

        archonInfo.classList.remove("skeleton-text");
        archonPt1.classList.remove("skeleton-text");
        archonPt2.classList.remove("skeleton-text");
        archonPt3.classList.remove("skeleton-text");
    }

    function insertingAlertsData(data) {
        // ----- Initializing alerts web worker -----
            if(typeof(alertWebWorker) == "undefined") {
              alertWebWorker = new Worker("webworker/alerts_worker.js");
            }

            alertWebWorker.onmessage = function(response) {
                const additionalContainer = [], alertName = [], dateNow = new Date();
                let alertInfo = [];

                if(response.data.length === 0) {
                    firstAlert.textContent = "No active alert at the moment.";
                    firstAlert.classList.remove("skeleton-text");
                    return;
                }

                if(alertLoopVerification === true)
                    alertInfo = document.querySelectorAll("#alerts .container > p");

                response.data.forEach((item, index) => {
                    if(alertLoopVerification === false) {
                        if(index === 0) {
                            alertName[index] = document.createElement("h3");
                            alertName[index].textContent = response.data[index].title;
                            alertContainer.appendChild(alertName[index]);

                            firstAlert.textContent = response.data[index].time;
                            alertInfo[index] = firstAlert;
                            alertContainer.appendChild(alertInfo[index]);
                        } else {
                            additionalContainer[index] = document.createElement("div");
                            additionalContainer[index].classList.add("container");
                            alerts.appendChild(additionalContainer[index]);

                            alertName[index] = document.createElement("h3");
                            alertName[index].textContent = response.data[index].title;
                            additionalContainer[index].appendChild(alertName[index]);

                            alertInfo[index] = document.createElement("p");
                            alertInfo[index].textContent = response.data[index].time;
                            additionalContainer[index].appendChild(alertInfo[index]);
                        }
                    } else {
                        if(index === 0)
                            firstAlert.textContent = response.data[index].time;
                        else
                            alertInfo[index].textContent = response.data[index].time;
                    }
                });

                alertLoopVerification = true;
            };

            const alertEvent = () => {
                firstAlert.classList.remove('skeleton-text');
                alertWebWorker.removeEventListener('message', alertEvent);
            };

            alertWebWorker.addEventListener('message', alertEvent);

            alertWebWorker.postMessage(data);
        // ------------------------------------------
    }

    function insertingVoidFissuresData(data) {
        // ----- Initializing alerts web worker -----
            if(typeof(fissureWebWorker) == "undefined") {
              fissureWebWorker = new Worker("webworker/void_fissures_worker.js");
            }

            fissureWebWorker.onmessage = function(response) {
                const additionalContainer = [], fissureName = [], dateNow = new Date();
                let fissureInfo = [];

                if(fissureLoopVerification === true)
                    fissureInfo = document.querySelectorAll("#fissures .container > p");

                response.data.forEach((item, index) => {
                    if(fissureLoopVerification === false) {
                        if(index === 0) {
                            fissureName[index] = document.createElement("h3");
                            fissureName[index].textContent = item.title;
                            fissureContainer.appendChild(fissureName[index]);

                            firstFissure.textContent = item.time;
                            fissureInfo[index] = firstFissure;
                            fissureContainer.appendChild(fissureInfo[index]);
                        } else {
                            additionalContainer[index] = document.createElement("div");
                            additionalContainer[index].classList.add("container");

                            fissures.appendChild(additionalContainer[index]);

                            fissureName[index] = document.createElement("h3");
                            fissureName[index].textContent = item.title;
                            additionalContainer[index].appendChild(fissureName[index]);

                            fissureInfo[index] = document.createElement("p");
                            fissureInfo[index].textContent = item.time;
                            additionalContainer[index].appendChild(fissureInfo[index]);
                        }
                    } else {
                        if(index === 0)
                            firstFissure.textContent = response.data[index].time;
                        else
                            fissureInfo[index].textContent = response.data[index].time;
                    }
                });

                fissureLoopVerification = true;
            };

            const fissureEvent = () => {
                firstFissure.classList.remove('skeleton-text');
                fissureWebWorker.removeEventListener('message', fissureEvent);
                
                [].forEach.call(filters, (item, index) => {
                    if(data[index].isStorm === false)
                        item.classList.add("fissure");
                    else
                        item.classList.add("voidstorm");
                    
                    if(data[index].tier === "Lith")
                        item.classList.add("lith");
                    else if(data[index].tier === "Meso")
                        item.classList.add("meso");
                    else if(data[index].tier === "Neo")
                        item.classList.add("neo");
                    else
                        item.classList.add("axi");

                    if(!item.classList.contains("fissure") || !item.classList.contains("lith"))
                        item.style.display = "none";
                });
            };

            fissureWebWorker.addEventListener('message', fissureEvent);

            fissureWebWorker.postMessage(data);
        // ------------------------------------------

        lithBtn.addEventListener("click", () => {
            lithBtn.classList.add("active");
            lithBtn.disabled = "true";

            mesoBtn.classList.remove("active");
            mesoBtn.disabled = "";
            
            neoBtn.classList.remove("active");
            neoBtn.disabled = "";
            
            axiBtn.classList.remove("active");
            axiBtn.disabled = "";
            filterLith();
        });

        mesoBtn.addEventListener("click", () => {
            lithBtn.classList.remove("active");
            lithBtn.disabled = "";
            
            mesoBtn.classList.add("active");
            mesoBtn.disabled = "true";
            
            neoBtn.classList.remove("active");
            neoBtn.disabled = "";
            
            axiBtn.classList.remove("active");
            axiBtn.disabled = "";
            filterMeso();
        });
        
        neoBtn.addEventListener("click", () => {
            lithBtn.classList.remove("active");
            lithBtn.disabled = "";

            mesoBtn.classList.remove("active");
            mesoBtn.disabled = "";

            neoBtn.classList.add("active");
            neoBtn.disabled = "true";

            axiBtn.classList.remove("active");
            axiBtn.disabled = "";
            filterNeo();
        });
        
        axiBtn.addEventListener("click", () => {
            lithBtn.classList.remove("active");
            lithBtn.disabled = "";
            
            mesoBtn.classList.remove("active");
            mesoBtn.disabled = "";

            neoBtn.classList.remove("active");
            neoBtn.disabled = "";

            axiBtn.classList.add("active");
            axiBtn.disabled = "true";
            filterAxi();
        });
        
        fissureBtn.addEventListener("click", () => {
            fissureBtn.classList.add("active");
            fissureBtn.disabled = "true";
            
            voidstormBtn.classList.remove("active");
            voidstormBtn.disabled = "";
            filterFissure();
        });
        
        voidstormBtn.addEventListener("click", () => {
            fissureBtn.classList.remove("active");
            fissureBtn.disabled = "";
            
            voidstormBtn.classList.add("active");
            voidstormBtn.disabled = "true";
            filterVoidStorm();
        });
    }

    function filterLith() {
        [].forEach.call(filters, (item, index) => {
            if(!item.classList.contains("lith"))
                item.style.display = "none";
            else {
                if(fissureBtn.classList.contains("active")) {
                    if(item.classList.contains("fissure"))
                        item.style.display = "initial";
                }
                else {
                    if(item.classList.contains("voidstorm"))
                        item.style.display = "initial";
                }
            }
        });
    }

    function filterMeso() {
        [].forEach.call(filters, (item, index) => {
            if(!item.classList.contains("meso"))
                item.style.display = "none";
            else {
                if(fissureBtn.classList.contains("active")) {
                    if(item.classList.contains("fissure"))
                        item.style.display = "initial";
                }
                else {
                    if(item.classList.contains("voidstorm"))
                        item.style.display = "initial";
                }
            }
        });
    }

    function filterNeo() {
        [].forEach.call(filters, (item, index) => {
            if(!item.classList.contains("neo"))
                item.style.display = "none";
            else {
                if(fissureBtn.classList.contains("active")) {
                    if(item.classList.contains("fissure"))
                        item.style.display = "initial";
                }
                else {
                    if(item.classList.contains("voidstorm"))
                        item.style.display = "initial";
                }
            }
        });
    }

    function filterAxi() {
        [].forEach.call(filters, (item, index) => {
            if(!item.classList.contains("axi"))
                item.style.display = "none";
            else {
                if(fissureBtn.classList.contains("active")) {
                    if(item.classList.contains("fissure"))
                        item.style.display = "initial";
                }
                else {
                    if(item.classList.contains("voidstorm"))
                        item.style.display = "initial";
                }
            }
        });
    }

    function filterFissure() {
        [].forEach.call(filters, (item, index) => {
            if(!item.classList.contains("fissure"))
                item.style.display = "none";
            else {
                if(lithBtn.classList.contains("active")) {
                    if(item.classList.contains("lith"))
                        item.style.display = "initial";
                }
                else if(mesoBtn.classList.contains("active")) {
                    if(item.classList.contains("meso"))
                        item.style.display = "initial";
                }
                else if(neoBtn.classList.contains("active")) {
                    if(item.classList.contains("neo"))
                        item.style.display = "initial";
                }
                else {
                    if(item.classList.contains("axi"))
                        item.style.display = "initial";
                }
            }
        });
    }

    function filterVoidStorm() {
        [].forEach.call(filters, (item, index) => {
            if(!item.classList.contains("voidstorm"))
                item.style.display = "none";
            else {
                if(lithBtn.classList.contains("active")) {
                    if(item.classList.contains("lith"))
                        item.style.display = "initial";
                }
                else if(mesoBtn.classList.contains("active")) {
                    if(item.classList.contains("meso"))
                        item.style.display = "initial";
                }
                else if(neoBtn.classList.contains("active")) {
                    if(item.classList.contains("neo"))
                        item.style.display = "initial";
                }
                else {
                    if(item.classList.contains("axi"))
                        item.style.display = "initial";
                }
            }
        });
    }
// ---------------------------------------------