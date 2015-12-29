var express = require('express');
var router = express.Router();

var dbconn = require('../modules/DBconn.js');

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: '회의실 예약 관리 시스템'  });
});

router.post('/', function(req,res){
  var userInfo = {'id':req.body.userId, 'password':req.body.userPassword};
  if(userInfo.id=="" || userInfo.id==null) {
    console.log("userID nothing!");
    res.redirect('back');
    res.end();
  }else if(userInfo.password=="" || userInfo.password==null){
    console.log("userPassword nothing!");
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
          console.log("success db conn");
          if (rows[0].password == userInfo.password) {
            req.session.userid = userInfo.id;
            req.session.username = rows[0].name;
            req.session.password = userInfo.password;
            //res.redirect("/main?username="+rows[0].name+"&userid="+userInfo.id);
            res.send(rows[0]);

          } else {
            console.log("pwd unmatched");
            res.send();
          }
        }else{
          console.log("id unmatched");
          res.send();
        }
        connection.release();
      });
    });
  }
});


module.exports = router;
