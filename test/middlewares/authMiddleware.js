const jwt = require('jsonwebtoken');

exports.verifyLogin = (req, res, next) => {
  try {
    let token = req.session.accessToken;
    if (!token) {
      res.redirect('/auth/login');
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userData = { userId: decodedToken.userId, role: decodedToken.userRole };
    next();
  } catch (err) {
    // res.status(404).json({ message: err });
  }

};

exports.isAdmin = (req, res, next) => {
  this.verifyLogin(req, res, () => {
    if (req.userData.role == 0 || req.userData.userId == req.params.id) {
      next();
    } else {
      res.redirect('/error');
    }
  });
}

exports.clientVerifyLogin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ message: 'Bạn chưa đăng nhập!' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid JWT token: '+ token});
    }
    req.userData = { userId: user.userId, role: user.userRole };
    next();
  });
}

exports.isClientAdmin = (req, res, next) => {
  this.clientVerifyLogin(req, res, () => {
    if (req.userData.role == 0 || req.userData.userId == req.params.id) {
      next();
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
  });
}
