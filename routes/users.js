var express = require('express');
var router = express.Router();


router.post('/', function(req,res){
  var userInfo = {'id':req.body.userId, 'password':req.body.userPassword};
  var sqlResult;
  var tmpRes=res;
  if(userInfo.id=="" || userInfo.id==null) {
    console.log("userID:" + userInfo.id + "|");
    //req.flash("info", "put id");
    res.redirect('back');
    res.end();
  }else if(userInfo.password=="" || userInfo.password==null){
    //req.flash("info", "put password");
    res.redirect('back');
    res.end();
  }else{
    var dbconn = require('../modules/DBconn.js');
    var strQuery = 'select id,name, AES_DECRYPT( UNHEX(password), "'+"Lion"+'") as password from user where id = "'+userInfo.id+'"';
    dbconn.doQuery(strQuery,function(rows){
      //console.log(rows);
      if(rows.length!=0){
        console.log("input pwd: "+userInfo.password + "\t db pwd: "+rows[0].password +"\t pwd");
        if(rows[0].password==userInfo.password){
          req.session.userid=userInfo.id;
          req.session.username=rows[0].name;
          tmpRes.redirect("/main");
        }else{
          console.log("pwd unmatched");
          tmpRes.redirect('back');
        }

      }else{
        tmpRes.redirect('back');
      }

    });
    //res.send('respond with a resource ');
    //
    //var dbconn = require('../modules/DBconn.js');
    //var connection = dbconn.getConnection();
    //console.log("id:"+userInfo.id);
    //
    //var query = connection.query('select id, password from user where id = ?',userInfo.id,function(err,rows){
    //  console.log(rows);
    //  dbconn.endConnection();
    //  if(rows.length!=0){
    //    console.log("input pwd: "+userInfo.password + "\t db pwd: "+rows[0].password +"\t pwd");
    //    if(rows[0].password==userInfo.password){
    //      res.redirect("/main");
    //    }else{
    //      console.log("pwd unmatched");
    //      req.flash("warn", "wrong password");
    //      res.redirect('back');
    //    }
    //
    //  }else{
    //    req.flash("warn", "wrong id");
    //    res.redirect('back');
    //  }
    //  //res.json(rows);
    //
    //});



    //res.send('respond with a resource :post');

  }



});

module.exports = router;
