function getTimeofPlainsofEidolon(apiData) {
    let expiry = new Date(apiData.expiry);
    let now = new Date();
    let isDay = apiData.isDay;
    let sec = Math.floor((expiry - now) / 1000);
    let min = Math.floor(sec / 60);
    let hour = Math.floor(min / 60);
    let verification = false;

    sec = sec % 60;
    min = min % 60;
    hour = hour % 24;

    if(isDay)
        postMessage(`Day ends in ${hour}h:${min}m:${sec}s`);
    else
        postMessage(`Night ends in ${hour}h:${min}m:${sec}s`);

    setInterval(() => {
        if(sec > 0)
            sec -= 1;
        else {
            sec = 59;
            if(min > 0)
                min -= 1;
            else {
                min = 59;
                hour = 0;
            }
        }

        if(hour == 0 && min == 0 && sec == 0)
            verification = true;
        
        if(verification == true) {
            if(isDay == true) {
                min = 50;
                verification = false;
                isDay = false;
                postMessage([`Night ends in ${hour}h:${min}m:${sec}s`, 'night']);
            }
            else {
                hour = 1;
                min = 40;
                verification = false;
                isDay = true;
                postMessage([`Day ends in ${hour}h:${min}m:${sec}s`, 'day']);
            }
        }
        else {
            if(isDay)
                postMessage(`Day ends in ${hour}h:${min}m:${sec}s`);
            else
                postMessage(`Night ends in ${hour}h:${min}m:${sec}s`);
        }
    },1000);
}
    
onmessage = (response) => {
    getTimeofPlainsofEidolon(response.data);
};