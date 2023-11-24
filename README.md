# host-locker

HostLocker is a Node.js middleware class designed for rate-limiting and controlling access based on the number of requests within a specified time window for specific hosts.

## Table of Contents
<!-- no toc -->
  - [About](#about)
  - [Installation and usage](#installation-and-usage)
  - [Support](#support)


## About

The library checks if a given hostname is allowed to make a request based on the configured rate-limiting parameters.

## Installation and usage

  * Install the host-locker module using npm:

```js
$ npm install host-locker
```

  * Usage
```js
const HostLocker = require('host-locker');

// Initialize HostLocker with configuration
const hostLimiter = new HostLocker({
  maxCallThreshold: 5, // Maximum allowed calls within the specified time window (default: 5)
  secondsThreshold: 5, // Time window in seconds (default: 5)
  allowedHosts: ['example.com', 'api.example.com']  // Allowed hosts (default: [])
});

// Check if a host is allowed to make a request
const isAllowed = hostLimiter.check('example.com');

if (isAllowed) {
  // Proceed with the request
  console.log('Request allowed!');
} else {
  // Deny the request
  console.log('Access denied. Too many requests from this host.');
}
```

## Support

This library used jsdoc types and is tested in Chrome

