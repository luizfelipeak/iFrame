function getTimeofCambionDrift(apiData) {
    let expiry = new Date(apiData.expiry);
    let now = new Date();
    let active = apiData.active;
    let sec = Math.floor((expiry - now) / 1000);
    let min = Math.floor(sec / 60);
    let hour = Math.floor(min / 60);
    let verification = false;

    sec = sec % 60;
    min = min % 60;
    hour = hour % 24;

    if(active === 'fass')
        postMessage(`Fass ends in ${hour}h:${min}m:${sec}s`);
    else
        postMessage(`Vome ends in ${hour}h:${min}m:${sec}s`);

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
            if(active === 'fass') {
                min = 50;
                verification = false;
                active = 'vome';
                postMessage([`Vome ends in ${hour}h:${min}m:${sec}s`, 'vome']);
            }
            else {
                hour = 1;
                min = 40;
                verification = false;
                active = 'fass';
                postMessage([`Fass ends in ${hour}h:${min}m:${sec}s`, 'fass']);
            }
        }
        else {
            if(active === 'fass')
                postMessage(`Fass ends in ${hour}h:${min}m:${sec}s`);
            else
                postMessage(`Vome ends in ${hour}h:${min}m:${sec}s`);
        }
    },1000);
}
    
onmessage = (response) => {
    getTimeofCambionDrift(response.data);
};