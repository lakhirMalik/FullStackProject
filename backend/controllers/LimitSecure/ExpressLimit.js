const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        const  ip = req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress;
        console.warn('Rate Limit exceeded: ${ip}');
        return res.status(429).json({message: 'Too many requests - try again later'});
    }
});
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,                    // only 5 login attempts per 15 min
  message: { message: 'Too many login attempts. Try again in 15 minutes.' },
});

module.exports = {limiter, loginLimiter};
// app.use(limiter);                          // applies to everything
// app.use('/api/auth/login', loginLimiter);   
