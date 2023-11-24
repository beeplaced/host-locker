class HostLocker {

    constructor(config) {
        const { maxCallThreshold=5, secondsThreshold=5, allowedHosts=[] } = config
        this.hostCount = {};
        this.maxCallThreshold = maxCallThreshold;
        this.secondsThreshold = secondsThreshold;
        this.allowedHosts = allowedHosts;
    }

    check = (hostname) => {
        
        if (!this.allowedHosts.includes(hostname)){
            return false
        }
        let run = true

        if (!this.hostCount[hostname]) {
            this.newHostCount(hostname)
        } else {
            const mt = this.hostCount[hostname].d
            const timestamp = new Date(mt);

            const isOlder = this.timeStampOlder(timestamp);
            if (isOlder) {
            this.newHostCount(hostname);
            } else {
                this.hostCount[hostname].c++;
            }
            if (this.hostCount[hostname].c > this.maxCallThreshold) {
                run = false
            }
        }
        return run
    };


timeStampOlder = (timestamp) => {
    const timestampDate = new Date(timestamp);
    const currentDate = new Date();
    const timeDifferenceInSeconds = (currentDate - timestampDate) / 1000;
    return timeDifferenceInSeconds > this.secondsThreshold;
}

newHostCount = (hostname) => {
    this.hostCount[hostname] = {
        c: 1,
        d: new Date()
    }
}

}

module.exports = HostLocker;