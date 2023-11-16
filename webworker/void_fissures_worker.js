function getTimeofVoidFissures(apiData) {
    setInterval(() => {
        let expiry, now, sec, min, hour;
        const fissures = [];
        apiData.forEach((item) => {
            if(item.active === true) {
                expiry = new Date(item.expiry);
                now = new Date();
                sec = Math.floor((expiry - now) / 1000);
                min = Math.floor(sec / 60);
                hour = Math.floor(min / 60);

                sec = sec % 60;
                min = min % 60;
                hour = hour % 24;

                if(hour <= 0 && min <= 0 && sec <= 0) {
                    fissures.push({
                            time: `Expired.`
                        }
                    );
                }
                else {
                    fissures.push({
                            time: `${hour}h:${min}m:${sec}s`
                        }
                    );
                }
            }
        });
        postMessage(fissures);
    },1000);
}

onmessage = (response) => {
    getTimeofVoidFissures(response.data);
};