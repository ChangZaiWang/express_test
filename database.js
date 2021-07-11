const mysql = require('mysql2')

module.exports = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '10155180',
    database : 'medium'
})