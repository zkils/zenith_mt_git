/**
 * Created by 종원 on 2015-12-26.
 */



var mysql = require('mysql');


exports.pool =  mysql.createPool({
    host    :'52.192.93.222',
    port : 3306,
    user : 'root',
    password : 'Lion@123',
    database:'zen_main',
    connectionLimit:50,
    waitForConnections:false
});
