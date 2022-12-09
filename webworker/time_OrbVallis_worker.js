function getTimeofOrbVallis(apiData) {
    let expiry = new Date(apiData.expiry);
    let now = new Date();
    let isWarm = apiData.isWarm;
    let sec = Math.floor((expiry - now) / 1000);
    let min = Math.floor(sec / 60);
    const hour = 0;
    let verification = false;

    sec = sec % 60;
    min = min % 60;

    if(isWarm)
        postMessage(`Warm ends in ${hour}h:${min}m:${sec}s`);
    else
        postMessage(`Cold ends in ${hour}h:${min}m:${sec}s`);

    setInterval(() => {
        if(sec > 0)
            sec -= 1;
        else {
            sec = 59;
            if(min > 0)
                min -= 1;
            else
                min = 59;
        }

        if(min == 0 && sec == 0)
            verification = true;
        
        if(verification == true) {
            if(isWarm == true) {
                min = 20;
                sec = 0;
                verification = false;
                isWarm = false;
                postMessage([`Cold ends in ${hour}h:${min}m:${sec}s`, 'cold']);
            }
            else {
                min = 6;
                sec = 40;
                verification = false;
                isWarm = true;
                postMessage([`Warm ends in ${hour}h:${min}m:${sec}s`, 'warm']);
            }
        }
        else {
            if(isWarm)
                postMessage(`Warm ends in ${hour}h:${min}m:${sec}s`);
            else
                postMessage(`Cold ends in ${hour}h:${min}m:${sec}s`);
        }
    },1000);
}

onmessage = (response) => {
    getTimeofOrbVallis(response.data);
};