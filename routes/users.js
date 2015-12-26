var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

  res.send('get');
});

router.post('/', function(req,res){
  var userInfo = {'id':req.body.userId, 'password':req.body.userPassword};
  console.log(userInfo);

  var dbconn = require('../modules/DBconn.js');
  var connection = dbconn.getConnection();
  connection.connect(function(err) {
    if (err) {
      console.error('mysql connection error');
      console.error(err);
      throw err;
    }
  });

  //console.log("get users: "+'select id,AES_DECRYPT(UNHEX(password),'+'\'Lion\''+') from user');
  var query = connection.query('select id, password from user',function(err,rows){
    console.log(rows);
    res.json(rows);
  });
  //res.send('respond with a resource :post');
});

module.exports = router;
