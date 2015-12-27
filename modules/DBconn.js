/**
 * Created by 종원 on 2015-12-26.
 */



var mysql = require('mysql');

var dbinfo = {
    host    :'52.192.93.222',
    port : 3306,
    user : 'root',
    password : 'Lion@123',
    database:'zen_main'
};

exports.doQuery = function(sql, callback){
    var connection = mysql.createConnection(dbinfo);
    connection.connect(function(err, rows){
        if(err)
            return ;
        else
            return ;
    });
    connection.query(sql, function(err, rows, field) {
        console.log("log - doquery : " + sql);
        if (err){
            connection.end();
            callback(null);
            return;
        }else {
            callback(rows);
            return ;
        }
    });
    connection.end();
}