var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '회의실 예약 관리 시스템' });
});

module.exports = router;
