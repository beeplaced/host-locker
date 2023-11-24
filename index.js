class HostLocker {

    constructor(maxCallThreshold=5, secondsThreshold=5) {
        this.hostCount = {};
        this.maxCallThreshold = maxCallThreshold;
        this.secondsThreshold = secondsThreshold;
    }

    check = (hostname) => {
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