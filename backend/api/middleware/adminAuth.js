const adminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }

    const token = authHeader.split(' ')[1];
    const adminSecret = process.env.ADMIN_SECRET;

    if (!adminSecret) {
        console.error('ADMIN_SECRET not configured in environment variables');
        return res.status(500).json({
            success: false,
            message: 'Server configuration error'
        });
    }

    if (token !== adminSecret) {
        return res.status(403).json({
            success: false,
            message: 'Invalid credentials'
        });
    }

    next();
};

module.exports = adminAuth;
