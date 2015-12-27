var express = require('express');
var router = express.Router();
var dbconn = require('../modules/DBconn.js');
var sqlString;
var tmpRR;

/* GET home page. */
router.get('/', function(req, res, next) {
    tmpRR = {res:res, session: req.session};
    getSchedule();

    //res.render('main', { title: '회의실 예약 관리 시스템',username: req.session.username, userid: req.session.userid  });
});

function getToDay(){
    var date = new Date();
    var today = date.getFullYear().toString()+(date.getMonth()+1).toString()+date.getDate().toString();
    return today;
};

function getSchedule(date){
    if(date==null){
        date = getToDay();
    }
    sqlString = 'SELECT ID,FROM_TIME,TO_TIME,ROOM_ID,USER_ID,NAME,PHONE FROM MT_SCHEDULE WHERE MT_DATE ="'+date+'"';
    console.log(sqlString);
    dbconn.doQuery(sqlString,function(rows){
        //console.log(rows);
        //tmpRR.res.send(200,'success');
        res.render('main', { title: '회의실 예약 관리 시스템',username: req.session.username, userid: req.session.userid ,mtSchedule:rows });
    });
};



module.exports = router;