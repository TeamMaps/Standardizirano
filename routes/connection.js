var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'team3password',
    database: 'mydb'
});
exports(connection);