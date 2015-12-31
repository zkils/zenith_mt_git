/**
 * Created by 종원 on 2015-12-27.
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var dbconn = require('../modules/DBconn.js');


router.post('/', function(req,res){
    var action = req.body.action;
    var mtId = req.body.mtId;
    console.log("-- Manage MT - action: "+ action+ "  / mtid :" + mtId );

    switch (action){
        case "insertMt" :
                insertMeeting(req,res,{
                    roomid:req.body.roomid,
                    day:req.body.day,
                    fromtime:req.body.fromtime,
                    totime:req.body.totime,
                    name:req.body.name,
                    number:req.body.number,
                    userid:req.session.userid
                });
            break;
        case "updateMt" :
                updateMeeting(req,res,{
                    mtId:req.body.mtId,
                    name:req.body.name,
                    phone:req.body.phone
                });
            break;
        case "cancelMt" :
            cancelMeeting(req,res,mtId);
            break;

    }
    //res.redirect('back');


});

function insertMeeting(req, res, data){
    console.log(data);
    var sqlString = 'INSERT INTO MT_SCHEDULE (MT_DATE, FROM_TIME, TO_TIME, ROOM_ID, USER_ID, NAME, PHONE) values ( ? , ? , ? , ? , ? , ? , ? )';
    var inserts = [data.day,data.fromtime, data.totime, data.roomid,data.userid,data.name,data.number];
    var sql = mysql.format(sqlString, inserts);
    console.log(sql);

    dbconn.pool.getConnection(function(err,connection){
        var query = connection.query(sql, function (err, rows) {
            if(err){
                connection.release();
                throw err;
            }
            connection.release();
            //res.redirect("/main");
            res.status(200).send();
        });

    });

};

function updateMeeting(req,res,data){

    var sqlString = 'UPDATE MT_SCHEDULE SET NAME = ? , PHONE = ? WHERE ID = ?';
    var inserts = [data.name,data.phone,data.mtId];
    var sql = mysql.format(sqlString, inserts);
    console.log(sql);

    dbconn.pool.getConnection(function(err,connection){
        var query = connection.query(sql, function (err, rows) {
            if(err){
                connection.release();
                throw err;
            }
            connection.release();
            res.status(200).send();
            //res.redirect("/main");
        });

    });

};
function cancelMeeting(req,res,mtId){
    var sqlString = 'DELETE FROM MT_SCHEDULE WHERE ID='+mtId;
    console.log(sqlString);

    dbconn.pool.getConnection(function(err,connection){
        var query = connection.query(sqlString, function (err, rows) {
            if(err){
                connection.release();
                throw err;
            }
            connection.release();
            console.log("Server - Delete success");
            res.status(200).send({success:"delete success"});
            //res.redirect("/main");
        });

    });
};



module.exports = router;
