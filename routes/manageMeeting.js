/**
 * Created by 종원 on 2015-12-27.
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var async = require('async');

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
    if(typeof(data.userid)=="undefined"){
        res.status(500).send({fail:"101",txt:"session is lost"});
        return;
    }

    var sqlString = 'INSERT INTO MT_SCHEDULE (MT_DATE, FROM_TIME, TO_TIME, ROOM_ID, USER_ID, NAME, PHONE) values ( ? , ? , ? , ? , ? , ? , ? )';
    var inserts = [data.day,data.fromtime, data.totime, data.roomid,data.userid,data.name,data.number];
    var insertSql = mysql.format(sqlString, inserts);

    sqlString = 'SELECT MT_SCHEDULE.ID,MT_DATE,FROM_TIME,TO_TIME,ROOM_ID,USER_ID,MT_SCHEDULE.NAME,PHONE,USER.NAME as USERNAME,ROOM.NAME as ROOMNAME,DATE_FORMAT(MT_SCHEDULE.INSERT_DATE,"%Y-%m-%d %r") as INSERT_DATE FROM MT_SCHEDULE , ROOM , USER WHERE MT_DATE =? and MT_SCHEDULE.ROOM_ID = ? and MT_SCHEDULE.ROOM_ID = ROOM.ID and MT_SCHEDULE.USER_ID = USER.ID';
    inserts = [data.day,data.roomid];
    var selectSql = mysql.format(sqlString, inserts);

    //console.log(insertSql +"\n" + selectSql+"\n" );
    async.waterfall([
        function(callback){
            var results;
            dbconn.pool.getConnection(function(err,connection){
                var query = connection.query(selectSql, function (err, rows) {
                    if(err){
                        connection.release();
                        throw err;
                    }
                    connection.release();
                    results = rows;
                    callback(null, results);
                });

            });
            //callback(null, results);

        },
        function(results,callback){
            var isAble = true;
            var targetFromTime = parseInt(data.fromtime), targetToTime = parseInt(data.totime);
            var resultsFromTime, resultsToTime;

            if(results){
                console.log("---check previous meeting schedule----");
                for( var i = 0 ; i < results.length ; i++){
                    resultsFromTime = parseInt(results[i].FROM_TIME);
                    resultsToTime = parseInt(results[i].TO_TIME);

                    if(results[i].FROM_TIME==data.fromtime || results[i].TO_TIME == data.totime){
                        isAble=false;
                        break;
                    }
                    if( ( resultsFromTime < targetFromTime && resultsToTime > targetFromTime ) || ( resultsFromTime < targetToTime && resultsToTime > targetToTime ) ){
                        isAble=false;
                        break;
                    }
                }

            }

            callback(null,isAble);

        }

    ],
        function(err, isAble){

            if(isAble){
                dbconn.pool.getConnection(function(err,connection){
                    var query = connection.query(insertSql, function (err ) {
                        if(err){
                            connection.release();
                            throw err;
                        }
                        connection.release();
                        //res.redirect("/main");
                        res.status(200).send({success:"insert success"});
                    });

                });
            }else{
                res.status(500).send({fail:"102",txt:"duplicated schedule"});
            }

        }
    );

/*
    dbconn.pool.getConnection(function(err,connection){
        var query = connection.query(insertSql, function (err ) {
            if(err){
                connection.release();
                throw err;
            }
            connection.release();
            //res.redirect("/main");
            res.status(200).send({success:"insert success"});
        });

    });
    */

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
            res.status(200).send({success:"update success"});
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
