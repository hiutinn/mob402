var jwt = require('jsonwebtoken');
var config = require('../config/database')
exports.verifyToken = (req, res, next) => {
    // Extract the JWT token from the session
    let token = req.session.accessToken;
    if (!token) {
      // return res.status(401).json({ message: 'Unauthorized 1' });
      return res.redirect('/api/signin');
    }

    // Verify the token using the secret key
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.status(401).json({ message: err+'assss' });
      }

      // Add the decoded token to the request object for use in later middleware
      req.user = decoded;
      
      next();
    });
  }