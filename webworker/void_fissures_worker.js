function getTimeofVoidFissures(apiData) {
    let expiry, now, sec, min, hour;

    setInterval(() => {
        const fissures = [];
        apiData.forEach((item, index) => {
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
                            title: `${item.tier} - ${item.node} - ${item.missionType}`,
                            time: `Expired.`
                        }
                    );
                } else {
                    fissures.push({
                            title: `${item.tier} - ${item.node} - ${item.missionType}`,
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