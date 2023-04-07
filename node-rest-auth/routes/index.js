var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // const isLoggedIn = req.session.isLoggedIn;
  isLoggedIn = false;
  
  if (req.session.accessToken) {
    isLoggedIn = true;
  }
  // console.log(isLoggedIn);
  res.render('index', { isLoggedIn: isLoggedIn });
});

module.exports = router;
