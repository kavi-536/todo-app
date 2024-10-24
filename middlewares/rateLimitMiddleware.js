const rateLimitStore = new Map();

exports.addToDoLimiter = (req, res, next) => {
    const userId = req.user.id;
    const currentTimestamp = Date.now();
    const windowTime = 15 * 60 * 1000;
    const requestLimit = 10;

    if (!rateLimitStore.has(userId)) {
        // Initialize user with empty request array and current timestamp as last reset
        rateLimitStore.set(userId, { requests: [], lastReset: currentTimestamp });
    }

    const userData = rateLimitStore.get(userId);

    // Reset the rate limit window if the time since last reset exceeds the window time
    if (currentTimestamp - userData.lastReset > windowTime) {
        userData.requests = [];
        userData.lastReset = currentTimestamp;
    }

    // If the user has exceeded the request limit, prevent further requests for 3 minutes
    const waitTime = 3 * 60 * 1000; // 3 minutes in milliseconds
    if (userData.requests.length >= requestLimit) {
        const firstRequestTime = userData.requests[0];
        const remainingWait = waitTime - (currentTimestamp - firstRequestTime);
        
        if (remainingWait > 0) {
            const waitTimeInSeconds = Math.ceil(remainingWait / 1000);
            return res.status(429).json({ 
                message: `Rate limit exceeded. Please wait ${waitTimeInSeconds} seconds.` 
            });
        } else {
            // Reset requests if 3 minutes have passed after reaching the limit
            userData.requests = [];
        }
    }

    // Add the current request timestamp to the user's request list
    userData.requests.push(currentTimestamp);

    // Clean up old requests that are outside of the window time
    userData.requests = userData.requests.filter(
        timestamp => currentTimestamp - timestamp <= windowTime
    );

    rateLimitStore.set(userId, userData);
    next();
};
