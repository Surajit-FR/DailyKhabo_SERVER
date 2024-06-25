const ipCounts = {};

exports.trackIP = (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip) {
        ipCounts[ip] = (ipCounts[ip] || 0) + 1;
    }
    req.ipCounts = ipCounts;
    next();
};
