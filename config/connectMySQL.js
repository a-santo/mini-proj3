const mysql = require('mysql2');
module.exports = {
	con: mysql.createConnection({
		host	 : 'db4free.net',
		user     : 'webitclo_webbook',
		password : 'webbookPW#2018',
		database : 'webitclo_webbook'
	})
};