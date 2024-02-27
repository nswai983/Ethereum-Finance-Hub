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

//Sets our app to use the handlebars engine
app.set('view engine', 'handlebars');

//Sets handlebars configurations (we will go through them later on)
app.engine('handlebars', handlebars.engine({
  layoutsDir: `${__dirname}/views/layouts`
}));

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
