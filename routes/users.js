var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var dbconn = require('../modules/DBconn.js');


router.post('/', function(req,res){
  var userInfo = {'id':req.session.userid, 'org_password':req.body.org_password, 'new_password':req.body.new_password, 'new_name':req.body.new_username };
  var sqlString = 'UPDATE user SET PASSWORD = (HEX(AES_ENCRYPT( ?, ? ))), NAME = ? WHERE ID = ?';
  var inserts = [userInfo.new_password, 'Lion', userInfo.new_name, userInfo.id];

  // Lion@1234
  if (userInfo.org_password==req.session.password){
    dbconn.pool.getConnection(function(err,connection){
      var query = connection.query(sqlString, function (err, rows) {
        if(err){
          connection.release();
          throw err;
        }
        res.send();
        connection.release();
      });
    });
  }else{
    console.log("pwd unmatched");
    res.send();
  }




});

module.exports = router;
