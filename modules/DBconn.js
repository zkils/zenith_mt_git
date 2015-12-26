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
//
//var connection = mysql.createConnection({
//    host    :'52.192.93.222',
//    port : 3306,
//    user : 'root',
//    password : 'Lion@123',
//    database:'zen_main'
//});
//
//exports.setConnection = function(){
//    console.log("get connection");
//    connection.connect(function(err) {
//        if (err) {
//            console.error('mysql connection error');
//            console.error(err);
//            throw err;
//        }
//    });
//};
//
//exports.getConnection = function(){
//    this.setConnection();
//    return connection;
//};
//
//exports.endConnection = function(){
//    console.log("end connection");
//    connection.end(function(err) {
//        if (err) {
//            console.error('mysql connection error');
//            console.error(err);
//            throw err;
//        }
//    });
//
//};

exports.doQuery = function(sql, callback){
    var connection = mysql.createConnection(dbinfo);
    connection.connect(function(err, res){
        if(err)
            return ;
        else
            return ;
    });
    connection.query(sql, function(err, res, field) {
        console.log("log - doquery : " + sql);
        if (err){
            connection.end();
            callback({});
            return;
        }else {
            callback(res);
            return ;
        }
    });
    connection.end();
}