/*
    This app.js file is based on a medium article describing how to build a simple web application. 
    I have modified the code given in the medium article to fit the purposes of my application.

    Source: https://medium.com/@guraycintir/simple-web-application-with-node-js-and-express-70f702b08498

    HTML web pages were rendered using the express.js guide to using template engines (linked below). 

    Source: https://expressjs.com/en/guide/using-template-engines.html

    The following resources were used to create the MySQL database:

        * For troubleshooting foreign key duplicate naming issue, the following resource was used:
          https://stackoverflow.com/questions/12994919/errno-121-duplicate-key-on-write-or-update

    The following resources were used to integrate Handlebars into the Node.js application
    
        * https://waelyasmina.medium.com/a-guide-into-using-handlebars-with-your-express-js-application-22b944443b65
        * https://www.youtube.com/watch?v=HxJzZ7fmUDQ
        * https://stackoverflow.com/questions/18580495/format-a-date-from-inside-a-handlebars-template-in-meteor
        * https://stackoverflow.com/questions/41764373/how-to-register-custom-handlebars-helpers
        * https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary

*/

// Modules to use
let express = require("express");
let index = require("./routes/index");
let db = require("./routes/mysql");
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

// Initialize app
let app = express();

// The following code is taken from the Medium article on Handlebars

//Loads the handlebars module
let handlebars = require('express-handlebars');
// let hbs = require("hbs");

var hbs = handlebars.create({});

// Deprecated since version 0.8.0 
hbs.handlebars.registerHelper("formatDate", function (ts) {
  // Format date to be inserted
  let d = new Date(ts * 1000);
  let year = d.getFullYear().toString();
  let month = d.getMonth() + 1;
  month = month.toString();
  let day = d.getDate().toString();
  let date = year + "-" + month + "-" + day;
  return date;
});

// Helper method to format amounts
hbs.handlebars.registerHelper("formatAmount", function (amount) {
  // Format Amount and round to 2 digits
  if (amount !== undefined) {
    amount = Math.round(amount * 100) / 100
  } else {
    amount = 0.00
  }
  return amount;
});

//Sets our app to use the handlebars engine
app.set('view engine', 'handlebars');

//Sets handlebars configurations (we will go through them later on)
app.engine('handlebars', handlebars.engine({
  layoutsDir: `${__dirname}/views/layouts`
}));

// Register dateFormat helper
// hbs.registerHelper('dateFormat', require('handlebars-dateformat'));

// Set up abaility to process cookies and body responses
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

// Set port
let port = 27612

// Use index file for routing
app.use("/", index);

//connect to database once app is started
db.connect(function (err) {
  if (err) throw err;
  console.log("Connected to mysql database!");
});

// Make database global
global.db = db;

//to keep the connection alive, make frequent quries to SQL database
setInterval(function () {
  db.query('SELECT 1');
}, 5000);

// Listen for web traffic
app.listen(port, function () {

  console.log("Ethereum Finance Hub running on port " + port + "!");

});
