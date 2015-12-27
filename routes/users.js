var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var dbconn = require('../modules/DBconn.js');


router.post('/', function(req,res){


  var userInfo = {'id':req.session.userid, 'org_password':req.body.org_password, 'new_password':req.body.new_password };
  var sqlString = 'UPDATE user SET PASSWORD = (HEX(AES_ENCRYPT( ?, ? ))) WHERE ID = ?';
  var inserts = [userInfo.new_password, 'Lion', userInfo.id];
  var sql = mysql.format(sqlString, inserts);

  if(userInfo.new_password==userInfo.org_password){
    res.redirect("back");
  }

  if (userInfo.org_password==req.session.password){
    dbconn.pool.getConnection(function(err,connection){
      var query = connection.query(sql, function (err, rows) {
        if(err){
          connection.release();
          throw err;
        }
        res.redirect("/main");
        connection.release();
      });
    });
  }else{
    console.log("pwd unmatched");
    res.redirect("back");
  }




});

module.exports = router;
