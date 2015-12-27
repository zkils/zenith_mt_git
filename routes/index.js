var express = require('express');
var router = express.Router();

var dbconn = require('../modules/DBconn.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("-------------index start : get---------");
  console.log("login fail : "+req.query.fail);
  res.render('index', { title: '회의실 예약 관리 시스템'  });
});

router.post('/', function(req,res){
  var userInfo = {'id':req.body.userId, 'password':req.body.userPassword};
  if(userInfo.id=="" || userInfo.id==null) {
    console.log("userID:" + userInfo.id + "|");
    res.redirect('back');
    res.end();
  }else if(userInfo.password=="" || userInfo.password==null){
    res.redirect('back');
    res.end();
  }else{
    var sqlString = 'select id,name, AES_DECRYPT( UNHEX(password), "'+"Lion"+'") as password from user where id = "'+userInfo.id+'"';
    dbconn.pool.getConnection(function(err,connection){
      var query = connection.query(sqlString, function (err, rows) {
        if(err){
          connection.release();
          throw err;
        }
        if(rows.length!=0) {
          console.log("input pwd: " + userInfo.password + "\t db pwd: " + rows[0].password + "\t pwd");
          if (rows[0].password == userInfo.password) {
            req.session.userid = userInfo.id;
            req.session.username = rows[0].name;
            res.redirect("/main?username="+rows[0].name+"&userid="+userInfo.id);
          } else {
            console.log("pwd unmatched");
            res.redirect("/?fail=true");
          }
        }else{
          res.redirect("/?fail=true");
        }
        connection.release();
      });
    });
  }
});


module.exports = router;
