const jwt = require('jsonwebtoken');
const private = require('../config/private');

module.exports = {
  verifyToken,
  genToken,
};

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (req.decodedJwt) {
    next();
  } else if (token) {
    jwt.verify(token, private.jwtSecret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: 'wrong credentials' });
      } else {
        req.decodedJwt = decodedToken;
        next();
      }
    })
  } else {
    res.status(401).json({ message: 'are sure you are in the right place?' });
  }
}

function genToken(user) {
  const payload = {
    userId: user.id,
    username: user.username,
    department: user.department, 
  }
  
  const options = {
    expiresIn: '3h',
  }

  const token = jwt.sign(payload, private.jwtSecret, options);
  return token;
}
