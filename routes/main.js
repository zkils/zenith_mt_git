var express = require('express');
var router = express.Router();

var dbconn = require('../modules/DBconn.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.query.userid);
    getSchedule(res,req);
});


router.post('/', function(req, res, next) {
    var date;
    if(req.body.date){
        date = req.body.date;
    }else{
        date = req.body.selectedDate;
    }
    getSchedule(res,req,date);
    //res.render('main', { title: '회의실 예약 관리 시스템',username: req.session.username, userid: req.session.userid  });
});

function replaceDate(str) {
    return replacer()

};
function getToDay(){
    var date = new Date();
    var year = date.getFullYear().toString();
    var month = ((date.getMonth()+1)) < 10 ? "0"+(date.getMonth()+1).toString() : (date.getMonth()+1).toString() ;
    var day = (date.getDate() <10 ) ?  "0"+date.getDate().toString() : date.getDate().toString();
    var today = year+"-"+month+"-"+day;
    return today;
};

function getSchedule(res,req,date){
    var isToday;
    if(date==null){
        date = getToDay();
        isToday=true;
    }else{
        isToday=false;
    }
    //TO-DO 쿼리 조인해서 user name / team name 가져올 것
    var sqlString ='SELECT MT_SCHEDULE.ID,MT_DATE,FROM_TIME,TO_TIME,ROOM_ID,USER_ID,MT_SCHEDULE.NAME,PHONE,USER.NAME as USERNAME,ROOM.NAME as ROOMNAME,DATE_FORMAT(MT_SCHEDULE.INSERT_DATE,"%Y-%m-%d %r") as INSERT_DATE FROM MT_SCHEDULE , ROOM , USER WHERE MT_DATE ="'+date+'" and MT_SCHEDULE.ROOM_ID = ROOM.ID and MT_SCHEDULE.USER_ID = USER.ID';
    //var sqlString = 'SELECT ID,MT_DATE,FROM_TIME,TO_TIME,ROOM_ID,USER_ID,NAME,PHONE,DATE_FORMAT(INSERT_DATE,"%Y-%m-%d %T") as INSERT_DATE FROM MT_SCHEDULE WHERE MT_DATE ="'+date+'"';
    //console.log(sqlString);
    dbconn.pool.getConnection(function(err,connection){
        var query = connection.query(sqlString, function (err, rows) {
            if(err){
                connection.release();
                throw err;
            }
            //res.send({ username: req.session.username, userid: req.session.userid ,mtSchedule:rows });
            //res.render('main', {
            //    rData:rows,
            //    userInfo:{"username": req.session.username, "userid": req.session.userid}
            //} );
            if(isToday) {
                res.render('main', {
                    rData:rows,
                    userInfo:{"username": req.session.username, "userid": req.session.userid}
                } );
            }else{
                console.log(date);
                res.status(200).send({
                    rData:rows
                });

            }

            //console.log(rows);
            connection.release();
        });

    });

};




module.exports = router;