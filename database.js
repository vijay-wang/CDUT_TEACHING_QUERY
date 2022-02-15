const mysql = require('mysql');

exports.dbs=(tpl,querydata,callback)=>{
    var connection = mysql.createConnection({
        host     : '127.0.0.1',
        port     : '3306',
        user     : 'root',
        password : 'zxcvbnm',
        database : 'login_query'
    });

    connection.connect();

    connection.query(tpl,querydata, function (error, results, fields) {
        if (error) throw error;
        callback(results);
    });

    connection.end();
}
