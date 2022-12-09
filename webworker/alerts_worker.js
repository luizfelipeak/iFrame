function getTimeofAlerts(apiData) {
    let expiry, now, sec, min, hour, day;

    setInterval(() => {
        const alerts = [];
        apiData.forEach((item, index) => {
            if(item.active === true) {
                expiry = new Date(item.expiry);
                now = new Date();
                sec = Math.floor((expiry - now) / 1000);
                min = Math.floor(sec / 60);
                hour = Math.floor(min / 60);
                day = Math.floor(hour / 24);

                sec = sec % 60;
                min = min % 60;
                hour = hour % 24;

                if(day === 0 && hour === 0 && min === 0 && sec === 0) {
                    alerts.push({
                            title: `${item.mission.node} - ${item.mission.type} - ${item.mission.reward.asString}`,
                            time: `Expired.`
                        }
                    );
                } else {
                    alerts.push({
                            title: `${item.mission.node} - ${item.mission.type} - ${item.mission.reward.asString}`,
                            time: `${day}day(s):${hour}h:${min}m:${sec}s`
                        }
                    );
                }
            }
        });
        postMessage(alerts);
    },1000);
}
    
onmessage = (response) => {
    getTimeofAlerts(response.data);
};