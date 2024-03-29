/*

    The file contains the various sql statements used in the application.

    SourceS Referenced: 
    * https://www.w3schools.com/nodejs/nodejs_mysql.asp
    * https://medium.com/@kelvinekrresa/mysql-client-does-not-support-authentication-protocol-6eed9a6e813e
    * https://www.freecodecamp.org/news/javascript-modules-explained-with-examples/

    Use of mysql2 package vs mysql came from an authentication issue with mysql package. Issue resolved via this article:
    https://github.com/strapi/strapi/issues/13774

*/

var mysql = require('mysql2');

let db = mysql.createConnection(`mysql://root:eFFDdBCBD1cdd6EaBd6D3H56AFC-GC1E@roundhouse.proxy.rlwy.net:46480/railway`);

// Export router so that it can be used by app.js
module.exports = db;
