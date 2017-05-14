var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
  res.send('respond with a resource');
});



router.post('/users/login', function(req, res, next) {
  req.session.data={name:req.body.name};
    console.log(req.session.data);
});


module.exports = router;
