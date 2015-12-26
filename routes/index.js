var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var messages = {};
  //if (typeof res.locals.messages.info != 'undefined'){
  //  messages = res.locals.messages.info;
  //}
  res.render('index', { title: '회의실 예약 관리 시스템' , message:messages });
});

module.exports = router;
