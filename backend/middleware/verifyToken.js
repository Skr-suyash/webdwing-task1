const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
        console.log(err);
        return res.status(401).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
}

module.exports = verifyToken;