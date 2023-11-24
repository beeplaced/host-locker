/** Class representing a rate limiter for controlling access based on the number
 * of requests within a specified time window for specific hosts.
 */
class HostLocker {
    /**
       * Creates an instance of HostLocker.
       * @param {Object} config - Configuration options.
       * @param {number} [config.maxCallThreshold=5] - Maximum allowed calls within the specified time window.
       * @param {number} [config.secondsThreshold=5] - Time window in seconds.
       * @param {string[]} [config.allowedHosts=[]] - An array of allowed hosts.
       */
    constructor(config) {
        const { maxCallThreshold = 5, secondsThreshold = 5, allowedHosts = [] } = config
        /**
             * Object to store the request count for each host.
             * @type {Object.<string, { c: number, d: Date }>}
             */
        this.hostCount = {}
        /**
             * Maximum allowed calls within the specified time window.
             * @type {number}
             */
        this.maxCallThreshold = maxCallThreshold
        /**
             * Time window in seconds.
             * @type {number}
             */
        this.secondsThreshold = secondsThreshold
        /**
             * An array of allowed hosts.
             * @type {string[]}
             */
        this.allowedHosts = allowedHosts
    }

    /**
       * Checks if a given hostname is allowed to make a request based on the configured rate-limiting parameters.
       * @param {string} hostname - The hostname to check.
       * @returns {boolean} Returns true if the request is allowed, false otherwise.
       */
    check(hostname) {
        if (!this.allowedHosts.includes(hostname)) {
            return false
        }

        let run = true

        if (!this.hostCount[hostname]) {
            this.newHostCount(hostname)
        } else {
            const mt = this.hostCount[hostname].d
            const timestamp = new Date(mt)

            const isOlder = this.timeStampOlder(timestamp)
            if (isOlder) {
                this.newHostCount(hostname)
            } else {
                this.hostCount[hostname].c++
            }
            if (this.hostCount[hostname].c > this.maxCallThreshold) {
                run = false
            }
        }
        return run
    }

    /**
       * Checks if a given timestamp is older than the specified time threshold.
       * @param {Date} timestamp - The timestamp to check.
       * @returns {boolean} Returns true if the timestamp is older, false otherwise.
       */
    timeStampOlder(timestamp) {
        const timestampDate = new Date(timestamp)
        const currentDate = new Date()
        const timeDifferenceInSeconds = (currentDate - timestampDate) / 1000
        return timeDifferenceInSeconds > this.secondsThreshold
    }

    /**
       * Resets the request count for a given hostname.
       * @param {string} hostname - The hostname to reset the count for.
       */
    newHostCount(hostname) {
        this.hostCount[hostname] = {
            c: 1,
            d: new Date()
        }
    }
}

module.exports = HostLocker
