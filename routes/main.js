var express = require('express');
var router = express.Router();

var dbconn = require('../modules/DBconn.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.query.userid);
    getSchedule(res,req);
});


router.post('/', function(req, res, next) {

    getSchedule(res,req,req.body.selectedDate);
    //res.render('main', { title: '회의실 예약 관리 시스템',username: req.session.username, userid: req.session.userid  });
});

function replaceDate(str) {
    return replacer()

};
function getToDay(){
    var date = new Date();
    var today = date.getFullYear().toString()+"-"+(date.getMonth()+1).toString()+"-"+date.getDate().toString();
    return today;
};

function getSchedule(res,req,date){
    var isToday;
    if(date==null){
        date = getToDay();
        isToday=true;
    }
    var sqlString = 'SELECT ID,MT_DATE,FROM_TIME,TO_TIME,ROOM_ID,USER_ID,NAME,PHONE,DATE_FORMAT(INSERT_DATE,"%Y-%m-%d %T") as INSERT_DATE FROM MT_SCHEDULE WHERE MT_DATE ="'+date+'"';
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
            console.log(sqlString);
            console.log(rows);
            connection.release();
        });

    });

};



module.exports = router;