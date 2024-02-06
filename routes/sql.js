/*

    The file contains the various sql statements used in the application.

    Source: https://www.w3schools.com/nodejs/nodejs_mysql.asp

    https://medium.com/@kelvinekrresa/mysql-client-does-not-support-authentication-protocol-6eed9a6e813e

*/

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "roundhouse.proxy.rlwy.net",
  user: "root",
  port: 46480,
  password: "eFFDdBCBD1cdd6EaBd6D3H56AFC-GC1E",
  database: "railway"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});