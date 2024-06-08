const jwt = require('jsonwebtoken');
const JWT_SECRETY = 'minhaSenhaSuperSegura123456789'



const fetchuser = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    const token = req.header("auth-token");

    if (!token) {
        return res.status(401).json({ error: "please authenticate using a valid token" })
    }

    try {
        const data = jwt.verify(token, JWT_SECRETY);
        req.user = data.user;
        next()
    } catch (error) {
        return res.status(401).json({ error: "please authenticate using a valid token" })
    }

}


module.exports = fetchuser;