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
    if(date==null){
        date = getToDay();
    }
    var sqlString = 'SELECT ID,MT_DATE,FROM_TIME,TO_TIME,ROOM_ID,USER_ID,NAME,PHONE,INSERT_DATE FROM MT_SCHEDULE WHERE MT_DATE ="'+date+'"';
    dbconn.pool.getConnection(function(err,connection){
        var query = connection.query(sqlString, function (err, rows) {
            if(err){
                connection.release();
                throw err;
            }
                //res.send({ username: req.session.username, userid: req.session.userid ,mtSchedule:rows });
                res.render('main', {username: req.session.username, userid: req.session.userid, mtSchedule: rows});
            console.log(rows);
            connection.release();
        });

    });

};



module.exports = router;