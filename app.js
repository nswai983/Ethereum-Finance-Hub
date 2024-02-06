/*
    This app.js file is based on a medium article describing how to build a simple web application. 
    I have modified the code given in the medium article to fit the purposes of my application.

    Source: https://medium.com/@guraycintir/simple-web-application-with-node-js-and-express-70f702b08498

    HTML web pages were rendered using the express.js guide to using template engines (linked below). 

    Source: https://expressjs.com/en/guide/using-template-engines.html

    The following resources were used to create the MySQL database:

        * For troubleshooting foreign key duplicate naming issue, the following resource was used:
          https://stackoverflow.com/questions/12994919/errno-121-duplicate-key-on-write-or-update

        

*/

let express = require("express");
let index = require("./routes/index");

// Initialize app
let app = express();

// Set view engine to pug
app.set('view engine', 'pug');

// Set port
let port = 27612

// Use index.js routing file
app.use("/", index);

// Listen for web traffic
app.listen(port, function () {

    console.log("Ethereum Finance Hub running on port " + port + "!");

});